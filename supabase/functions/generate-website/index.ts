import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateRequest {
  businessName: string;
  businessDescription: string;
  category: string;
}

interface Product {
  name: string;
  description: string;
  price: string;
}

interface AIContent {
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
}

const categoryImages: Record<string, string> = {
  kuliner: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
  jasa: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  fashion: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg",
  kecantikan: "https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg",
  elektronik: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg",
  pendidikan: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg",
  kesehatan: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg",
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

function generateMockContent(req: GenerateRequest): AIContent {
  const colorScheme = categoryColors[req.category] || categoryColors["umum"];
  const heroImage = categoryImages[req.category] || categoryImages["umum"];

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

  const mockProducts: Record<string, Product[]> = {
    kuliner: [
      { name: "Paket Nasi Spesial", description: "Nasi putih dengan lauk pilihan dan sayur segar", price: "Rp 25.000" },
      { name: "Mie Goreng Istimewa", description: "Mie goreng dengan bumbu rempah pilihan yang menggugah selera", price: "Rp 20.000" },
      { name: "Paket Keluarga", description: "Paket hemat untuk 4 orang dengan menu lengkap", price: "Rp 85.000" },
    ],
    jasa: [
      { name: "Konsultasi Standar", description: "Sesi konsultasi 1 jam dengan tim profesional kami", price: "Rp 150.000" },
      { name: "Paket Bulanan", description: "Layanan penuh selama satu bulan dengan dukungan prioritas", price: "Rp 500.000" },
      { name: "Paket Premium", description: "Layanan eksklusif dengan penanganan khusus dan garansi kepuasan", price: "Rp 1.200.000" },
    ],
    fashion: [
      { name: "Kemeja Casual", description: "Kemeja bahan premium cocok untuk berbagai kesempatan", price: "Rp 180.000" },
      { name: "Celana Chino", description: "Celana chino modern dengan bahan berkualitas tinggi", price: "Rp 220.000" },
      { name: "Dress Batik Modern", description: "Dress batik dengan motif kontemporer yang elegan", price: "Rp 350.000" },
    ],
  };

  const products = mockProducts[req.category] || [
    { name: "Produk Unggulan 1", description: "Produk berkualitas tinggi dengan harga terjangkau", price: "Rp 100.000" },
    { name: "Produk Unggulan 2", description: "Pilihan terbaik untuk kebutuhan Anda", price: "Rp 200.000" },
    { name: "Paket Spesial", description: "Kombinasi terbaik untuk nilai maksimal", price: "Rp 350.000" },
  ];

  return {
    title: req.businessName,
    tagline: `Pilihan Terpercaya untuk ${categoryLabel} Terbaik di Kota Anda`,
    description: `${req.businessName} adalah usaha ${categoryLabel.toLowerCase()} yang berkomitmen memberikan layanan terbaik. ${req.businessDescription}`,
    about: `${req.businessName} berdiri dengan visi untuk memberikan pengalaman terbaik kepada setiap pelanggan kami. ${req.businessDescription} Kami berkomitmen untuk selalu menghadirkan kualitas terdepan dengan harga yang bersahabat. Kepuasan pelanggan adalah prioritas utama kami dalam setiap langkah pelayanan.`,
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

async function generateWithOpenAI(req: GenerateRequest, apiKey: string): Promise<AIContent> {
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
  "heroImage": "${categoryImages[req.category] || categoryImages["umum"]}",
  "colorScheme": ${JSON.stringify(categoryColors[req.category] || categoryColors["umum"])}
}

Return ONLY the JSON object, no markdown, no explanation.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  return JSON.parse(content);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: GenerateRequest = await req.json();

    if (!body.businessName || !body.businessDescription || !body.category) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    let aiContent: AIContent;

    if (openAIKey) {
      try {
        aiContent = await generateWithOpenAI(body, openAIKey);
      } catch {
        aiContent = generateMockContent(body);
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      aiContent = generateMockContent(body);
    }

    return new Response(JSON.stringify({ success: true, data: aiContent }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error", details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
