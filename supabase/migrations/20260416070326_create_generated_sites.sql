/*
  # Create Generated Sites Table

  ## Overview
  This migration creates the core table for storing AI-generated UMKM websites.

  ## New Tables
  - `generated_sites`
    - `id` (uuid, primary key) - Unique identifier
    - `business_name` (text) - Name of the business
    - `business_description` (text) - Description provided by user
    - `category` (text) - Business category (kuliner, jasa, fashion, etc.)
    - `slug` (text, unique) - URL-friendly identifier for the published site
    - `ai_content` (jsonb) - Complete AI-generated content (title, tagline, about, products, contact)
    - `view_count` (integer) - Track how many times the site was viewed
    - `created_at` (timestamptz) - When the site was created

  ## Security
  - RLS enabled on `generated_sites` table
  - Public read policy: anyone can view published sites (for /site/:slug routes)
  - Public insert policy: anyone can create a new site (no auth required for UMKM generator)
  - Public update policy: allows view count increment

  ## Notes
  1. Slug is automatically generated from business name (lowercase, hyphenated)
  2. ai_content stores structured JSON with all AI-generated content fields
  3. No authentication required - this is a public generator tool
*/

CREATE TABLE IF NOT EXISTS generated_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  business_description text NOT NULL,
  category text NOT NULL DEFAULT 'umum',
  slug text UNIQUE NOT NULL,
  ai_content jsonb NOT NULL DEFAULT '{}',
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS generated_sites_slug_idx ON generated_sites(slug);
CREATE INDEX IF NOT EXISTS generated_sites_category_idx ON generated_sites(category);
CREATE INDEX IF NOT EXISTS generated_sites_created_at_idx ON generated_sites(created_at DESC);

ALTER TABLE generated_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view generated sites"
  ON generated_sites FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create a generated site"
  ON generated_sites FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update view count"
  ON generated_sites FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
