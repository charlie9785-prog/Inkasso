import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const FORTNOX_CLIENT_ID = Deno.env.get('FORTNOX_CLIENT_ID') ?? ''
const FORTNOX_CLIENT_SECRET = Deno.env.get('FORTNOX_CLIENT_SECRET') ?? ''
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://www.zylora.se'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  const url = new URL(req.url)
  const action = url.searchParams.get('action')
  const tenantId = url.searchParams.get('tenant_id')

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    switch (action) {
      case 'status': {
        if (!tenantId) {
          return new Response(
            JSON.stringify({ error: 'tenant_id krävs' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if tenant has Fortnox connected
        const { data: tenant, error } = await supabaseAdmin
          .from('tenants')
          .select('fortnox_access_token, fortnox_refresh_token, fortnox_token_expires_at')
          .eq('id', tenantId)
          .single()

        if (error) {
          console.error('Error fetching tenant:', error)
          return new Response(
            JSON.stringify({ error: 'Kunde inte hämta tenant' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const connected = !!(tenant?.fortnox_access_token && tenant?.fortnox_refresh_token)

        return new Response(
          JSON.stringify({ connected }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'connect': {
        if (!tenantId) {
          return new Response(
            JSON.stringify({ error: 'tenant_id krävs' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if (!FORTNOX_CLIENT_ID) {
          return new Response(
            JSON.stringify({ error: 'Fortnox inte konfigurerat' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Generate state with tenant_id for callback
        const state = btoa(JSON.stringify({ tenant_id: tenantId }))

        const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/fortnox-oauth?action=callback`

        const authUrl = new URL('https://apps.fortnox.se/oauth-v1/auth')
        authUrl.searchParams.set('client_id', FORTNOX_CLIENT_ID)
        authUrl.searchParams.set('redirect_uri', redirectUri)
        authUrl.searchParams.set('scope', 'invoice customer article payment')
        authUrl.searchParams.set('state', state)
        authUrl.searchParams.set('response_type', 'code')

        return new Response(
          JSON.stringify({ auth_url: authUrl.toString() }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'callback': {
        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')
        const error = url.searchParams.get('error')

        if (error) {
          console.error('Fortnox OAuth error:', error)
          return Response.redirect(`${SITE_URL}/onboarding/fortnox/error?error=${error}`)
        }

        if (!code || !state) {
          return Response.redirect(`${SITE_URL}/onboarding/fortnox/error?error=missing_params`)
        }

        // Decode state to get tenant_id
        let stateData: { tenant_id: string }
        try {
          stateData = JSON.parse(atob(state))
        } catch {
          return Response.redirect(`${SITE_URL}/onboarding/fortnox/error?error=invalid_state`)
        }

        const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/fortnox-oauth?action=callback`

        // Exchange code for tokens
        const tokenResponse = await fetch('https://apps.fortnox.se/oauth-v1/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${FORTNOX_CLIENT_ID}:${FORTNOX_CLIENT_SECRET}`)}`,
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
          }),
        })

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text()
          console.error('Fortnox token error:', errorText)
          return Response.redirect(`${SITE_URL}/onboarding/fortnox/error?error=token_exchange_failed`)
        }

        const tokens = await tokenResponse.json()

        // Calculate expiration time
        const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

        // Save tokens to tenant
        const { error: updateError } = await supabaseAdmin
          .from('tenants')
          .update({
            fortnox_access_token: tokens.access_token,
            fortnox_refresh_token: tokens.refresh_token,
            fortnox_token_expires_at: expiresAt,
          })
          .eq('id', stateData.tenant_id)

        if (updateError) {
          console.error('Error saving tokens:', updateError)
          return Response.redirect(`${SITE_URL}/onboarding/fortnox/error?error=save_failed`)
        }

        return Response.redirect(`${SITE_URL}/onboarding/fortnox/success`)
      }

      case 'disconnect': {
        if (!tenantId) {
          return new Response(
            JSON.stringify({ error: 'tenant_id krävs' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Clear Fortnox tokens
        const { error: updateError } = await supabaseAdmin
          .from('tenants')
          .update({
            fortnox_access_token: null,
            fortnox_refresh_token: null,
            fortnox_token_expires_at: null,
          })
          .eq('id', tenantId)

        if (updateError) {
          console.error('Error disconnecting:', updateError)
          return new Response(
            JSON.stringify({ error: 'Kunde inte koppla bort' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Ogiltig action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Ett oväntat fel uppstod' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
