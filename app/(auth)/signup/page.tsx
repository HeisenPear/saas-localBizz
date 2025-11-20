/**
 * Signup Page
 *
 * User registration page with:
 * - Email/password signup
 * - Business information collection
 * - Google OAuth
 * - Form validation with Zod
 * - Terms acceptance
 * - Auto-redirect after successful signup
 */

import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Inscription",
  description: "Créez votre compte LocalBiz Engine - Essai gratuit 14 jours",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4">
            <Link
              href="/"
              className="text-2xl font-bold text-primary hover:opacity-90"
            >
              LocalBiz Engine
            </Link>
          </div>
          <CardTitle className="text-2xl">
            Créez votre compte gratuitement
          </CardTitle>
          <CardDescription>
            Essai gratuit 14 jours • Sans carte bancaire • Annulation à tout
            moment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Vous avez déjà un compte ?{" "}
            </span>
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
