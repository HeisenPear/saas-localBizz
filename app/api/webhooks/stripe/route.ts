/**
 * Stripe Webhook Handler
 *
 * Handles Stripe webhook events for subscription management.
 * Critical events:
 * - checkout.session.completed: New subscription
 * - customer.subscription.updated: Plan changes
 * - customer.subscription.deleted: Cancellation
 * - invoice.payment_succeeded: Successful payment
 * - invoice.payment_failed: Failed payment
 */

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/config";
import { createAdminClient } from "@/lib/supabase/admin";

// Disable body parsing - we need the raw body for signature verification
export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.user_id;
        const planName = session.metadata?.plan_name;

        if (!userId || !planName) {
          console.error("Missing metadata in checkout session");
          break;
        }

        // Update user profile with subscription info
        await supabase
          .from("profiles")
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_tier: planName,
            subscription_status: "active",
            trial_ends_at: null,
          })
          .eq("id", userId);

        // Log the event
        await supabase.from("usage_logs").insert({
          user_id: userId,
          action_type: "subscription_created",
          metadata: {
            plan: planName,
            subscription_id: session.subscription,
          },
        } as any);

        console.log(`Subscription created for user ${userId}: ${planName}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const userId = subscription.metadata?.user_id;

        if (!userId) {
          console.error("Missing user_id in subscription metadata");
          break;
        }

        // Determine subscription status
        let status: string = subscription.status;
        if (subscription.cancel_at_period_end) {
          status = "canceled";
        }

        // Get plan from price ID
        const priceId = subscription.items.data[0]?.price.id;
        let planName = subscription.metadata?.plan_name;

        // Update user profile
        await supabase
          .from("profiles")
          .update({
            subscription_status: status,
            subscription_tier: planName || null,
          })
          .eq("id", userId);

        console.log(`Subscription updated for user ${userId}: ${status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const userId = subscription.metadata?.user_id;

        if (!userId) {
          console.error("Missing user_id in subscription metadata");
          break;
        }

        // Update user profile - remove subscription
        await supabase
          .from("profiles")
          .update({
            subscription_tier: null,
            subscription_status: "canceled",
            stripe_subscription_id: null,
          })
          .eq("id", userId);

        // Log the event
        await supabase.from("usage_logs").insert({
          user_id: userId,
          action_type: "subscription_canceled",
          metadata: {
            subscription_id: subscription.id,
          },
        } as any);

        console.log(`Subscription deleted for user ${userId}`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId) break;

        // Get subscription to find user
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.user_id;

        if (!userId) break;

        // Update subscription status to active
        await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
          })
          .eq("id", userId);

        // Log payment
        await supabase.from("usage_logs").insert({
          user_id: userId,
          action_type: "payment_succeeded",
          metadata: {
            invoice_id: invoice.id,
            amount: invoice.amount_paid / 100,
          },
        } as any);

        console.log(`Payment succeeded for user ${userId}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.user_id;

        if (!userId) break;

        // Update subscription status to past_due
        await supabase
          .from("profiles")
          .update({
            subscription_status: "past_due",
          })
          .eq("id", userId);

        // Log failed payment
        await supabase.from("usage_logs").insert({
          user_id: userId,
          action_type: "payment_failed",
          metadata: {
            invoice_id: invoice.id,
            amount: invoice.amount_due / 100,
          },
        } as any);

        console.log(`Payment failed for user ${userId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
