/**
 * Login Page
 *
 * User authentication page with:
 * - Email/password login
 * - Google OAuth
 * - Link to signup and password reset
 * - Form validation with Zod
 * - Error handling
 */

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte LocalBiz Engine",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4">
            <Link
              href="/"
              className="text-2xl font-bold text-primary hover:opacity-90"
            >
              LocalBiz Engine
            </Link>
          </div>
          <CardTitle className="text-2xl">Bon retour parmi nous</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à votre espace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Pas encore de compte ?{" "}
            </span>
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Créer un compte
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
