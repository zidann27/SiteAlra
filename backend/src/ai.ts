export type GenerateRequest = {
  businessName: string;
  businessDescription: string;
  category: string;
};

type Product = {
  name: string;
  description: string;
  price: string;
};

export type AIContent = {
  title: string;
  tagline: string;
  description: string;
  about: string;
  products: Product[];
  contact: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  heroImage: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

const categoryImages: Record<string, string> = {
  kuliner: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
  jasa: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  fashion: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg",
  kecantikan:
    "https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg",
  elektronik:
    "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg",
  pendidikan:
    "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg",
  kesehatan:
    "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg",
  umum: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg",
};

const categoryColors: Record<string, AIContent["colorScheme"]> = {
  kuliner: { primary: "#D97706", secondary: "#FEF3C7", accent: "#92400E" },
  jasa: { primary: "#0284C7", secondary: "#E0F2FE", accent: "#0C4A6E" },
  fashion: { primary: "#DB2777", secondary: "#FCE7F3", accent: "#831843" },
  kecantikan: { primary: "#BE185D", secondary: "#FDF2F8", accent: "#500724" },
  elektronik: { primary: "#0369A1", secondary: "#EFF6FF", accent: "#1E3A5F" },
  pendidikan: { primary: "#059669", secondary: "#ECFDF5", accent: "#064E3B" },
  kesehatan: { primary: "#DC2626", secondary: "#FEF2F2", accent: "#7F1D1D" },
  umum: { primary: "#1D4ED8", secondary: "#EFF6FF", accent: "#1E3A5F" },
};

export function generateMockContent(req: GenerateRequest): AIContent {
  const colorScheme = categoryColors[req.category] || categoryColors.umum;
  const heroImage = categoryImages[req.category] || categoryImages.umum;

  const categoryLabels: Record<string, string> = {
    kuliner: "Kuliner",
    jasa: "Jasa & Layanan",
    fashion: "Fashion & Pakaian",
    kecantikan: "Kecantikan & Perawatan",
    elektronik: "Elektronik & Gadget",
    pendidikan: "Pendidikan & Kursus",
    kesehatan: "Kesehatan & Kebugaran",
    umum: "Bisnis",
  };

  const categoryLabel = categoryLabels[req.category] || "Bisnis";

  const products: Product[] = [
    {
      name: "Produk Unggulan 1",
      description: "Produk berkualitas tinggi dengan harga terjangkau",
      price: "Rp 100.000",
    },
    {
      name: "Produk Unggulan 2",
      description: "Pilihan terbaik untuk kebutuhan Anda",
      price: "Rp 200.000",
    },
    {
      name: "Paket Spesial",
      description: "Kombinasi terbaik untuk nilai maksimal",
      price: "Rp 350.000",
    },
  ];

  return {
    title: req.businessName,
    tagline: `Pilihan Terpercaya untuk ${categoryLabel} Terbaik di Kota Anda`,
    description: `${req.businessName} adalah usaha ${categoryLabel.toLowerCase()} yang berkomitmen memberikan layanan terbaik. ${req.businessDescription}`,
    about: `${req.businessName} berdiri dengan visi untuk memberikan pengalaman terbaik kepada setiap pelanggan kami. ${req.businessDescription} Kami berkomitmen untuk selalu menghadirkan kualitas terdepan dengan harga yang bersahabat.`,
    products,
    contact: {
      phone: "+62 812 3456 7890",
      email: `info@${req.businessName.toLowerCase().replace(/\s+/g, "")}.com`,
      address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110",
      hours: "Senin - Sabtu: 08.00 - 20.00 WIB",
    },
    heroImage,
    colorScheme,
  };
}

export async function generateWithOpenAI(
  req: GenerateRequest,
): Promise<AIContent> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return generateMockContent(req);

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const prompt = `You are a professional business website content creator for Indonesian SMEs (UMKM).

Generate website content for the following business in Indonesian language:
- Business Name: ${req.businessName}
- Description: ${req.businessDescription}
- Category: ${req.category}

Return a JSON object with these exact fields:
{
  "title": "business name",
  "tagline": "catchy tagline in Indonesian (max 10 words)",
  "description": "short meta description in Indonesian (max 30 words)",
  "about": "about section paragraph in Indonesian (2-3 sentences)",
  "products": [
    {"name": "product/service name", "description": "short description", "price": "price in Rupiah format"},
    {"name": "product/service name", "description": "short description", "price": "price in Rupiah format"},
    {"name": "product/service name", "description": "short description", "price": "price in Rupiah format"}
  ],
  "contact": {
    "phone": "+62 xxx xxxx xxxx",
    "email": "email@domain.com",
    "address": "realistic Indonesian address",
    "hours": "business hours"
  },
  "heroImage": "${categoryImages[req.category] || categoryImages.umum}",
  "colorScheme": ${JSON.stringify(categoryColors[req.category] || categoryColors.umum)}
}

Return ONLY the JSON object, no markdown, no explanation.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    return generateMockContent(req);
  }

  const data = await response.json();
  const content = String(data?.choices?.[0]?.message?.content ?? "").trim();
  try {
    return JSON.parse(content) as AIContent;
  } catch {
    return generateMockContent(req);
  }
}
