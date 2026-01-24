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

// Generate 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'E-postadress krävs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check if email already exists
    const { data: existingTenant } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('email', email)
      .single()

    if (existingTenant) {
      return new Response(
        JSON.stringify({ error: 'E-postadressen är redan registrerad' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate verification code
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing codes for this email
    await supabaseAdmin
      .from('email_verifications')
      .delete()
      .eq('email', email)

    // Save verification code
    const { error: insertError } = await supabaseAdmin
      .from('email_verifications')
      .insert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      console.error('Error saving verification code:', insertError)
      throw new Error('Kunde inte spara verifieringskod')
    }

    // Send email using Resend if configured
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: Deno.env.get('EMAIL_FROM') || 'Zylora <noreply@zylora.se>',
          to: email,
          subject: 'Din verifieringskod - Zylora',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #7c3aed;">Verifiera din e-postadress</h2>
              <p>Använd denna kod för att verifiera din e-postadress:</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1f2937;">${code}</span>
              </div>
              <p style="color: #6b7280; font-size: 14px;">Koden är giltig i 10 minuter.</p>
              <p style="color: #6b7280; font-size: 14px;">Om du inte begärde denna kod kan du ignorera detta meddelande.</p>
            </div>
          `,
        }),
      })

      if (!emailResponse.ok) {
        console.error('Resend error:', await emailResponse.text())
        throw new Error('Kunde inte skicka verifieringsmejl')
      }
    } else {
      // Fallback: Log the code (for development)
      console.log(`Verification code for ${email}: ${code}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Verifieringskod skickad' }),
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
