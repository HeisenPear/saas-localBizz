/**
 * Stripe Configuration
 *
 * Centralized Stripe configuration including:
 * - Stripe client initialization
 * - Subscription plans definition
 * - Pricing configuration
 */

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

// Initialize Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

/**
 * Subscription Plans Configuration
 *
 * Defines the 3 tiers with features and pricing
 */
export const PLANS = {
  essential: {
    id: "essential" as const,
    name: "Essential",
    description: "Pour démarrer votre activité",
    priceId: process.env.STRIPE_PRICE_ID_ESSENTIAL || "",
    price: 79,
    currency: "eur",
    interval: "month" as const,
    features: [
      "Site web professionnel",
      "Facturation illimitée",
      "Prise de RDV en ligne",
      "50 devis/mois",
      "Support email",
    ],
    limits: {
      invoices: null, // unlimited
      quotes: 50,
      appointments: null,
      clients: null,
      users: 1,
    },
  },
  pro: {
    id: "pro" as const,
    name: "Pro",
    description: "Pour développer votre business",
    priceId: process.env.STRIPE_PRICE_ID_PRO || "",
    price: 149,
    currency: "eur",
    interval: "month" as const,
    popular: true, // Highlighted plan
    features: [
      "Tout Essential +",
      "CRM clients",
      "Devis illimités",
      "Demande d'avis automatisée",
      "Analytics avancés",
      "Support prioritaire",
    ],
    limits: {
      invoices: null,
      quotes: null,
      appointments: null,
      clients: null,
      users: 1,
    },
  },
  premium: {
    id: "premium" as const,
    name: "Premium",
    description: "Pour les entreprises en croissance",
    priceId: process.env.STRIPE_PRICE_ID_PREMIUM || "",
    price: 299,
    currency: "eur",
    interval: "month" as const,
    features: [
      "Tout Pro +",
      "Multi-utilisateurs (5 max)",
      "Domaine personnalisé",
      "API access",
      "White-label",
      "Support téléphonique",
    ],
    limits: {
      invoices: null,
      quotes: null,
      appointments: null,
      clients: null,
      users: 5,
    },
  },
} as const;

export type PlanId = keyof typeof PLANS;

/**
 * Get plan configuration by ID
 */
export function getPlan(planId: PlanId) {
  return PLANS[planId];
}

/**
 * Get all plans as array
 */
export function getAllPlans() {
  return Object.values(PLANS);
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = "eur"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount);
}
