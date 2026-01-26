-- ========================================
-- Demo-data för Charlie9785@gmail.com
-- Kör detta i Supabase SQL Editor
-- ========================================

DO $$
DECLARE
    v_user_id UUID;
    v_tenant_id UUID;
    v_customer_1 UUID := gen_random_uuid();
    v_customer_2 UUID := gen_random_uuid();
    v_customer_3 UUID := gen_random_uuid();
    v_customer_4 UUID := gen_random_uuid();
    v_customer_5 UUID := gen_random_uuid();
    v_customer_6 UUID := gen_random_uuid();
    v_invoice_1 UUID := gen_random_uuid();
    v_invoice_2 UUID := gen_random_uuid();
    v_invoice_3 UUID := gen_random_uuid();
    v_invoice_4 UUID := gen_random_uuid();
    v_invoice_5 UUID := gen_random_uuid();
    v_invoice_6 UUID := gen_random_uuid();
    v_invoice_7 UUID := gen_random_uuid();
    v_invoice_8 UUID := gen_random_uuid();
    v_invoice_9 UUID := gen_random_uuid();
    v_invoice_10 UUID := gen_random_uuid();
BEGIN
    -- Hämta användare
    SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER('Charlie9785@gmail.com');

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Användare Charlie9785@gmail.com finns inte.';
    END IF;

    RAISE NOTICE 'User ID: %', v_user_id;

    -- Hämta tenant_id
    SELECT id INTO v_tenant_id FROM tenants WHERE LOWER(email) = LOWER('Charlie9785@gmail.com');

    IF v_tenant_id IS NULL THEN
        v_tenant_id := v_user_id;
    END IF;

    RAISE NOTICE 'Tenant ID: %', v_tenant_id;

    -- Rensa befintlig demo-data
    DELETE FROM communication_log WHERE tenant_id = v_tenant_id;
    DELETE FROM payments WHERE tenant_id = v_tenant_id;
    DELETE FROM invoices WHERE tenant_id = v_tenant_id;
    DELETE FROM customers WHERE tenant_id = v_tenant_id;

    RAISE NOTICE 'Befintlig data rensad';

    -- Skapa kunder
    INSERT INTO customers (id, tenant_id, name, email, phone, org_number) VALUES
    (v_customer_1, v_tenant_id, 'Erik Johansson', 'erik.johansson@example.com', '070-123 45 67', NULL),
    (v_customer_2, v_tenant_id, 'Maria Andersson', 'maria.andersson@example.com', '073-987 65 43', NULL),
    (v_customer_3, v_tenant_id, 'Nordisk Teknik AB', 'faktura@nordiskteknik.se', '08-555 12 34', '556789-0123'),
    (v_customer_4, v_tenant_id, 'Stefan Lindqvist', 'stefan.l@gmail.com', '076-111 22 33', NULL),
    (v_customer_5, v_tenant_id, 'Byggmästarna i Stockholm HB', 'ekonomi@byggmastarna.se', '08-444 55 66', '969789-4561'),
    (v_customer_6, v_tenant_id, 'Anna Bergström', 'anna.bergstrom@hotmail.com', '072-333 44 55', NULL);

    RAISE NOTICE '6 kunder skapade';

    -- Skapa fakturor med olika statusar
    INSERT INTO invoices (id, tenant_id, customer_id, fortnox_invoice_number, original_amount_sek, remaining_amount_sek, invoice_date, due_date, status) VALUES
    -- Aktiva inkassoärenden
    (v_invoice_1, v_tenant_id, v_customer_1, 'F-2025-001', 18500, 18500,
     CURRENT_DATE - INTERVAL '55 days', CURRENT_DATE - INTERVAL '25 days', 'in_collection'),
    (v_invoice_2, v_tenant_id, v_customer_3, 'F-2025-002', 67000, 67000,
     CURRENT_DATE - INTERVAL '70 days', CURRENT_DATE - INTERVAL '40 days', 'in_collection'),
    (v_invoice_3, v_tenant_id, v_customer_5, 'F-2025-003', 125000, 125000,
     CURRENT_DATE - INTERVAL '80 days', CURRENT_DATE - INTERVAL '50 days', 'in_collection'),

    -- Överlämnad till Kronofogden
    (v_invoice_4, v_tenant_id, v_customer_2, 'F-2024-089', 34500, 34500,
     CURRENT_DATE - INTERVAL '120 days', CURRENT_DATE - INTERVAL '90 days', 'handed_off'),

    -- Betalda fakturor
    (v_invoice_5, v_tenant_id, v_customer_4, 'F-2025-004', 8900, 0,
     CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '15 days', 'paid'),
    (v_invoice_6, v_tenant_id, v_customer_6, 'F-2025-005', 4200, 0,
     CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '10 days', 'paid'),
    (v_invoice_7, v_tenant_id, v_customer_1, 'F-2024-095', 22000, 0,
     CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '30 days', 'paid'),

    -- Delvis betald
    (v_invoice_8, v_tenant_id, v_customer_3, 'F-2025-006', 45000, 20000,
     CURRENT_DATE - INTERVAL '50 days', CURRENT_DATE - INTERVAL '20 days', 'in_collection'),

    -- Nya ärenden (pending = nyligen förfallen)
    (v_invoice_9, v_tenant_id, v_customer_4, 'F-2025-007', 6800, 6800,
     CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '3 days', 'pending'),

    -- Pausad
    (v_invoice_10, v_tenant_id, v_customer_6, 'F-2025-008', 15200, 15200,
     CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '10 days', 'paused');

    RAISE NOTICE '10 fakturor skapade';

    -- Skapa betalningar
    INSERT INTO payments (id, tenant_id, invoice_id, customer_id, amount_sek, payment_date, source) VALUES
    (gen_random_uuid(), v_tenant_id, v_invoice_5, v_customer_4, 8900, CURRENT_DATE - INTERVAL '8 days', 'bank_transfer'),
    (gen_random_uuid(), v_tenant_id, v_invoice_6, v_customer_6, 4200, CURRENT_DATE - INTERVAL '5 days', 'swish'),
    (gen_random_uuid(), v_tenant_id, v_invoice_7, v_customer_1, 22000, CURRENT_DATE - INTERVAL '20 days', 'bank_transfer'),
    (gen_random_uuid(), v_tenant_id, v_invoice_8, v_customer_3, 15000, CURRENT_DATE - INTERVAL '12 days', 'bank_transfer'),
    (gen_random_uuid(), v_tenant_id, v_invoice_8, v_customer_3, 10000, CURRENT_DATE - INTERVAL '5 days', 'bank_transfer');

    RAISE NOTICE '5 betalningar skapade';

    -- Skapa kommunikationshistorik
    INSERT INTO communication_log (id, tenant_id, invoice_id, customer_id, direction, channel, subject, status, ai_summary, created_at) VALUES
    -- F-2025-001 (aktiv inkasso) - Erik Johansson
    (gen_random_uuid(), v_tenant_id, v_invoice_1, v_customer_1, 'outbound', 'email', 'Betalningspåminnelse - Faktura F-2025-001', 'delivered',
     'Första påminnelse skickad. Faktura på 18 500 kr förfallen 25 dagar.', CURRENT_DATE - INTERVAL '22 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_1, v_customer_1, 'outbound', 'sms', 'Påminnelse om obetald faktura', 'delivered',
     'SMS-påminnelse skickad till kund.', CURRENT_DATE - INTERVAL '15 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_1, v_customer_1, 'outbound', 'phone', 'Uppföljningssamtal', 'completed',
     'Talade med Erik. Han lovade betala inom 5 dagar. Inväntar betalning.', CURRENT_DATE - INTERVAL '10 days'),

    -- F-2025-002 (aktiv inkasso - företag) - Nordisk Teknik AB
    (gen_random_uuid(), v_tenant_id, v_invoice_2, v_customer_3, 'outbound', 'email', 'Betalningspåminnelse - Faktura F-2025-002', 'delivered',
     'Påminnelse skickad till Nordisk Teknik AB. Belopp: 67 000 kr.', CURRENT_DATE - INTERVAL '37 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_2, v_customer_3, 'outbound', 'email', 'Andra påminnelsen - Faktura F-2025-002', 'delivered',
     'Andra påminnelse skickad. Ingen respons på första.', CURRENT_DATE - INTERVAL '30 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_2, v_customer_3, 'outbound', 'phone', 'Kontaktförsök', 'failed',
     'Inget svar på telefon. Lämnade röstmeddelande.', CURRENT_DATE - INTERVAL '25 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_2, v_customer_3, 'outbound', 'email', 'Inkassokrav', 'sent',
     'Formellt inkassokrav skickat per post.', CURRENT_DATE - INTERVAL '20 days'),

    -- F-2025-003 (aktiv inkasso - stort belopp) - Byggmästarna i Stockholm HB
    (gen_random_uuid(), v_tenant_id, v_invoice_3, v_customer_5, 'outbound', 'email', 'Betalningspåminnelse - Faktura F-2025-003', 'delivered',
     'Påminnelse skickad. Stort belopp: 125 000 kr.', CURRENT_DATE - INTERVAL '47 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_3, v_customer_5, 'outbound', 'phone', 'Förhandling om betalningsplan', 'completed',
     'Diskuterade betalningsplan med ekonomiansvarig. De vill dela upp på 3 månader.', CURRENT_DATE - INTERVAL '40 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_3, v_customer_5, 'outbound', 'email', 'Betalningsplan - väntar på bekräftelse', 'delivered',
     'Skickat förslag på betalningsplan. Inväntar signerat avtal.', CURRENT_DATE - INTERVAL '35 days'),

    -- F-2024-089 (överlämnad till Kronofogden) - Maria Andersson
    (gen_random_uuid(), v_tenant_id, v_invoice_4, v_customer_2, 'outbound', 'email', 'Betalningspåminnelse', 'delivered',
     'Första påminnelse skickad.', CURRENT_DATE - INTERVAL '87 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_4, v_customer_2, 'outbound', 'sms', 'Brådskande påminnelse', 'delivered',
     'SMS skickat.', CURRENT_DATE - INTERVAL '80 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_4, v_customer_2, 'outbound', 'phone', 'Kontaktförsök', 'failed',
     'Nummer ej i bruk.', CURRENT_DATE - INTERVAL '75 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_4, v_customer_2, 'outbound', 'email', 'Inkassokrav', 'sent',
     'Inkassokrav skickat.', CURRENT_DATE - INTERVAL '70 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_4, v_customer_2, 'outbound', 'email', 'Slutkrav före Kronofogden', 'sent',
     'Sista varning innan överlämning till Kronofogden.', CURRENT_DATE - INTERVAL '50 days'),

    -- F-2025-005 (betald efter påminnelse) - Anna Bergström
    (gen_random_uuid(), v_tenant_id, v_invoice_6, v_customer_6, 'outbound', 'email', 'Betalningspåminnelse', 'delivered',
     'Påminnelse skickad.', CURRENT_DATE - INTERVAL '7 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_6, v_customer_6, 'outbound', 'email', 'Bekräftelse på mottagen betalning', 'delivered',
     'Tack för betalningen! Faktura F-2025-005 är nu betald.', CURRENT_DATE - INTERVAL '5 days'),

    -- F-2025-006 (delbetalning) - Nordisk Teknik AB
    (gen_random_uuid(), v_tenant_id, v_invoice_8, v_customer_3, 'outbound', 'email', 'Betalningspåminnelse', 'delivered',
     'Påminnelse skickad för 45 000 kr.', CURRENT_DATE - INTERVAL '17 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_8, v_customer_3, 'outbound', 'phone', 'Betalningsplan överenskommen', 'completed',
     'Kunden betalar i omgångar. Första delbetalning 15 000 kr mottagen.', CURRENT_DATE - INTERVAL '12 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_8, v_customer_3, 'outbound', 'email', 'Bekräftelse delbetalning', 'delivered',
     'Bekräftelse på delbetalning 10 000 kr. Återstår 20 000 kr.', CURRENT_DATE - INTERVAL '5 days'),

    -- F-2025-007 (ny) - Stefan Lindqvist
    (gen_random_uuid(), v_tenant_id, v_invoice_9, v_customer_4, 'outbound', 'email', 'Betalningspåminnelse - Faktura F-2025-007', 'delivered',
     'Första påminnelse skickad. Faktura nyligen förfallen.', CURRENT_DATE - INTERVAL '1 days'),

    -- F-2025-008 (pausad) - Anna Bergström
    (gen_random_uuid(), v_tenant_id, v_invoice_10, v_customer_6, 'outbound', 'email', 'Betalningspåminnelse', 'delivered',
     'Påminnelse skickad.', CURRENT_DATE - INTERVAL '7 days'),
    (gen_random_uuid(), v_tenant_id, v_invoice_10, v_customer_6, 'outbound', 'phone', 'Ärende pausat - personliga skäl', 'completed',
     'Kunden meddelade sjukdom i familjen. Ärendet pausat i 2 veckor enligt överenskommelse.', CURRENT_DATE - INTERVAL '3 days');

    RAISE NOTICE '24 kommunikationsposter skapade';

    RAISE NOTICE '';
    RAISE NOTICE '✅ Demo-data skapad för Charlie9785@gmail.com!';
    RAISE NOTICE '';
    RAISE NOTICE 'Sammanfattning:';
    RAISE NOTICE '  - Kunder: 6';
    RAISE NOTICE '  - Fakturor: 10';
    RAISE NOTICE '  - Betalningar: 5';
    RAISE NOTICE '  - Kommunikation: 24';
    RAISE NOTICE '';
    RAISE NOTICE 'Fakturor per status:';
    RAISE NOTICE '  - Aktiv inkasso: 4 st (totalt 230 500 kr)';
    RAISE NOTICE '  - Överlämnad Kronofogden: 1 st (34 500 kr)';
    RAISE NOTICE '  - Betalda: 3 st (35 100 kr)';
    RAISE NOTICE '  - Pending: 1 st (6 800 kr)';
    RAISE NOTICE '  - Pausade: 1 st (15 200 kr)';

END $$;

-- Visa resultat
SELECT 'Kunder' as tabell, COUNT(*) as antal FROM customers WHERE tenant_id = (SELECT id FROM tenants WHERE LOWER(email) = LOWER('Charlie9785@gmail.com'))
UNION ALL
SELECT 'Fakturor', COUNT(*) FROM invoices WHERE tenant_id = (SELECT id FROM tenants WHERE LOWER(email) = LOWER('Charlie9785@gmail.com'))
UNION ALL
SELECT 'Betalningar', COUNT(*) FROM payments WHERE tenant_id = (SELECT id FROM tenants WHERE LOWER(email) = LOWER('Charlie9785@gmail.com'))
UNION ALL
SELECT 'Kommunikation', COUNT(*) FROM communication_log WHERE tenant_id = (SELECT id FROM tenants WHERE LOWER(email) = LOWER('Charlie9785@gmail.com'));
