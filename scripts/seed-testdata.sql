-- ========================================
-- Testdata för Zylora Dashboard
-- Kör detta i Supabase SQL Editor
-- ========================================

-- 1. Hämta user ID för carl@zylora.se
DO $$
DECLARE
    v_user_id UUID;
    v_tenant_id UUID;
    v_customer_1 UUID := gen_random_uuid();
    v_customer_2 UUID := gen_random_uuid();
    v_customer_3 UUID := gen_random_uuid();
    v_customer_4 UUID := gen_random_uuid();
    v_customer_5 UUID := gen_random_uuid();
    v_invoice_1 UUID := gen_random_uuid();
    v_invoice_2 UUID := gen_random_uuid();
    v_invoice_3 UUID := gen_random_uuid();
    v_invoice_4 UUID := gen_random_uuid();
    v_invoice_5 UUID := gen_random_uuid();
    v_invoice_6 UUID := gen_random_uuid();
    v_invoice_7 UUID := gen_random_uuid();
    v_invoice_8 UUID := gen_random_uuid();
BEGIN
    -- Hämta användare
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'carl@zylora.se';

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Användare carl@zylora.se finns inte. Skapa kontot först.';
    END IF;

    RAISE NOTICE 'User ID: %', v_user_id;
    v_tenant_id := v_user_id;

    -- 2. Skapa tenant (om den inte finns)
    INSERT INTO tenants (id, name, org_number, contact_email)
    VALUES (v_tenant_id, 'Zylora AB', '559123-4567', 'carl@zylora.se')
    ON CONFLICT (id) DO UPDATE SET name = 'Zylora AB';

    RAISE NOTICE 'Tenant skapad/uppdaterad';

    -- 3. Skapa kunder
    INSERT INTO customers (id, tenant_id, name, email, phone, org_number) VALUES
    (v_customer_1, v_tenant_id, 'Erik Svensson', 'erik.svensson@example.com', '070-123 45 67', NULL),
    (v_customer_2, v_tenant_id, 'Anna Lindberg', 'anna.lindberg@example.com', '073-987 65 43', NULL),
    (v_customer_3, v_tenant_id, 'Teknik AB', 'faktura@teknikab.se', '08-555 12 34', '556789-0123'),
    (v_customer_4, v_tenant_id, 'Johan Bergström', 'johan.b@gmail.com', '076-111 22 33', NULL),
    (v_customer_5, v_tenant_id, 'Bygg & Renovering HB', 'ekonomi@byggreno.se', '031-444 55 66', '969789-4561')
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE '5 kunder skapade';

    -- 4. Skapa fakturor
    INSERT INTO invoices (id, tenant_id, customer_id, fortnox_invoice_number, original_amount_sek, remaining_amount_sek, invoice_date, due_date, status) VALUES
    -- Aktiv inkasso - 30 dagar försenad
    (v_invoice_1, v_tenant_id, v_customer_1, 'F-2024-001', 15000, 15000,
     CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '30 days', 'in_collection'),
    -- Aktiv inkasso - 15 dagar försenad
    (v_invoice_2, v_tenant_id, v_customer_2, 'F-2024-002', 8500, 8500,
     CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '15 days', 'in_collection'),
    -- Överlämnad till kronofogden
    (v_invoice_3, v_tenant_id, v_customer_3, 'F-2024-003', 45000, 45000,
     CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE - INTERVAL '60 days', 'handed_off'),
    -- Betald
    (v_invoice_4, v_tenant_id, v_customer_4, 'F-2024-004', 3200, 0,
     CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '10 days', 'paid'),
    -- Delvis betald, aktiv inkasso
    (v_invoice_5, v_tenant_id, v_customer_5, 'F-2024-005', 28000, 14000,
     CURRENT_DATE - INTERVAL '75 days', CURRENT_DATE - INTERVAL '45 days', 'in_collection'),
    -- Ny - just förfallen
    (v_invoice_6, v_tenant_id, v_customer_1, 'F-2024-006', 5500, 5500,
     CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '5 days', 'new'),
    -- Betald
    (v_invoice_7, v_tenant_id, v_customer_3, 'F-2024-007', 12000, 0,
     CURRENT_DATE - INTERVAL '50 days', CURRENT_DATE - INTERVAL '20 days', 'paid'),
    -- Pausad
    (v_invoice_8, v_tenant_id, v_customer_2, 'F-2024-008', 6800, 6800,
     CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '5 days', 'paused')
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE '8 fakturor skapade';

    -- 5. Skapa betalningar
    INSERT INTO payments (id, tenant_id, invoice_id, amount_sek, payment_date, source) VALUES
    -- Betalning för F-2024-004 (helt betald)
    (gen_random_uuid(), v_tenant_id, v_invoice_4, 3200, CURRENT_DATE - INTERVAL '5 days', 'bank_transfer'),
    -- Delbetalning för F-2024-005
    (gen_random_uuid(), v_tenant_id, v_invoice_5, 14000, CURRENT_DATE - INTERVAL '20 days', 'bank_transfer'),
    -- Betalning för F-2024-007 (helt betald)
    (gen_random_uuid(), v_tenant_id, v_invoice_7, 12000, CURRENT_DATE - INTERVAL '10 days', 'bank_transfer')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '3 betalningar skapade';

    -- 6. Skapa kommunikationshistorik
    INSERT INTO communication_log (id, tenant_id, invoice_id, channel, subject, status, ai_summary, created_at) VALUES
    -- F-2024-001 kommunikation
    (gen_random_uuid(), v_tenant_id, v_invoice_1, 'email', 'Betalningspåminnelse', 'delivered',
     'Första påminnelse skickad via e-post', CURRENT_DATE - INTERVAL '27 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_1, 'sms', 'Påminnelse om obetald faktura', 'delivered',
     'SMS-påminnelse skickad', CURRENT_DATE - INTERVAL '20 days'),

    -- F-2024-002 kommunikation
    (gen_random_uuid(), v_tenant_id, v_invoice_2, 'email', 'Betalningspåminnelse', 'delivered',
     'Första påminnelse skickad via e-post', CURRENT_DATE - INTERVAL '12 days'),

    -- F-2024-003 kommunikation (överlämnad)
    (gen_random_uuid(), v_tenant_id, v_invoice_3, 'email', 'Betalningspåminnelse', 'delivered',
     'Första påminnelse skickad via e-post', CURRENT_DATE - INTERVAL '57 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_3, 'sms', 'Påminnelse om obetald faktura', 'delivered',
     'SMS-påminnelse skickad', CURRENT_DATE - INTERVAL '50 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_3, 'phone', 'Telefonsamtal - inget svar', 'failed',
     'Försök till telefonkontakt, inget svar', CURRENT_DATE - INTERVAL '40 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_3, 'letter', 'Inkassokrav', 'sent',
     'Formellt inkassokrav skickat per post', CURRENT_DATE - INTERVAL '35 days'),

    -- F-2024-004 kommunikation (betald)
    (gen_random_uuid(), v_tenant_id, v_invoice_4, 'email', 'Betalningspåminnelse', 'delivered',
     'Påminnelse skickad', CURRENT_DATE - INTERVAL '7 days'),

    -- F-2024-005 kommunikation (delvis betald)
    (gen_random_uuid(), v_tenant_id, v_invoice_5, 'email', 'Betalningspåminnelse', 'delivered',
     'Första påminnelse skickad', CURRENT_DATE - INTERVAL '42 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_5, 'phone', 'Telefonsamtal - betalningsplan', 'completed',
     'Överenskommelse om delbetalning', CURRENT_DATE - INTERVAL '25 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_5, 'email', 'Bekräftelse delbetalning', 'delivered',
     'Bekräftelse på mottagen delbetalning', CURRENT_DATE - INTERVAL '19 days'),

    -- F-2024-006 kommunikation (ny)
    (gen_random_uuid(), v_tenant_id, v_invoice_6, 'email', 'Betalningspåminnelse', 'delivered',
     'Första påminnelse skickad', CURRENT_DATE - INTERVAL '2 days'),

    -- F-2024-008 kommunikation (pausad)
    (gen_random_uuid(), v_tenant_id, v_invoice_8, 'email', 'Betalningspåminnelse', 'delivered',
     'Påminnelse skickad', CURRENT_DATE - INTERVAL '2 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_8, 'phone', 'Telefonsamtal - ärendet pausat', 'completed',
     'Kunden begärde anstånd pga sjukdom. Ärendet pausat i 2 veckor.', CURRENT_DATE - INTERVAL '1 days')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '14 kommunikationsposter skapade';

    RAISE NOTICE '';
    RAISE NOTICE '✅ Testdata skapad!';
    RAISE NOTICE '';
    RAISE NOTICE 'Sammanfattning:';
    RAISE NOTICE '  - Tenant: Zylora AB';
    RAISE NOTICE '  - Kunder: 5';
    RAISE NOTICE '  - Fakturor: 8';
    RAISE NOTICE '  - Betalningar: 3';
    RAISE NOTICE '  - Kommunikation: 14';

END $$;

-- Visa resultat
SELECT 'Tenants' as table_name, COUNT(*) as count FROM tenants
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments
UNION ALL
SELECT 'Communication Log', COUNT(*) FROM communication_log;
