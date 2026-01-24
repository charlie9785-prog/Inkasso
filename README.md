# Likvid - Personlig Fakturaservice

En modern molnbaserad inkassolösning för svenska B2B-företag som integreras med ekonomisystem som Fortnox, Visma och Björn Lundén.

## Teknologi Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Ikoner:** Lucide React
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Betalning:** Stripe
- **Integration:** Fortnox OAuth 2.0

## Projektstruktur

```
├── components/
│   ├── auth/           # Autentisering (LoginPage, AuthContext)
│   ├── dashboard/      # Dashboard-komponenter
│   ├── onboarding/     # Registrerings-flöde (5 steg)
│   └── ui/             # Återanvändbara UI-komponenter
├── hooks/              # Custom React hooks
├── lib/                # Utilities (Supabase-klient, navigation)
├── types/              # TypeScript definitioner
├── supabase/
│   └── functions/      # Edge Functions (Deno)
└── assets/             # Logotyper & bilder
```

## Implementerade Funktioner

### Autentisering & Konton
- Email/lösenord-inloggning via Supabase Auth
- Registrering med email-verifiering (6-siffrig kod)
- Validering av organisationsnummer
- Session management

### Onboarding (5-steg)
1. **Registrering** - Företagsinfo + email-verifiering
2. **Välj Plan** - Stripe Checkout integration
3. **Fortnox-koppling** - OAuth 2.0 integration
4. **Integrationer** - Visa tillgängliga integrationer
5. **Slutförande** - Bekräftelse

### Dashboard
- **Översikt** - Statistik & senaste ärenden
- **Ärenden** - Full ärendelista med detaljer
- **Statistik** - Diagram och trender
- **Analys** - Åldersanalys & timeline
- **Integrationer** - Hantera kopplingar

### Fortnox-integration
- OAuth 2.0 koppling
- Automatisk import av fakturor och kunder
- Synkronisering av data
- Token-hantering med refresh

### Ärendehantering
- Statushantering (ny, väntande, inkasso, pausad, betald, etc.)
- Aktivitetslogg per ärende
- Betalningshistorik
- Interna anteckningar
- Export till CSV/TXT

### Hemsida
- Hero-sektion med CTA
- Pricing-tabell
- FAQ-sektion
- Villkor & Integritetspolicy
- Om oss-sida

## Kör Lokalt

**Förutsättningar:** Node.js 18+

1. Installera dependencies:
   ```bash
   npm install
   ```

2. Konfigurera miljövariabler i `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Starta utvecklingsservern:
   ```bash
   npm run dev
   ```

## Edge Functions

Edge functions ligger i `supabase/functions/`:

| Funktion | Beskrivning |
|----------|-------------|
| `create-checkout-with-signup` | Skapar Stripe checkout session |
| `fortnox-oauth` | Hanterar Fortnox OAuth-flöde |
| `validate-signup` | Validerar dubbletter (org.nr, email) |
| `send-verification-code` | Skickar email-verifieringskod |
| `verify-email-code` | Verifierar koden |
| `stripe-webhook` | Hanterar Stripe webhooks |
| `create-tenant` | Skapar nytt företagskonto |

## Databas Schema

**Tabeller:**
- `tenants` - Företagskonton med Fortnox-tokens och inställningar
- `customers` - Kunder importerade från Fortnox
- `invoices` - Fakturor/ärenden med status och belopp
- `payments` - Registrerade betalningar
- `communication_log` - Aktivitetslogg

**Views:**
- `v_tenant_dashboard` - Aggregerad statistik
- `v_invoices_ready_for_collection` - Filtrerade ärenden

## Kvarstående Arbete

### Ej implementerat
- [ ] Lösenordsåterställning (länk finns men fungerar ej)
- [ ] Visma-integration (mockad)
- [ ] Björn Lundén-integration (mockad)
- [ ] Scheduled actions/automation
- [ ] Manuell betalningsregistrering i UI
- [ ] Notifikationer (komponent finns men ej komplett)

### Förbättringar att överväga
- [ ] Ta bort lösenord från Stripe metadata (säkerhetsrisk)
- [ ] Striktare CORS-policy på Edge Functions
- [ ] Fortnox token refresh implementation
- [ ] Audit trail/loggning
- [ ] Input-validering på alla formulär

## Status

**Projekt: ~85% implementerat**

| Område | Status |
|--------|--------|
| Autentisering | ✅ Klart |
| Onboarding | ✅ Klart |
| Fortnox-integration | ✅ Klart |
| Dashboard | ✅ Klart |
| Ärendehantering | ✅ Klart |
| Statistik | ✅ Klart |
| Export | ✅ Klart |
| Hemsida | ✅ Klart |
| Stripe-betalning | ✅ Klart |
| Visma-integration | ⚠️ Mockad |
| Björn Lundén | ⚠️ Mockad |
| Automation | ❌ Ej påbörjad |

## Licens

Proprietär - Alla rättigheter förbehållna.
