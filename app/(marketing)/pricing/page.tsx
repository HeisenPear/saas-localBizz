/**
 * Pricing Page
 *
 * Displays the 3 subscription tiers with features and pricing
 */

import Link from "next/link";
import { getAllPlans, formatPrice } from "@/lib/stripe/config";
import { PricingCard } from "@/components/billing/pricing-card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Tarifs",
  description:
    "Choisissez le plan qui correspond à vos besoins - Essai gratuit 14 jours",
};

export default function PricingPage() {
  const plans = getAllPlans();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            LocalBiz Engine
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Connexion
            </Link>
            <Button asChild>
              <Link href="/signup">Essai gratuit</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b bg-secondary/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Tarifs transparents, sans surprise
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Choisissez le plan qui correspond à vos besoins. Tous les plans
            incluent un essai gratuit de 14 jours, sans carte bancaire requise.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* FAQ Preview */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              Des questions ?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contactez-nous
              </Link>{" "}
              ou consultez notre{" "}
              <Link href="/faq" className="text-primary hover:underline">
                FAQ
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="mb-2 font-semibold">Essai gratuit 14 jours</h3>
              <p className="text-sm text-muted-foreground">
                Testez toutes les fonctionnalités sans engagement
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="mb-2 font-semibold">Paiement sécurisé</h3>
              <p className="text-sm text-muted-foreground">
                Vos données sont protégées par Stripe
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">↺</span>
              </div>
              <h3 className="mb-2 font-semibold">Annulation facile</h3>
              <p className="text-sm text-muted-foreground">
                Résiliez à tout moment en un clic
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 LocalBiz Engine. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
