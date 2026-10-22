-- ====================================================================
-- AI VIDEO BUYER SCOUT - PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Designed for David Adegbite (DA Automations)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & PREFERENCES
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    target_countries JSONB DEFAULT '["United States", "United Kingdom", "Canada", "Australia", "Germany", "United Arab Emirates"]'::jsonb,
    target_industries JSONB DEFAULT '["Marketing agencies", "E-commerce & DTC", "SaaS & Tech", "Real Estate Marketing", "Content Businesses"]'::jsonb,
    target_company_sizes JSONB DEFAULT '["1-10", "11-50", "51-200"]'::jsonb,
    min_qualification_score INT DEFAULT 60,
    daily_discovery_target INT DEFAULT 30,
    ai_model TEXT DEFAULT 'gemini-2.5-flash',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    normalized_domain TEXT,
    website TEXT,
    industry TEXT,
    country TEXT,
    city TEXT,
    company_size TEXT,
    description TEXT,
    linkedin_url TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orgs_domain ON public.organizations(normalized_domain);
CREATE INDEX IF NOT EXISTS idx_orgs_user_demo ON public.organizations(user_id, is_demo);

-- 4. CONTACTS (DECISION-MAKERS)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    job_title TEXT NOT NULL,
    email TEXT,
    linkedin_url TEXT,
    verification_status TEXT CHECK (verification_status IN ('verified', 'provider_reported', 'unverified', 'unavailable')) DEFAULT 'unavailable',
    verification_source TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contacts_org ON public.contacts(organization_id);

-- 5. SOURCE RECORDS (DATA PROVENANCE)
CREATE TABLE IF NOT EXISTS public.source_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_name TEXT NOT NULL, -- 'apollo', 'web_search', 'csv_import', 'rfp_feed'
    source_url TEXT,
    source_identifier TEXT,
    raw_payload JSONB,
    captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BUYING SIGNALS
CREATE TABLE IF NOT EXISTS public.buying_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    source_record_id UUID REFERENCES public.source_records(id) ON DELETE SET NULL,
    signal_category TEXT NOT NULL, -- 'explicit_request', 'strong_need', 'indirect_opportunity', 'general_fit', 'insufficient_evidence'
    evidence_summary TEXT NOT NULL,
    source_url TEXT,
    source_name TEXT,
    original_published_date TIMESTAMPTZ,
    last_verified_at TIMESTAMPTZ DEFAULT NOW(),
    confidence_level NUMERIC(3, 2) DEFAULT 0.85,
    freshness_status TEXT CHECK (freshness_status IN ('fresh', 'aging', 'expired', 'needs_review')) DEFAULT 'fresh',
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LEADS (CENTRAL ENTITY)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    primary_contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    primary_signal_id UUID REFERENCES public.buying_signals(id) ON DELETE SET NULL,
    pipeline_stage TEXT CHECK (pipeline_stage IN (
        'Discovered', 'Qualified', 'Contact Research', 'Ready for Outreach', 
        'Contacted', 'Replied', 'Interested', 'Meeting Booked', 'Proposal Sent', 'Won', 'Lost'
    )) DEFAULT 'Discovered',
    recommended_service TEXT,
    recommended_next_action TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON public.leads(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_leads_user_demo ON public.leads(user_id, is_demo);

-- 8. QUALIFICATION SCORES (100-POINT TRANSPARENT RUBRIC)
CREATE TABLE IF NOT EXISTS public.qualification_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    total_score INT NOT NULL CHECK (total_score BETWEEN 0 AND 100),
    classification TEXT CHECK (classification IN ('High Priority', 'Worth Investigating', 'Low Priority')),
    signal_score INT DEFAULT 0,          -- Max 35
    relevance_score INT DEFAULT 0,       -- Max 25
    contact_score INT DEFAULT 0,         -- Max 15
    commercial_fit_score INT DEFAULT 0,  -- Max 15
    freshness_score INT DEFAULT 0,       -- Max 10
    explanation TEXT NOT NULL,
    confidence NUMERIC(3,2) DEFAULT 0.80,
    model_version TEXT,
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    is_manual_override BOOLEAN DEFAULT FALSE,
    override_reason TEXT
);

-- 9. OUTREACH DRAFTS & APPROVAL
CREATE TABLE IF NOT EXISTS public.outreach_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    channel TEXT CHECK (channel IN ('email', 'linkedin', 'follow_up')) NOT NULL,
    tone TEXT CHECK (tone IN ('professional', 'friendly', 'direct', 'consultative')) DEFAULT 'consultative',
    subject TEXT,
    body TEXT NOT NULL,
    value_proposition TEXT,
    suggested_offer TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PIPELINE EVENTS (AUDIT TIMELINE)
CREATE TABLE IF NOT EXISTS public.pipeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    from_stage TEXT,
    to_stage TEXT NOT NULL,
    notes TEXT,
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FOLLOW-UP TASKS
CREATE TABLE IF NOT EXISTS public.follow_up_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. DISCOVERY JOBS & LOGS
CREATE TABLE IF NOT EXISTS public.discovery_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,
    search_params JSONB NOT NULL,
    status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
    leads_found INT DEFAULT 0,
    leads_qualified INT DEFAULT 0,
    error_message TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 13. INTEGRATIONS & USAGE TRACKING
CREATE TABLE IF NOT EXISTS public.integration_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_name TEXT UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    api_key_masked TEXT,
    webhook_secret TEXT,
    rate_limit_per_minute INT DEFAULT 30,
    daily_quota INT DEFAULT 500,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.provider_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_name TEXT NOT NULL,
    endpoint TEXT,
    cost_estimate_usd NUMERIC(8, 4) DEFAULT 0.0000,
    request_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SUPPRESSION LIST
CREATE TABLE IF NOT EXISTS public.suppression_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_or_email TEXT UNIQUE NOT NULL,
    reason TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Default policies (multi-tenant safe)
CREATE POLICY "Users can access their own organizations" ON public.organizations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own leads" ON public.leads
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);
