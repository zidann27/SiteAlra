import "dotenv/config";
import crypto from "crypto";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "./db.js";
import { generateSlug } from "./slug.js";
import { generateWithOpenAI, type GenerateRequest } from "./ai.js";

const app = express();

const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
const frontendUrl = process.env.FRONTEND_URL || corsOrigin;
const jwtSecret = process.env.JWT_SECRET || "CHANGE_ME";
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const googleRedirectUri =
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:4000/auth/google/callback";

const googleClient = new OAuth2Client(
  googleClientId,
  googleClientSecret,
  googleRedirectUri,
);

type AuthUser = { id: string; email: string; name: string | null };
type AuthedRequest = express.Request & { user: AuthUser };

const authCookieName = "sitealra_token";
const oauthStateCookieName = "sitealra_oauth_state";
const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

function signAuthToken(user: AuthUser): string {
  return jwt.sign({ sub: user.id, email: user.email }, jwtSecret, {
    expiresIn: "7d",
  });
}

function getAuthUser(req: express.Request): AuthUser | null {
  const token = req.cookies?.[authCookieName];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, jwtSecret) as {
      sub?: string;
      email?: string;
    };
    if (!payload.sub || !payload.email) return null;
    return { id: payload.sub, email: payload.email, name: null };
  } catch {
    return null;
  }
}

function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  (req as AuthedRequest).user = user;
  next();
}

function defaultProfileData() {
  return {
    name: "",
    businessType: "kuliner",
    shortDescription: "",
    targetCustomers: "",
    style: "modern",
    ownerEmail: "",
    phone: "",
    publicEmail: "",
    address: "",
    hours: "",
    domainName: "",
    logoDataUrl: null as string | null,
    themeColor: "#2563eb",
    aiContent: null as unknown | null,
    websiteActive: false,
    visitorTotal: 0,
  };
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/auth/me", (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  return res.json({ success: true, data: user });
});

app.post("/auth/register", async (req, res) => {
  const body = req.body as {
    email?: string;
    password?: string;
    name?: string;
  };

  const email = body.email?.trim().toLowerCase();
  const password = body.password || "";
  const name = body.name?.trim() || null;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Email dan password wajib diisi." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ success: false, error: "Password minimal 6 karakter." });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, error: "Email sudah terdaftar." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      provider: "local",
    },
  });

  const token = signAuthToken({ id: user.id, email: user.email, name });
  res.cookie(authCookieName, token, authCookieOptions);
  return res.json({
    success: true,
    data: { id: user.id, email: user.email, name: user.name ?? null },
  });
});

app.post("/auth/login", async (req, res) => {
  const body = req.body as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Email dan password wajib diisi." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return res
      .status(401)
      .json({ success: false, error: "Email atau password salah." });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res
      .status(401)
      .json({ success: false, error: "Email atau password salah." });
  }

  const token = signAuthToken({
    id: user.id,
    email: user.email,
    name: user.name ?? null,
  });
  res.cookie(authCookieName, token, authCookieOptions);
  return res.json({
    success: true,
    data: { id: user.id, email: user.email, name: user.name ?? null },
  });
});

app.post("/auth/logout", (_req, res) => {
  res.clearCookie(authCookieName, { path: "/" });
  return res.json({ success: true });
});

app.get("/auth/google", (_req, res) => {
  if (!googleClientId || !googleClientSecret) {
    return res
      .status(500)
      .json({ success: false, error: "Google OAuth belum dikonfigurasi." });
  }

  const state = crypto.randomUUID();
  res.cookie(oauthStateCookieName, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 10 * 60 * 1000,
    path: "/",
  });

  const url = googleClient.generateAuthUrl({
    scope: ["openid", "email", "profile"],
    state,
    prompt: "consent",
  });
  return res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
  const code = String(req.query.code || "");
  const state = String(req.query.state || "");
  const storedState = req.cookies?.[oauthStateCookieName];

  if (!code || !state || !storedState || state !== storedState) {
    return res.status(400).send("Invalid OAuth state.");
  }

  try {
    const { tokens } = await googleClient.getToken(code);
    if (!tokens.id_token) {
      return res.status(400).send("Missing Google token.");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase() || "";
    const providerId = payload?.sub || "";
    const name = payload?.name || null;

    if (!email || !providerId) {
      return res.status(400).send("Invalid Google profile.");
    }

    let user = await prisma.user.findFirst({
      where: { provider: "google", providerId },
    });

    if (!user) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingByEmail) {
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            provider: existingByEmail.provider || "google",
            providerId: existingByEmail.providerId || providerId,
            name: existingByEmail.name || name,
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            name,
            provider: "google",
            providerId,
          },
        });
      }
    }

    const token = signAuthToken({
      id: user.id,
      email: user.email,
      name: user.name ?? null,
    });
    res.cookie(authCookieName, token, authCookieOptions);
    res.clearCookie(oauthStateCookieName, { path: "/" });
    return res.redirect(`${frontendUrl}/dashboard`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Google OAuth error:", err);
    return res.status(500).send("Google login failed.");
  }
});

app.get("/api/owner/profile", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  let profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    profile = await prisma.userProfile.create({
      data: { userId: user.id, ...defaultProfileData() },
    });
  }

  return res.json({ success: true, data: profile });
});

app.put("/api/owner/profile", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const body = req.body as Partial<ReturnType<typeof defaultProfileData>> & {
    aiContent?: unknown;
  };

  const data = {
    name: body.name ?? undefined,
    businessType: body.businessType ?? undefined,
    shortDescription: body.shortDescription ?? undefined,
    targetCustomers: body.targetCustomers ?? undefined,
    style: body.style ?? undefined,
    ownerEmail: body.ownerEmail ?? undefined,
    phone: body.phone ?? undefined,
    publicEmail: body.publicEmail ?? undefined,
    address: body.address ?? undefined,
    hours: body.hours ?? undefined,
    domainName: body.domainName ?? undefined,
    logoDataUrl: body.logoDataUrl ?? undefined,
    themeColor: body.themeColor ?? undefined,
    aiContent: body.aiContent ?? undefined,
    websiteActive:
      typeof body.websiteActive === "boolean" ? body.websiteActive : undefined,
    visitorTotal:
      typeof body.visitorTotal === "number" ? body.visitorTotal : undefined,
  };

  const profile = await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...defaultProfileData(), ...data },
    update: data,
  });

  return res.json({ success: true, data: profile });
});

app.get("/api/owner/products", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const products = await prisma.userProduct.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
  });

  const mapped = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    description: product.description || "",
    imageDataUrl: product.imageDataUrl || null,
    sortOrder: product.sortOrder,
    isActive: product.isActive,
  }));

  return res.json({ success: true, data: mapped });
});

app.put("/api/owner/products", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const body = req.body as {
    products?: Array<{
      id?: string;
      name?: string;
      price?: number;
      description?: string;
      imageDataUrl?: string | null;
      sortOrder?: number;
      isActive?: boolean;
    }>;
  };

  const products = Array.isArray(body.products) ? body.products : [];
  for (const product of products) {
    if (!product.name || !product.name.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Nama produk wajib diisi." });
    }
    const price = toNumber(product.price, -1);
    if (price < 0) {
      return res
        .status(400)
        .json({ success: false, error: "Harga tidak valid." });
    }
  }

  const createData = products.map((product) => ({
    id: product.id,
    userId: user.id,
    name: product.name?.trim() || "",
    description: product.description?.trim() || "",
    price: toNumber(product.price).toFixed(2),
    imageDataUrl: product.imageDataUrl || null,
    sortOrder: toNumber(product.sortOrder),
    isActive: product.isActive ?? true,
  }));

  await prisma.$transaction([
    prisma.userProduct.deleteMany({ where: { userId: user.id } }),
    ...(createData.length
      ? [prisma.userProduct.createMany({ data: createData })]
      : []),
  ]);

  const updated = await prisma.userProduct.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
  });

  return res.json({
    success: true,
    data: updated.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      description: product.description || "",
      imageDataUrl: product.imageDataUrl || null,
      sortOrder: product.sortOrder,
      isActive: product.isActive,
    })),
  });
});

app.post("/api/generate-website", async (req, res) => {
  const body = req.body as Partial<GenerateRequest>;
  if (!body.businessName || !body.businessDescription || !body.category) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  const data = await generateWithOpenAI({
    businessName: body.businessName,
    businessDescription: body.businessDescription,
    category: body.category,
  });

  return res.json({ success: true, data });
});

app.post("/api/sites", async (req, res) => {
  const body = req.body as {
    businessName?: string;
    businessDescription?: string;
    category?: string;
    aiContent?: unknown;
  };

  if (
    !body.businessName ||
    !body.businessDescription ||
    !body.category ||
    !body.aiContent
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  const baseSlug = generateSlug(body.businessName);
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;
  const authUser = getAuthUser(req);

  const site = await prisma.site.create({
    data: {
      businessName: body.businessName,
      businessDescription: body.businessDescription,
      category: body.category,
      slug: uniqueSlug,
      aiContent: body.aiContent as any,
      ownerId: authUser?.id || null,
    },
  });

  return res.json({ success: true, data: site });
});

app.get("/api/sites", async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 6), 50);
  const sites = await prisma.site.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return res.json({ success: true, data: sites });
});

app.get("/api/owner/sites", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const sites = await prisma.site.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ success: true, data: sites });
});

app.get("/api/sites/:slug", async (req, res) => {
  const slug = req.params.slug;
  const site = await prisma.site.findUnique({ where: { slug } });
  if (!site)
    return res.status(404).json({ success: false, error: "Not found" });

  // Increment view count in background-ish (not awaiting is fine but keep it simple)
  await prisma.site.update({
    where: { id: site.id },
    data: { viewCount: { increment: 1 } },
  });

  const updated = await prisma.site.findUnique({ where: { id: site.id } });
  return res.json({ success: true, data: updated });
});

app.get("/api/sites/:siteId/products", async (req, res) => {
  const siteId = req.params.siteId;
  const products = await prisma.product.findMany({
    where: { siteId, isActive: true },
    orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
  });
  return res.json({ success: true, data: products });
});

app.post("/api/sites/:siteId/products", async (req, res) => {
  const siteId = req.params.siteId;
  const body = req.body as {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    isActive?: boolean;
    sortOrder?: number;
  };

  if (!body.name)
    return res.status(400).json({ success: false, error: "Missing name" });

  const price = Number(body.price ?? 0);
  if (!Number.isFinite(price) || price < 0) {
    return res.status(400).json({ success: false, error: "Invalid price" });
  }

  const product = await prisma.product.create({
    data: {
      siteId,
      name: body.name,
      description: body.description || null,
      price,
      imageUrl: body.imageUrl || null,
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return res.json({ success: true, data: product });
});

app.put("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body as {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    isActive?: boolean;
    sortOrder?: number;
  };

  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ success: false, error: "Invalid price" });
    }
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description:
          body.description === undefined ? undefined : body.description || null,
        price: body.price,
        imageUrl:
          body.imageUrl === undefined ? undefined : body.imageUrl || null,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
      },
    });

    return res.json({ success: true, data: product });
  } catch {
    return res.status(404).json({ success: false, error: "Not found" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.product.delete({ where: { id } });
    return res.json({ success: true });
  } catch {
    return res.status(404).json({ success: false, error: "Not found" });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
