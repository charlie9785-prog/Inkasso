import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata

        // Check if this is a signup flow
        if (metadata?.signup_flow === 'true') {
          const { company_name, org_number, email, password } = metadata

          // Create auth user
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm since they paid
          })

          if (authError) {
            console.error('Error creating auth user:', authError)
            // Don't throw - log and continue, payment was successful
            break
          }

          // Create tenant
          const { error: tenantError } = await supabaseAdmin
            .from('tenants')
            .insert({
              id: authData.user.id,
              name: company_name,
              org_number,
              email,
              subscription_status: 'active',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              settings: {},
            })

          if (tenantError) {
            console.error('Error creating tenant:', tenantError)
          }

          console.log('Signup completed for:', email)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find tenant by stripe_customer_id and update status
        const status = subscription.status === 'active' ? 'active' :
                       subscription.status === 'trialing' ? 'trial' :
                       subscription.status === 'past_due' ? 'past_due' : 'inactive'

        await supabaseAdmin
          .from('tenants')
          .update({ subscription_status: status })
          .eq('stripe_customer_id', customerId)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await supabaseAdmin
          .from('tenants')
          .update({ subscription_status: 'canceled' })
          .eq('stripe_customer_id', customerId)

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), { status: 500 })
  }
})
