/**
 * Pricing Card Component
 *
 * Displays a single pricing plan with features and CTA
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice, type PlanId } from "@/lib/stripe/config";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: {
    id: PlanId;
    name: string;
    description: string;
    priceId: string;
    price: number;
    currency: string;
    interval: string;
    popular?: boolean;
    features: readonly string[];
  };
}

export function PricingCard({ plan }: PricingCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = async () => {
    try {
      setIsLoading(true);

      // Check if user is logged in
      const response = await fetch("/api/auth/session");
      const session = await response.json();

      if (!session.user) {
        // Redirect to signup if not logged in
        router.push(`/signup?plan=${plan.id}`);
        return;
      }

      // Create checkout session
      const checkoutResponse = await fetch(
        "/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: plan.priceId,
            planName: plan.id,
          }),
        }
      );

      const { sessionUrl, error } = await checkoutResponse.json();

      if (error) {
        console.error("Error creating checkout session:", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
        return;
      }

      // Redirect to Stripe Checkout
      if (sessionUrl) {
        window.location.href = sessionUrl;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "relative flex flex-col",
        plan.popular &&
          "border-primary shadow-lg ring-2 ring-primary ring-opacity-50"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
            Plus populaire
          </span>
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">
            {formatPrice(plan.price)}
          </span>
          <span className="text-muted-foreground">/{plan.interval}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={plan.popular ? "default" : "outline"}
          onClick={handleSelectPlan}
          disabled={isLoading || !plan.priceId}
        >
          {isLoading ? "Chargement..." : "Commencer"}
        </Button>
      </CardFooter>
    </Card>
  );
}
