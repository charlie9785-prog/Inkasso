import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const ALLOWED_ORIGINS = ['https://www.zylora.se', 'https://zylora.se', 'http://localhost:5173'];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { org_number, email } = await req.json()

    if (!org_number || !email) {
      return new Response(
        JSON.stringify({ error: 'org_number och email krävs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check if org_number exists
    const { data: existingOrg } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('org_number', org_number)
      .single()

    if (existingOrg) {
      return new Response(
        JSON.stringify({ error: 'Ett företag med detta organisationsnummer finns redan registrerat' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if email exists in tenants
    const { data: existingEmail } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('email', email)
      .single()

    if (existingEmail) {
      return new Response(
        JSON.stringify({ error: 'Ett företag med denna e-postadress finns redan registrerat' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if email exists in auth
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const emailExists = authUsers?.users?.some(u => u.email === email)

    if (emailExists) {
      return new Response(
        JSON.stringify({ error: 'E-postadressen är redan registrerad. Försök logga in istället.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ valid: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Ett oväntat fel uppstod' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
