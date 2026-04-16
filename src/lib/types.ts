export interface Product {
  name: string;
  description: string;
  price: string;
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

export interface AIContent {
  title: string;
  tagline: string;
  description: string;
  about: string;
  products: Product[];
  contact: ContactInfo;
  heroImage: string;
  colorScheme: ColorScheme;
}

export interface GeneratedSite {
  id: string;
  business_name: string;
  business_description: string;
  category: string;
  slug: string;
  ai_content: AIContent;
  view_count: number;
  created_at: string;
}

export interface GenerateFormData {
  businessName: string;
  businessDescription: string;
  category: string;
}

export type GenerationStep = 'idle' | 'generating' | 'preview' | 'deployed';

export const CATEGORIES = [
  { value: 'kuliner', label: 'Kuliner & Makanan', icon: '🍜' },
  { value: 'jasa', label: 'Jasa & Layanan', icon: '🔧' },
  { value: 'fashion', label: 'Fashion & Pakaian', icon: '👗' },
  { value: 'kecantikan', label: 'Kecantikan & Perawatan', icon: '💄' },
  { value: 'elektronik', label: 'Elektronik & Gadget', icon: '📱' },
  { value: 'pendidikan', label: 'Pendidikan & Kursus', icon: '📚' },
  { value: 'kesehatan', label: 'Kesehatan & Kebugaran', icon: '🏥' },
  { value: 'umum', label: 'Bisnis Umum', icon: '🏢' },
];
