-- ========================================
-- DIAGNOSTIK: Hitta RLS-problem
-- Kör detta i Supabase SQL Editor
-- ========================================

-- 1. Visa alla användare och deras ID
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Visa alla tenants och deras ID
SELECT id, email, name, created_at
FROM tenants
ORDER BY created_at DESC;

-- 3. Kontrollera om user ID och tenant ID matchar
-- (De MÅSTE vara samma för att RLS ska fungera)
SELECT
  u.id as user_id,
  u.email as user_email,
  t.id as tenant_id,
  t.email as tenant_email,
  CASE WHEN u.id = t.id THEN '✅ MATCHAR' ELSE '❌ MATCHAR INTE' END as status
FROM auth.users u
LEFT JOIN tenants t ON LOWER(u.email) = LOWER(t.email)
ORDER BY u.created_at DESC;

-- 4. Om de INTE matchar, kör detta för att fixa:
-- (Avkommentera och kör om det behövs)

/*
-- FIXA: Uppdatera tenant ID till att matcha user ID
UPDATE tenants
SET id = (SELECT id FROM auth.users WHERE LOWER(email) = LOWER(tenants.email))
WHERE EXISTS (SELECT 1 FROM auth.users WHERE LOWER(email) = LOWER(tenants.email));
*/

-- 5. Visa aktuella RLS policies
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;

-- 6. Kontrollera om RLS är aktiverad
SELECT relname as table_name, relrowsecurity as rls_enabled
FROM pg_class
WHERE relname IN ('tenants', 'customers', 'invoices', 'payments', 'communication_log');
