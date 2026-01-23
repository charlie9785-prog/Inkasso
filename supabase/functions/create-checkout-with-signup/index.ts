import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
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

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    // Create Stripe checkout session with metadata
    // The webhook will use this metadata to create the user and tenant after payment
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
        company_name,
        org_number,
        email,
        password, // Note: In production, consider encrypting this or using a different approach
        signup_flow: 'true',
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
