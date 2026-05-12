export interface Product {
  name: string;
  description: string;
  price: string;
  imageDataUrl?: string | null;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface BrandInfo {
  logoDataUrl?: string | null;
}

export interface AIContent {
  style?: "modern" | "minimal" | "food" | "luxury";
  title: string;
  tagline: string;
  description: string;
  about: string;
  products: Product[];
  contact: ContactInfo;
  heroImage: string;
  colorScheme: ColorScheme;
  brand?: BrandInfo;
}

export interface GeneratedSite {
  id: string;
  businessName: string;
  businessDescription: string;
  category: string;
  slug: string;
  aiContent: AIContent;
  viewCount: number;
  createdAt: string;
}

export interface SiteProduct {
  id: string;
  siteId: string;
  name: string;
  description: string | null;
  price: string; // decimal serialized from backend
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateFormData {
  businessName: string;
  businessDescription: string;
  category: string;
}

export type GenerationStep = "idle" | "generating" | "preview" | "deployed";

export const CATEGORIES = [
  { value: "kuliner", label: "Kuliner & Makanan", icon: "🍜" },
  { value: "jasa", label: "Jasa & Layanan", icon: "🔧" },
  { value: "fashion", label: "Fashion & Pakaian", icon: "👗" },
  { value: "kecantikan", label: "Kecantikan & Perawatan", icon: "💄" },
  { value: "elektronik", label: "Elektronik & Gadget", icon: "📱" },
  { value: "pendidikan", label: "Pendidikan & Kursus", icon: "📚" },
  { value: "kesehatan", label: "Kesehatan & Kebugaran", icon: "🏥" },
  { value: "umum", label: "Bisnis Umum", icon: "🏢" },
];
