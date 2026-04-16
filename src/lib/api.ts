import { supabase } from './supabase';
import { AIContent, GenerateFormData, GeneratedSite } from './types';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-website`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export async function generateWebsiteContent(formData: GenerateFormData): Promise<AIContent> {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      businessName: formData.businessName,
      businessDescription: formData.businessDescription,
      category: formData.category,
    }),
  });

  if (!response.ok) {
    throw new Error(`Generation failed: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Generation failed');
  }

  return result.data as AIContent;
}

export function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

export async function deploySite(
  formData: GenerateFormData,
  aiContent: AIContent
): Promise<GeneratedSite> {
  const baseSlug = generateSlug(formData.businessName);
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from('generated_sites')
    .insert({
      business_name: formData.businessName,
      business_description: formData.businessDescription,
      category: formData.category,
      slug: uniqueSlug,
      ai_content: aiContent,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as GeneratedSite;
}

export async function getSiteBySlug(slug: string): Promise<GeneratedSite | null> {
  const { data, error } = await supabase
    .from('generated_sites')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (data) {
    await supabase
      .from('generated_sites')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', data.id);
  }

  return data as GeneratedSite | null;
}

export async function getRecentSites(limit = 6): Promise<GeneratedSite[]> {
  const { data, error } = await supabase
    .from('generated_sites')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data || []) as GeneratedSite[];
}
