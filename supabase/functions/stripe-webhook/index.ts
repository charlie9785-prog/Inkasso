import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
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
    // Use async version for Deno compatibility
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed')
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
          const { user_id, company_name, org_number, email } = metadata

          if (!user_id) {
            console.error('No user_id in metadata')
            break
          }

          // Confirm the user's email (they paid, so we trust them)
          const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
            user_id,
            {
              email_confirm: true,
              user_metadata: {
                company_name,
                org_number,
                pending_payment: false,
              }
            }
          )

          if (confirmError) {
            console.error('Error confirming user:', confirmError)
          }

          // Create tenant
          const { error: tenantError } = await supabaseAdmin
            .from('tenants')
            .insert({
              id: user_id,
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

      case 'checkout.session.expired': {
        // Payment was not completed - clean up the pending user
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata

        if (metadata?.signup_flow === 'true' && metadata?.user_id) {
          // Delete the unconfirmed user
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
            metadata.user_id
          )

          if (deleteError) {
            console.error('Error deleting pending user:', deleteError)
          } else {
            console.log('Cleaned up pending user:', metadata.email)
          }
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
