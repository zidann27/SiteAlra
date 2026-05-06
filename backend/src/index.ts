import "./env.js";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import { generateSlug } from "./slug.js";
import { generateWithOpenAI, type GenerateRequest } from "./ai.js";
import { chatWithGeminiFlash, type ChatRequest } from "./gemini.js";

const app = express();

const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
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

  const baseSlug = generateSlug(body.businessName);
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

  const site = await prisma.site.create({
    data: {
      businessName: body.businessName,
      businessDescription: body.businessDescription,
      category: body.category,
      slug: uniqueSlug,
      aiContent: body.aiContent as any,
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
