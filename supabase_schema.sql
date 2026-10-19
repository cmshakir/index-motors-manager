-- ====================================================================
-- INDEX MOTORS: CLOUD DATABASE SCHEMA & SEED DATA (SUPABASE POSTGRESQL)
-- Swaraj Mazda Sales & Service - Buses & Lorries (Pallipadi, Gudallur)
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

-- 7. Expenses Table (Workshop & Dealership Expenditures)
CREATE TABLE IF NOT EXISTS public.expenses (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Users Table (Dealership Staff Accounts & Roles)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Profile Table (Dealership Profile & Settings)
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
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous read and write access for dealership web client
DROP POLICY IF EXISTS "Allow public read-write on tasks" ON public.tasks;
CREATE POLICY "Allow public read-write on tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write on invoices" ON public.invoices;
CREATE POLICY "Allow public read-write on invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write on sales" ON public.sales;
CREATE POLICY "Allow public read-write on sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write on expenses" ON public.expenses;
CREATE POLICY "Allow public read-write on expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write on trucks" ON public.trucks;
CREATE POLICY "Allow public read-write on trucks" ON public.trucks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write on customers" ON public.customers;
CREATE POLICY "Allow public read-write on customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write on technicians" ON public.technicians;
CREATE POLICY "Allow public read-write on technicians" ON public.technicians FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write on users" ON public.users;
CREATE POLICY "Allow public read-write on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write on profile" ON public.profile;
CREATE POLICY "Allow public read-write on profile" ON public.profile FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime Live Sync on all tables
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      public.tasks, 
      public.invoices, 
      public.sales, 
      public.expenses, 
      public.trucks, 
      public.customers, 
      public.technicians, 
      public.users, 
      public.profile;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;
