/**
 * Reset Password Page
 *
 * Allows users to request a password reset email.
 * Supabase will send an email with a magic link to reset the password.
 */

import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Réinitialiser le mot de passe",
  description: "Demander un lien de réinitialisation de mot de passe",
};

export default function ResetPasswordPage() {
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
          <CardTitle className="text-2xl">Mot de passe oublié ?</CardTitle>
          <CardDescription>
            Entrez votre email et nous vous enverrons un lien pour réinitialiser
            votre mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />

          <div className="mt-6 text-center text-sm">
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
