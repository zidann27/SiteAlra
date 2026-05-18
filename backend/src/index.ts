import "dotenv/config";
import crypto from "crypto";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
import { Prisma } from "@prisma/client";
import { prisma as prismaClient } from "./db.js";
import { generateSlug, normalizeDomainSlug } from "./slug.js";
import { generateWithOpenAI, type GenerateRequest } from "./ai.js";
import { chatWithGeminiFlash, type ChatRequest } from "./gemini.js";

const prisma: any = prismaClient;

const app = express();

// Compatibility: handle camelCase vs lowercase Prisma model delegates
// Some generated clients expose `userprofile` instead of `userProfile`

// Compatibility shim: some Prisma clients expose model properties in lowercase
// e.g. `prisma.userprofile` instead of `prisma.userProfile`. Add camelCase
// aliases when missing so existing code can use `prisma.userProfile` safely.
try {
  const anyPrisma = prisma as any;
  if (!anyPrisma.userProfile && anyPrisma.userprofile) {
    anyPrisma.userProfile = anyPrisma.userprofile;
  }
  if (!anyPrisma.userProduct && anyPrisma.userproduct) {
    anyPrisma.userProduct = anyPrisma.userproduct;
  }
  if (!anyPrisma.userChatThread && anyPrisma.userchatthread) {
    anyPrisma.userChatThread = anyPrisma.userchatthread;
  }
  if (!anyPrisma.userChatMessage && anyPrisma.userchatmessage) {
    anyPrisma.userChatMessage = anyPrisma.userchatmessage;
  }
} catch (err) {
  // ignore shim errors
}
const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
const frontendUrl = process.env.FRONTEND_URL || corsOrigin;
const jwtSecret = process.env.JWT_SECRET || "CHANGE_ME";
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const googleRedirectUri =
  process.env.GOOGLE_REDIRECT_URI ||
  "http://localhost:4000/auth/google/callback";
const facebookClientId = process.env.FACEBOOK_CLIENT_ID || "";
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET || "";
const facebookRedirectUri =
  process.env.FACEBOOK_REDIRECT_URI ||
  "http://localhost:4000/auth/facebook/callback";
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const smtpFrom = process.env.SMTP_FROM || "";
const resetTokenMinutes = Number(process.env.RESET_TOKEN_MINUTES || 30);

const googleClient = new OAuth2Client(
  googleClientId,
  googleClientSecret,
  googleRedirectUri,
);

function buildLocalSiteUrl(domainName?: string | null): string | null {
  const slug = normalizeDomainSlug(domainName || "");
  if (!slug) return null;
  return `${frontendUrl.replace(/\/$/, "")}/site/${slug}`;
}

function buildSiteSlug(
  businessName: string,
  domainName?: string | null,
): string {
  const domainSlug = normalizeDomainSlug(domainName || "");
  if (domainSlug) return domainSlug;
  const baseSlug = generateSlug(businessName);
  return `${baseSlug}-${Date.now().toString(36)}`;
}

function toUtcDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function buildLast7DateKeys(): string[] {
  const keys: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    keys.push(toUtcDateKey(d));
  }
  return keys;
}

type AuthUser = { id: string; email: string; name: string | null };
type AuthedRequest = express.Request & { user: AuthUser };

const authCookieName = "sitealra_token";
const oauthStateCookieName = "sitealra_oauth_state";
const facebookStateCookieName = "sitealra_oauth_state_fb";
const isProduction = process.env.NODE_ENV === "production";
const cookieSecure = process.env.COOKIE_SECURE
  ? String(process.env.COOKIE_SECURE) === "true"
  : isProduction;
const cookieSameSite = cookieSecure ? ("none" as const) : ("lax" as const);

const authCookieOptions = {
  httpOnly: true,
  sameSite: cookieSameSite,
  secure: cookieSecure,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

function signAuthToken(user: AuthUser): string {
  return jwt.sign({ sub: user.id, email: user.email }, jwtSecret, {
    expiresIn: "7d",
  });
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function sendResetEmail(input: {
  email: string;
  resetUrl: string;
}): Promise<void> {
  if (!smtpUser || !smtpPass || !smtpFrom) {
    throw new Error("SMTP not configured");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const textBody = `Halo,

Kami menerima permintaan untuk melakukan reset password pada akun Anda.

Untuk melanjutkan proses reset password, silakan klik tautan di bawah ini:
${input.resetUrl}

Tautan ini bersifat sementara demi menjaga keamanan akun Anda. Jika Anda tidak merasa melakukan permintaan reset password, abaikan email ini dan jangan bagikan tautan tersebut kepada siapa pun.

Terima kasih,
Tim SiteAlra`;
  const htmlBody = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f7fb;
  font-family:Arial,sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table width="100%" cellpadding="0" cellspacing="0" style="
          max-width:520px;
          background:#ffffff;
          border-radius:14px;
          overflow:hidden;
          border:1px solid #e5e7eb;
        ">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 16px;">
              <h1 style="
                margin:0;
                font-size:24px;
                color:#111827;
                font-weight:700;
              ">
                SiteAlra
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:0 40px 32px;">

              <p style="
                margin:0 0 18px;
                color:#111827;
                font-size:15px;
                line-height:1.7;
              ">
                Halo,
              </p>

              <p style="
                margin:0 0 24px;
                color:#4b5563;
                font-size:15px;
                line-height:1.7;
              ">
                Kami menerima permintaan untuk mereset password akun Anda.
                Klik tombol di bawah untuk membuat password baru.
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="
                    background:#111827;
                    border-radius:10px;
                  ">
                    <a href="${input.resetUrl}" style="
                      display:inline-block;
                      padding:14px 28px;
                      color:#ffffff;
                      text-decoration:none;
                      font-size:14px;
                      font-weight:600;
                    ">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="
                margin:28px 0 10px;
                color:#6b7280;
                font-size:13px;
                line-height:1.6;
              ">
                Jika tombol tidak berfungsi, salin tautan berikut:
              </p>

              <p style="
                margin:0 0 28px;
                word-break:break-all;
              ">
                <a href="${input.resetUrl}" style="
                  color:#2563eb;
                  font-size:13px;
                  text-decoration:none;
                ">
                  ${input.resetUrl}
                </a>
              </p>

              <div style="
                height:1px;
                background:#e5e7eb;
                margin:0 0 24px;
              "></div>

              <p style="
                margin:0;
                color:#9ca3af;
                font-size:12px;
                line-height:1.7;
              ">
                Tautan ini bersifat sementara demi keamanan akun Anda.
                Jika Anda tidak merasa melakukan permintaan ini,
                abaikan email ini.
              </p>

            </td>
          </tr>

        </table>

        <!-- Footer -->
        <p style="
          margin:18px 0 0;
          color:#9ca3af;
          font-size:12px;
        ">
          © 2026 SiteAlra. All rights reserved.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
`;

  await transporter.sendMail({
    from: smtpFrom,
    to: input.email,
    subject: "Reset Password SiteAlra",
    text: textBody,
    html: htmlBody,
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

type JsonInput = Prisma.InputJsonValue | Prisma.NullTypes.JsonNull;

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
    contentImageDataUrl: null as string | null,
    themeColor: "#2563eb",
    aiContent: Prisma.JsonNull as JsonInput,
    websiteActive: false,
    visitorTotal: 0,
  };
}

function toJsonValue(value: unknown): JsonInput | undefined {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function estimateDataUrlBytes(value?: string | null): number | null {
  if (!value || typeof value !== "string") return null;
  const marker = "base64,";
  const index = value.indexOf(marker);
  if (index === -1) return value.length;
  const base64 = value.slice(index + marker.length);
  return Math.floor(base64.length * 0.75);
}

const allowedOrigins = new Set(
  [process.env.CORS_ORIGINS, corsOrigin, frontendUrl]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => value.replace(/\/+$/, "")),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has("*")) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
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
      id: crypto.randomUUID(),
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

app.post("/auth/password/forgot", async (req, res) => {
  const body = req.body as { email?: string };
  const email = body.email?.trim().toLowerCase() || "";

  if (!email) {
    return res
      .status(400)
      .json({ success: false, error: "Email wajib diisi." });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    return res.json({ success: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + resetTokenMinutes * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({
    data: {
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(
    token,
  )}`;

  try {
    await sendResetEmail({ email, resetUrl });
  } catch {
    return res
      .status(500)
      .json({ success: false, error: "Gagal mengirim email reset." });
  }

  return res.json({ success: true });
});

app.post("/auth/password/reset", async (req, res) => {
  const body = req.body as { token?: string; password?: string };
  const token = String(body.token || "").trim();
  const password = body.password || "";

  if (!token || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Token dan password wajib diisi." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ success: false, error: "Password minimal 6 karakter." });
  }

  const tokenHash = hashToken(token);
  const reset = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!reset || reset.expiresAt.getTime() < Date.now()) {
    return res.status(400).json({
      success: false,
      error: "Token reset tidak valid atau kadaluarsa.",
    });
  }

  const user = await prisma.user.findUnique({ where: { id: reset.userId } });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, error: "Akun tidak ditemukan." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
  ]);

  return res.json({ success: true });
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

app.get("/auth/facebook", (_req, res) => {
  if (!facebookClientId || !facebookClientSecret) {
    return res
      .status(500)
      .json({ success: false, error: "Facebook OAuth belum dikonfigurasi." });
  }

  const state = crypto.randomUUID();
  res.cookie(facebookStateCookieName, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 10 * 60 * 1000,
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: facebookClientId,
    redirect_uri: facebookRedirectUri,
    state,
    scope: "email,public_profile",
    response_type: "code",
  });

  return res.redirect(
    `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`,
  );
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
            id: crypto.randomUUID(),
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
    return res.redirect(`${frontendUrl}/dashboard?startNew=1`);
  } catch {
    return res.status(500).send("Google login failed.");
  }
});

app.get("/auth/facebook/callback", async (req, res) => {
  const code = String(req.query.code || "");
  const state = String(req.query.state || "");
  const storedState = req.cookies?.[facebookStateCookieName];

  if (!code || !state || !storedState || state !== storedState) {
    return res.status(400).send("Invalid OAuth state.");
  }

  try {
    const tokenParams = new URLSearchParams({
      client_id: facebookClientId,
      client_secret: facebookClientSecret,
      redirect_uri: facebookRedirectUri,
      code,
    });

    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?${tokenParams.toString()}`,
    );
    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      error?: { message?: string };
    };

    if (!tokenRes.ok || !tokenData.access_token) {
      const message =
        tokenData.error?.message || "Failed to get Facebook token.";
      return res.status(400).send(message);
    }

    const profileRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(
        tokenData.access_token,
      )}`,
    );
    const profile = (await profileRes.json()) as {
      id?: string;
      name?: string;
      email?: string;
      error?: { message?: string };
    };

    if (!profileRes.ok || !profile.id) {
      const message = profile.error?.message || "Invalid Facebook profile.";
      return res.status(400).send(message);
    }

    const email = profile.email?.toLowerCase() || "";
    const providerId = profile.id;
    const name = profile.name || null;

    if (!email) {
      return res.status(400).send("Facebook account has no email.");
    }

    let user = await prisma.user.findFirst({
      where: { provider: "facebook", providerId },
    });

    if (!user) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingByEmail) {
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            provider: existingByEmail.provider || "facebook",
            providerId: existingByEmail.providerId || providerId,
            name: existingByEmail.name || name,
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            id: crypto.randomUUID(),
            email,
            name,
            provider: "facebook",
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
    res.clearCookie(facebookStateCookieName, { path: "/" });
    return res.redirect(`${frontendUrl}/dashboard?startNew=1`);
  } catch {
    return res.status(500).send("Facebook login failed.");
  }
});

app.get("/api/owner/profile", requireAuth, async (req, res) => {
  try {
    const user = (req as AuthedRequest).user;
    let profile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          updatedAt: new Date(),
          ...defaultProfileData(),
        },
      });
    }

    const latestSite = await prisma.site.findFirst({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      data: {
        ...profile,
        visitorTotal: latestSite?.viewCount || 0,
      },
    });
  } catch {
    return res
      .status(500)
      .json({ success: false, error: "Gagal memuat profile." });
  }
});

app.get("/api/owner/analytics/visitors-7d", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const latestSite = await prisma.site.findFirst({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const dateKeys = buildLast7DateKeys();

  if (!latestSite) {
    return res.json({
      success: true,
      data: {
        siteId: null,
        slug: null,
        total: 0,
        days: dateKeys.map((date) => ({ date, value: 0 })),
      },
    });
  }

  const rows = (await prisma.$queryRaw(
    Prisma.sql`
      SELECT visitDate, count
      FROM SiteDailyVisit
      WHERE siteId = ${latestSite.id}
        AND visitDate >= ${dateKeys[0]}
      ORDER BY visitDate ASC
    `,
  )) as Array<{ visitDate: Date; count: number }>;

  const byDate = new Map<string, number>();
  for (const row of rows) {
    const dateKey = toUtcDateKey(new Date(row.visitDate));
    byDate.set(dateKey, Number(row.count) || 0);
  }

  return res.json({
    success: true,
    data: {
      siteId: latestSite.id,
      slug: latestSite.slug,
      total: latestSite.viewCount,
      days: dateKeys.map((date) => ({ date, value: byDate.get(date) || 0 })),
    },
  });
});

app.put("/api/owner/profile", requireAuth, async (req, res) => {
  try {
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
      contentImageDataUrl: body.contentImageDataUrl ?? undefined,
      themeColor: body.themeColor ?? undefined,
      aiContent: toJsonValue(body.aiContent),
      websiteActive:
        typeof body.websiteActive === "boolean"
          ? body.websiteActive
          : undefined,
      visitorTotal:
        typeof body.visitorTotal === "number" ? body.visitorTotal : undefined,
    };

    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: {
        id: crypto.randomUUID(),
        userId: user.id,
        updatedAt: new Date(),
        ...defaultProfileData(),
        ...data,
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return res.json({ success: true, data: profile });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const debugErrors = process.env.DEBUG_ERRORS === "true";
    console.error("[PUT /api/owner/profile] Error:", msg);
    return res.status(500).json({
      success: false,
      error: debugErrors
        ? `Gagal menyimpan settings. ${msg}`
        : "Gagal menyimpan settings.",
    });
  }
});

app.get("/api/owner/products", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const products = await prisma.userProduct.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
  });

  const mapped = products.map((product: any) => ({
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
  try {
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
      id: product.id || crypto.randomUUID(),
      userId: user.id,
      name: product.name?.trim() || "",
      description: product.description?.trim() || "",
      price: toNumber(product.price).toFixed(2),
      imageDataUrl: product.imageDataUrl || null,
      sortOrder: toNumber(product.sortOrder),
      isActive: product.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      data: updated.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        description: product.description || "",
        imageDataUrl: product.imageDataUrl || null,
        sortOrder: product.sortOrder,
        isActive: product.isActive,
      })),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[PUT /api/owner/products] Error:", msg);
    return res
      .status(500)
      .json({ success: false, error: "Gagal menyimpan produk: " + msg });
  }
});

app.get("/api/owner/chat", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const limit = Math.min(Number(req.query.limit || 100), 200);

  const latestThread = await prisma.userChatThread.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  if (!latestThread) {
    return res.json({ success: true, data: [] });
  }

  const messages = await prisma.userChatMessage.findMany({
    where: { userId: user.id, threadId: latestThread.id },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  return res.json({
    success: true,
    data: messages.map((msg: any) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt.getTime(),
    })),
  });
});

app.put("/api/owner/chat", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const body = req.body as {
    messages?: Array<{
      id?: string;
      role?: string;
      content?: string;
      createdAt?: number;
    }>;
  };

  const messages = Array.isArray(body.messages) ? body.messages : [];

  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return res
        .status(400)
        .json({ success: false, error: "Pesan chat tidak valid." });
    }
  }

  let thread = await prisma.userChatThread.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  if (!thread) {
    const title = deriveThreadTitle(undefined, messages);
    thread = await prisma.userChatThread.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,
        title,
      },
    });
  }

  const createData = messages
    .filter(
      (
        msg,
      ): msg is {
        id?: string;
        role: string;
        content: string;
        createdAt?: number;
      } => Boolean(msg.role && msg.content),
    )
    .map((msg) => ({
      id: msg.id,
      userId: user.id,
      threadId: thread.id,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
    }));

  await prisma.$transaction([
    prisma.userChatMessage.deleteMany({
      where: { userId: user.id, threadId: thread.id },
    }),
    ...(createData.length
      ? [prisma.userChatMessage.createMany({ data: createData })]
      : []),
    prisma.userChatThread.update({
      where: { id: thread.id },
      data: {
        updatedAt: new Date(),
        title: maybeUpdateThreadTitle(thread.title, messages),
      },
    }),
  ]);

  return res.json({ success: true });
});

function defaultChatTitle(ts: number = Date.now()): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `Chat ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function sanitizeTitle(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function deriveThreadTitle(
  inputTitle: string | undefined,
  messages: Array<{ role?: string; content?: string }>,
): string {
  const trimmed = (inputTitle || "").trim();
  if (trimmed) return trimmed;

  const userMsg = messages.find(
    (m) =>
      m?.role === "user" && typeof m.content === "string" && m.content.trim(),
  );
  const base = sanitizeTitle(String(userMsg?.content || ""));
  if (!base) return defaultChatTitle();
  return base.length > 50 ? `${base.slice(0, 50)}…` : base;
}

function maybeUpdateThreadTitle(
  currentTitle: string,
  messages: Array<{ role?: string; content?: string }>,
): string {
  if (
    !currentTitle ||
    currentTitle === "Chat" ||
    currentTitle.startsWith("Chat ")
  ) {
    return deriveThreadTitle(undefined, messages);
  }
  return currentTitle;
}

app.get("/api/owner/chat/threads", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;

  const threads = await prisma.userChatThread.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { userchatmessage: true } } },
  });

  return res.json({
    success: true,
    data: (threads as any[]).map((t) => ({
      id: t.id,
      title: t.title,
      createdAt: t.createdAt.getTime(),
      updatedAt: t.updatedAt.getTime(),
      messageCount: t._count.userchatmessage,
    })),
  });
});

app.post("/api/owner/chat/threads", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const body = req.body as {
    title?: string;
    messages?: Array<{
      id?: string;
      role?: string;
      content?: string;
      createdAt?: number;
    }>;
  };

  const title = body.title?.trim();
  const messages = Array.isArray(body.messages) ? body.messages : [];

  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return res
        .status(400)
        .json({ success: false, error: "Pesan chat tidak valid." });
    }
  }

  const thread = await prisma.userChatThread.create({
    data: {
      id: crypto.randomUUID(),
      userId: user.id,
      title: deriveThreadTitle(title, messages),
    },
  });

  const createData = messages
    .filter(
      (
        msg,
      ): msg is {
        id?: string;
        role: string;
        content: string;
        createdAt?: number;
      } => Boolean(msg.role && msg.content),
    )
    .map((msg) => ({
      id: msg.id,
      userId: user.id,
      threadId: thread.id,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
    }));

  if (createData.length) {
    await prisma.userChatMessage.createMany({ data: createData });
  }

  return res.json({
    success: true,
    data: {
      id: thread.id,
      title: thread.title,
      createdAt: thread.createdAt.getTime(),
      updatedAt: thread.updatedAt.getTime(),
      messageCount: createData.length,
    },
  });
});

app.get("/api/owner/chat/threads/:threadId", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const threadId = String(req.params.threadId || "").trim();
  const limit = Math.min(Number(req.query.limit || 200), 500);

  if (!threadId) {
    return res
      .status(400)
      .json({ success: false, error: "Thread tidak valid." });
  }

  const thread = await prisma.userChatThread.findFirst({
    where: { id: threadId, userId: user.id },
  });

  if (!thread) {
    return res
      .status(404)
      .json({ success: false, error: "Thread tidak ditemukan." });
  }

  const messages = await prisma.userChatMessage.findMany({
    where: { userId: user.id, threadId },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  return res.json({
    success: true,
    data: messages.map((msg: any) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt.getTime(),
    })),
  });
});

app.put("/api/owner/chat/threads/:threadId", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  const threadId = String(req.params.threadId || "").trim();
  const body = req.body as {
    messages?: Array<{
      id?: string;
      role?: string;
      content?: string;
      createdAt?: number;
    }>;
  };

  if (!threadId) {
    return res
      .status(400)
      .json({ success: false, error: "Thread tidak valid." });
  }

  const thread = await prisma.userChatThread.findFirst({
    where: { id: threadId, userId: user.id },
  });

  if (!thread) {
    return res
      .status(404)
      .json({ success: false, error: "Thread tidak ditemukan." });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];

  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return res
        .status(400)
        .json({ success: false, error: "Pesan chat tidak valid." });
    }
  }

  const createData = messages
    .filter(
      (
        msg,
      ): msg is {
        id?: string;
        role: string;
        content: string;
        createdAt?: number;
      } => Boolean(msg.role && msg.content),
    )
    .map((msg) => ({
      id: msg.id,
      userId: user.id,
      threadId,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
    }));

  await prisma.$transaction([
    prisma.userChatMessage.deleteMany({
      where: { userId: user.id, threadId },
    }),
    ...(createData.length
      ? [prisma.userChatMessage.createMany({ data: createData })]
      : []),
    prisma.userChatThread.update({
      where: { id: threadId },
      data: {
        updatedAt: new Date(),
        title: maybeUpdateThreadTitle(thread.title, messages),
      },
    }),
  ]);

  return res.json({ success: true });
});

app.delete("/api/owner/chat/threads", requireAuth, async (req, res) => {
  const user = (req as AuthedRequest).user;
  await prisma.userChatThread.deleteMany({ where: { userId: user.id } });
  return res.json({ success: true });
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

app.post("/api/chat", async (req, res) => {
  const body = req.body as Partial<ChatRequest>;
  if (
    !body.message ||
    typeof body.message !== "string" ||
    !body.message.trim()
  ) {
    return res.status(400).json({ success: false, error: "Missing message" });
  }

  try {
    const reply = await chatWithGeminiFlash({
      message: body.message,
      history: Array.isArray(body.history) ? body.history : [],
      context: body.context,
    });

    return res.json({ success: true, data: { reply } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Chat failed";
    const lower = msg.toLowerCase();

    // IMPORTANT: Never return raw upstream/provider error text to clients.
    // It can be noisy and may leak implementation details.
    if (
      msg.includes("RESOURCE_EXHAUSTED") ||
      msg.includes("429") ||
      lower.includes("rate limit")
    ) {
      return res.status(429).json({
        success: false,
        error:
          "Kuota Gemini (free tier) kamu 0/habis. Cek https://ai.dev/rate-limit atau buat API key baru dari Google AI Studio yang punya kuota free-tier.",
      });
    }

    if (
      msg.includes("UNAVAILABLE") ||
      msg.includes("503") ||
      lower.includes("high demand") ||
      lower.includes("sedang ramai")
    ) {
      return res.status(503).json({
        success: false,
        error:
          "Gemini sedang ramai/overload (503). Coba lagi dalam 10–30 detik.",
      });
    }

    if (msg.includes("GEMINI_API_KEY is not set")) {
      return res.status(500).json({
        success: false,
        error:
          "Server belum dikonfigurasi: GEMINI_API_KEY belum diset di backend/.env.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Chat gagal. Coba lagi sebentar.",
    });
  }
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

  const authUser = getAuthUser(req);
  const authProfile = authUser
    ? await prisma.userProfile.findUnique({ where: { userId: authUser.id } })
    : null;
  const authProfileMedia = authProfile as
    | (typeof authProfile & {
        contentImageDataUrl?: string | null;
        logoDataUrl?: string | null;
      })
    | null;
  const businessName = body.businessName;
  const businessDescription = body.businessDescription;
  const category = body.category;
  const aiContent = body.aiContent;
  const overriddenAiContent =
    authProfileMedia && aiContent && typeof aiContent === "object"
      ? {
          ...(aiContent as Record<string, unknown>),
          heroImage:
            authProfileMedia.contentImageDataUrl ??
            (aiContent as { heroImage?: unknown }).heroImage,
          brand: {
            ...((aiContent as { brand?: Record<string, unknown> }).brand ?? {}),
            logoDataUrl:
              authProfileMedia.logoDataUrl ??
              (aiContent as { brand?: { logoDataUrl?: unknown } }).brand
                ?.logoDataUrl ??
              null,
          },
        }
      : aiContent;

  const uniqueSlug = buildSiteSlug(businessName, authProfile?.domainName);

  const saveSite = (businessDescription: string) =>
    prisma.site.upsert({
      where: { slug: uniqueSlug },
      create: {
        id: crypto.randomUUID(),
        businessName,
        businessDescription,
        category,
        slug: uniqueSlug,
        aiContent: toJsonValue(overriddenAiContent) ?? Prisma.JsonNull,
        ownerId: authUser?.id || null,
      },
      update: {
        businessName,
        businessDescription,
        category,
        aiContent: toJsonValue(overriddenAiContent) ?? Prisma.JsonNull,
        ownerId: authUser?.id || null,
      },
    });

  try {
    const site = await saveSite(businessDescription);
    const url = buildLocalSiteUrl(authProfile?.domainName) || undefined;
    return res.json({ success: true, data: { ...site, url } });
  } catch (err: any) {
    // Prisma throws P2000 when a value is too long for the column.
    if (err?.code === "P2000") {
      const truncated = body.businessDescription.slice(0, 180);

      try {
        const site = await saveSite(truncated);
        const url = buildLocalSiteUrl(authProfile?.domainName) || undefined;
        return res.json({
          success: true,
          data: { ...site, url },
          warning: "businessDescription truncated to fit database column",
        });
      } catch {
        return res.status(400).json({
          success: false,
          error:
            "Deskripsi bisnis terlalu panjang. Silakan ringkas deskripsi lalu coba deploy lagi.",
        });
      }
    }

    const msg = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/sites] Error:", msg);
    return res
      .status(500)
      .json({ success: false, error: "Gagal deploy website." });
  }
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

  const todayKey = toUtcDateKey();
  await prisma.$transaction([
    prisma.site.update({
      where: { id: site.id },
      data: { viewCount: { increment: 1 } },
    }),
    prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO SiteDailyVisit (id, siteId, visitDate, count, createdAt, updatedAt)
        VALUES (${`${site.id}:${todayKey}`}, ${site.id}, ${todayKey}, 1, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
          count = count + 1,
          updatedAt = NOW()
      `,
    ),
  ]);

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
      id: crypto.randomUUID(),
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
  console.log(`API listening on http://localhost:${port}`);
});
