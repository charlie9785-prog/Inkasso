-- ========================================
-- FIX: Uppdatera RLS policies för att fungera korrekt
-- Kör detta i Supabase SQL Editor
-- ========================================

-- Problemet: RLS använder auth.uid() = tenant_id
-- Men tenant_id i data kan vara annorlunda än auth.uid()
-- Lösning: Gör lookup via email istället

-- ========================================
-- ALTERNATIV 1: Uppdatera tenant ID till user ID (REKOMMENDERAT)
-- ========================================

-- Steg 1: Visa vad som kommer att ändras
SELECT
  t.id as current_tenant_id,
  u.id as should_be_user_id,
  t.email
FROM tenants t
JOIN auth.users u ON LOWER(u.email) = LOWER(t.email)
WHERE t.id != u.id;

-- Steg 2: Uppdatera alla relaterade tabeller först (foreign keys)
-- Uppdatera invoices
UPDATE invoices i
SET tenant_id = u.id
FROM tenants t
JOIN auth.users u ON LOWER(u.email) = LOWER(t.email)
WHERE i.tenant_id = t.id AND t.id != u.id;

-- Uppdatera customers
UPDATE customers c
SET tenant_id = u.id
FROM tenants t
JOIN auth.users u ON LOWER(u.email) = LOWER(t.email)
WHERE c.tenant_id = t.id AND t.id != u.id;

-- Uppdatera payments
UPDATE payments p
SET tenant_id = u.id
FROM tenants t
JOIN auth.users u ON LOWER(u.email) = LOWER(t.email)
WHERE p.tenant_id = t.id AND t.id != u.id;

-- Uppdatera communication_log
UPDATE communication_log cl
SET tenant_id = u.id
FROM tenants t
JOIN auth.users u ON LOWER(u.email) = LOWER(t.email)
WHERE cl.tenant_id = t.id AND t.id != u.id;

-- Steg 3: Uppdatera tenant ID sist
UPDATE tenants t
SET id = u.id
FROM auth.users u
WHERE LOWER(u.email) = LOWER(t.email) AND t.id != u.id;

-- ========================================
-- ALTERNATIV 2: Om du INTE vill ändra ID:n
-- Skapa en funktion som hittar tenant_id via email
-- ========================================

/*
-- Skapa hjälpfunktion
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
  SELECT id FROM tenants
  WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Uppdatera RLS policies att använda funktionen
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT
  USING (tenant_id = get_user_tenant_id());

DROP POLICY IF EXISTS "Users can view own customers" ON customers;
CREATE POLICY "Users can view own customers" ON customers
  FOR SELECT
  USING (tenant_id = get_user_tenant_id());

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT
  USING (tenant_id = get_user_tenant_id());

DROP POLICY IF EXISTS "Users can view own communication" ON communication_log;
CREATE POLICY "Users can view own communication" ON communication_log
  FOR SELECT
  USING (tenant_id = get_user_tenant_id());
*/

-- ========================================
-- Verifiera att allt fungerar
-- ========================================

-- Kolla att ID:n nu matchar
SELECT
  u.id as user_id,
  t.id as tenant_id,
  u.email,
  CASE WHEN u.id = t.id THEN '✅ OK' ELSE '❌ FEL' END as status
FROM auth.users u
LEFT JOIN tenants t ON LOWER(u.email) = LOWER(t.email);

-- Räkna data per tenant
SELECT
  t.email,
  (SELECT COUNT(*) FROM invoices i WHERE i.tenant_id = t.id) as invoices,
  (SELECT COUNT(*) FROM customers c WHERE c.tenant_id = t.id) as customers,
  (SELECT COUNT(*) FROM payments p WHERE p.tenant_id = t.id) as payments
FROM tenants t;
