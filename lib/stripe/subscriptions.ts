/**
 * Stripe Subscription Management
 *
 * Functions for managing customer subscriptions
 */

import { stripe } from "./config";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Create a Stripe checkout session for subscription
 */
export async function createCheckoutSession(params: {
  userId: string;
  priceId: string;
  planName: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const { userId, priceId, planName, successUrl, cancelUrl } = params;

  const supabase = createAdminClient();

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, stripe_customer_id")
    .eq("id", userId)
    .single();

  if (!profile) {
    throw new Error("User profile not found");
  }

  // Create or retrieve Stripe customer
  let customerId = profile.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email,
      metadata: {
        user_id: userId,
      },
    });
    customerId = customer.id;

    // Save customer ID to database
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", userId);
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: userId,
      plan_name: planName,
    },
    subscription_data: {
      metadata: {
        user_id: userId,
        plan_name: planName,
      },
    },
  });

  return session;
}

/**
 * Create a customer portal session
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  const { customerId, returnUrl } = params;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    return null;
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return subscription;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
    return subscription;
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    throw error;
  }
}
