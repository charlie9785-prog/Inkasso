import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

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
    const {
      company_name,
      org_number,
      email,
      password,
      plan_id,
      success_url,
      cancel_url,
    } = await req.json()

    // Validate required fields
    if (!company_name || !org_number || !email || !password || !plan_id) {
      return new Response(
        JSON.stringify({ error: 'Alla fält krävs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check if org_number already exists
    const { data: existingTenant } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('org_number', org_number)
      .single()

    if (existingTenant) {
      return new Response(
        JSON.stringify({ error: 'Ett företag med detta organisationsnummer finns redan registrerat' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if email already exists in tenants
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

    // Create user BEFORE payment (with unconfirmed status)
    // This way we don't need to store password in Stripe metadata
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Will be confirmed after payment
      user_metadata: {
        company_name,
        org_number,
        pending_payment: true,
      }
    })

    if (authError) {
      console.error('Error creating user:', authError)
      return new Response(
        JSON.stringify({ error: 'Kunde inte skapa användare: ' + authError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    // Create Stripe checkout session with user_id in metadata (NOT password!)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: plan_id,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: success_url || `${Deno.env.get('SITE_URL')}/onboarding?payment=success`,
      cancel_url: cancel_url || `${Deno.env.get('SITE_URL')}/onboarding?payment=cancelled`,
      metadata: {
        user_id: authData.user.id,
        company_name,
        org_number,
        email,
        signup_flow: 'true',
        // NO password here - security fix!
      },
    })

    return new Response(
      JSON.stringify({ checkout_url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Ett oväntat fel uppstod' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
