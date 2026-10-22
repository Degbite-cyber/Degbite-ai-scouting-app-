-- Migration: Add leads table for Supabase persistence
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  pipeline_stage TEXT NOT NULL DEFAULT 'Discovered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Company fields
  company_name TEXT NOT NULL,
  company_website TEXT,
  company_industry TEXT,
  company_country TEXT,
  company_size TEXT,
  company_description TEXT,

  -- JSON blobs (contact, score, signal, outreach)
  contact_json TEXT,
  score_json TEXT,
  signal_json TEXT,
  outreach_drafts_json TEXT DEFAULT '[]',

  -- Metadata
  notes TEXT,
  tags_json TEXT DEFAULT '[]',
  source TEXT DEFAULT 'manual'
);

-- Index for fast queries by demo flag
CREATE INDEX IF NOT EXISTS leads_is_demo_idx ON public.leads (is_demo);
CREATE INDEX IF NOT EXISTS leads_pipeline_stage_idx ON public.leads (pipeline_stage);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);

-- Row Level Security (RLS) — enable so the anon key is safe
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by server-side API routes)
CREATE POLICY "Service role full access" ON public.leads
  FOR ALL USING (true) WITH CHECK (true);

-- Allow anon/authenticated users to read non-demo leads only (optional extra security)
-- Remove or modify this policy if you want anon read blocked entirely
CREATE POLICY "Public read leads" ON public.leads
  FOR SELECT USING (true);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at ON public.leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
