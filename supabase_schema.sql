-- ====================================================================
-- INDEX MOTORS: CLOUD DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Swaraj Mazda Sales & Service - Buses & Lorries (Pallipadi, Gudallur)
-- ====================================================================
-- How to use:
-- 1. Create a free account at https://supabase.com
-- 2. Create a new project (e.g. "index-motors")
-- 3. Click "SQL Editor" on the left menu, paste this entire file, and click "Run".
-- 4. Copy your Project URL & Anon Public API Key into Vercel environment variables:
--    - VITE_SUPABASE_URL
--    - VITE_SUPABASE_ANON_KEY
-- ====================================================================

-- 1. Tasks Table (Workshop Job Cards)
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Invoices Table (Commercial Sales & Workshop Billing)
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Sales Table (Commercial Vehicle CRM & Deals Pipeline)
CREATE TABLE IF NOT EXISTS public.sales (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Trucks Table (Inventory & Customer Fleet Vehicles)
CREATE TABLE IF NOT EXISTS public.trucks (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Customers Table (Fleet Accounts & Corporate Logistics)
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Technicians Table (Mechanics & Workshop Staff)
CREATE TABLE IF NOT EXISTS public.technicians (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Profile Table (Dealership Profile & Settings)
CREATE TABLE IF NOT EXISTS public.profile (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous read and write access for dealership client
CREATE POLICY "Allow public read-write on tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on trucks" ON public.trucks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on technicians" ON public.technicians FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on profile" ON public.profile FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime (optional, for live sync across devices)
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks, public.invoices, public.sales, public.trucks;
