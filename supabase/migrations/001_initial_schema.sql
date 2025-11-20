-- ============================================
-- LocalBiz Engine - Initial Database Schema
-- Migration: 001_initial_schema
-- ============================================
--
-- This migration creates the complete database schema for LocalBiz Engine,
-- including all tables, indexes, RLS policies, and helper functions.
--
-- Tables created:
-- 1. profiles - User business profiles (extends auth.users)
-- 2. invoices - Customer invoices
-- 3. quotes - Customer quotes (devis)
-- 4. appointments - Service appointments
-- 5. clients - Customer database
-- 6. website_content - Website customization data
-- 7. usage_logs - User activity tracking
--
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- Extends Supabase auth.users with business-specific data
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    phone TEXT NOT NULL,
    address JSONB NOT NULL DEFAULT '{}'::jsonb,
    siret TEXT,

    -- Subscription fields
    subscription_tier TEXT CHECK (subscription_tier IN ('essential', 'pro', 'premium')),
    subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trial', 'incomplete', 'incomplete_expired', 'unpaid')),
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    trial_ends_at TIMESTAMPTZ,

    -- Website fields
    website_subdomain TEXT UNIQUE NOT NULL,
    website_custom_domain TEXT UNIQUE,
    website_published BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast profile lookups
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_subdomain ON profiles(website_subdomain);
CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- ============================================
-- TABLE: invoices
-- Customer invoices with line items
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Invoice identification
    invoice_number TEXT NOT NULL UNIQUE,

    -- Client information
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_address JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Invoice status and dates
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'canceled')),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,

    -- Line items (array of {description, quantity, unit_price, tax_rate, total})
    items JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Financial amounts (in cents to avoid floating point issues)
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,

    -- Additional fields
    notes TEXT,
    payment_method TEXT,
    paid_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for fast querying
CREATE INDEX idx_invoices_user_id ON invoices(user_id, created_at DESC);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_client_email ON invoices(client_email);

-- ============================================
-- TABLE: quotes (devis)
-- Customer quotes with line items
-- ============================================
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Quote identification
    quote_number TEXT NOT NULL UNIQUE,

    -- Client information
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_address JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Quote status and dates
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'expired')),
    issue_date DATE NOT NULL,
    valid_until DATE NOT NULL,

    -- Line items
    items JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Financial amounts
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,

    -- Additional fields
    notes TEXT,
    accepted_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_quotes_user_id ON quotes(user_id, created_at DESC);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_number ON quotes(quote_number);

-- ============================================
-- TABLE: appointments
-- Customer service appointments
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Client information
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,

    -- Appointment details
    service_type TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'canceled')),
    notes TEXT,
    address JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_appointments_user_id ON appointments(user_id, start_time DESC);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);

-- ============================================
-- TABLE: clients
-- Customer/client database
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Client information
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes TEXT,

    -- Statistics
    total_invoiced DECIMAL(10, 2) NOT NULL DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Ensure unique client email per user
    UNIQUE(user_id, email)
);

-- Indexes
CREATE INDEX idx_clients_user_id ON clients(user_id, name);
CREATE INDEX idx_clients_email ON clients(email);

-- ============================================
-- TABLE: website_content
-- Website customization data (one per user)
-- ============================================
CREATE TABLE IF NOT EXISTS website_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,

    -- Hero section
    hero_title TEXT NOT NULL DEFAULT 'Bienvenue',
    hero_subtitle TEXT NOT NULL DEFAULT 'Votre artisan de confiance',

    -- About section
    about_text TEXT NOT NULL DEFAULT '',

    -- Services (array of {name, description, price})
    services JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Gallery (array of {url, alt})
    gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Contact information
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    business_hours JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Social links
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- SEO
    seo_title TEXT NOT NULL DEFAULT '',
    seo_description TEXT NOT NULL DEFAULT '',

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index
CREATE INDEX idx_website_content_user_id ON website_content(user_id);

-- ============================================
-- TABLE: usage_logs
-- Track user actions for analytics and limits
-- ============================================
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    action_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id, created_at DESC);
CREATE INDEX idx_usage_logs_action_type ON usage_logs(action_type);

-- ============================================
-- FUNCTIONS: Auto-generate invoice/quote numbers
-- ============================================

-- Generate invoice number (format: INV-YYYY-MM-0001)
CREATE OR REPLACE FUNCTION generate_invoice_number(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    year_month TEXT;
    next_number INTEGER;
    invoice_number TEXT;
BEGIN
    year_month := TO_CHAR(NOW(), 'YYYY-MM');

    SELECT COALESCE(MAX(
        CAST(SUBSTRING(invoice_number FROM 'INV-\d{4}-\d{2}-(\d+)') AS INTEGER)
    ), 0) + 1 INTO next_number
    FROM invoices
    WHERE user_id = p_user_id
    AND invoice_number LIKE 'INV-' || year_month || '%';

    invoice_number := 'INV-' || year_month || '-' || LPAD(next_number::TEXT, 4, '0');

    RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Generate quote number (format: QUO-YYYY-MM-0001)
CREATE OR REPLACE FUNCTION generate_quote_number(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    year_month TEXT;
    next_number INTEGER;
    quote_number TEXT;
BEGIN
    year_month := TO_CHAR(NOW(), 'YYYY-MM');

    SELECT COALESCE(MAX(
        CAST(SUBSTRING(quote_number FROM 'QUO-\d{4}-\d{2}-(\d+)') AS INTEGER)
    ), 0) + 1 INTO next_number
    FROM quotes
    WHERE user_id = p_user_id
    AND quote_number LIKE 'QUO-' || year_month || '%';

    quote_number := 'QUO-' || year_month || '-' || LPAD(next_number::TEXT, 4, '0');

    RETURN quote_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS: Auto-update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_content_updated_at BEFORE UPDATE ON website_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: Users can only access their own data
-- ============================================

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Invoices policies
CREATE POLICY "Users can view their own invoices"
    ON invoices FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invoices"
    ON invoices FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
    ON invoices FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices"
    ON invoices FOR DELETE
    USING (auth.uid() = user_id);

-- Quotes policies
CREATE POLICY "Users can view their own quotes"
    ON quotes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quotes"
    ON quotes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotes"
    ON quotes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes"
    ON quotes FOR DELETE
    USING (auth.uid() = user_id);

-- Appointments policies
CREATE POLICY "Users can view their own appointments"
    ON appointments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments"
    ON appointments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
    ON appointments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments"
    ON appointments FOR DELETE
    USING (auth.uid() = user_id);

-- Clients policies
CREATE POLICY "Users can view their own clients"
    ON clients FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clients"
    ON clients FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
    ON clients FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
    ON clients FOR DELETE
    USING (auth.uid() = user_id);

-- Website content policies
CREATE POLICY "Users can view their own website content"
    ON website_content FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own website content"
    ON website_content FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own website content"
    ON website_content FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own website content"
    ON website_content FOR DELETE
    USING (auth.uid() = user_id);

-- Usage logs policies (read-only for users)
CREATE POLICY "Users can view their own usage logs"
    ON usage_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage logs"
    ON usage_logs FOR INSERT
    WITH CHECK (true);

-- ============================================
-- GRANTS: Ensure authenticated users can access tables
-- ============================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================
-- Migration Complete
-- ============================================

COMMENT ON TABLE profiles IS 'User business profiles extending auth.users';
COMMENT ON TABLE invoices IS 'Customer invoices with line items and payment tracking';
COMMENT ON TABLE quotes IS 'Customer quotes (devis) with line items';
COMMENT ON TABLE appointments IS 'Service appointments with scheduling';
COMMENT ON TABLE clients IS 'Customer database with contact info';
COMMENT ON TABLE website_content IS 'Website customization data (one per user)';
COMMENT ON TABLE usage_logs IS 'User activity tracking for analytics and limits';
