-- ========================================
-- RLS Policies för Zylora Dashboard
-- Kör detta i Supabase SQL Editor
-- ========================================

-- 1. Tenants - användare kan läsa sin egen tenant
DROP POLICY IF EXISTS "Users can view own tenant" ON tenants;
CREATE POLICY "Users can view own tenant" ON tenants
  FOR SELECT
  USING (id = auth.uid());

-- 2. Customers - användare kan läsa kunder som tillhör deras tenant
DROP POLICY IF EXISTS "Users can view own customers" ON customers;
CREATE POLICY "Users can view own customers" ON customers
  FOR SELECT
  USING (tenant_id = auth.uid());

-- 3. Invoices - användare kan läsa fakturor som tillhör deras tenant
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT
  USING (tenant_id = auth.uid());

-- 4. Payments - användare kan läsa betalningar som tillhör deras tenant
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT
  USING (tenant_id = auth.uid());

-- 5. Communication Log - användare kan läsa kommunikation som tillhör deras tenant
DROP POLICY IF EXISTS "Users can view own communication" ON communication_log;
CREATE POLICY "Users can view own communication" ON communication_log
  FOR SELECT
  USING (tenant_id = auth.uid());

-- 6. Dashboard View - användare kan läsa sin egen dashboard-data
DROP POLICY IF EXISTS "Users can view own dashboard" ON v_tenant_dashboard;
CREATE POLICY "Users can view own dashboard" ON v_tenant_dashboard
  FOR SELECT
  USING (tenant_id = auth.uid());

-- 7. Invoices Ready for Collection View
DROP POLICY IF EXISTS "Users can view own collection invoices" ON v_invoices_ready_for_collection;
CREATE POLICY "Users can view own collection invoices" ON v_invoices_ready_for_collection
  FOR SELECT
  USING (tenant_id = auth.uid());

-- Verifiera att RLS är aktiverad på alla tabeller
DO $$
BEGIN
  -- Aktivera RLS om den inte redan är aktiverad
  ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
  ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
  ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE communication_log ENABLE ROW LEVEL SECURITY;

  RAISE NOTICE 'RLS policies skapade!';
END $$;

-- Visa aktiva policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
