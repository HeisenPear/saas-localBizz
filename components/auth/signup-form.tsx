/**
 * Signup Form Component
 *
 * Comprehensive registration form with:
 * - Email/password fields
 * - Business information collection
 * - Google OAuth option
 * - Terms & conditions acceptance
 * - Form validation
 * - Error handling
 * - Success redirect
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { signUp, signInWithGoogle } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const businessTypes = [
  { value: "plombier", label: "Plombier" },
  { value: "electricien", label: "Électricien" },
  { value: "macon", label: "Maçon" },
  { value: "peintre", label: "Peintre" },
  { value: "menuisier", label: "Menuisier" },
  { value: "couvreur", label: "Couvreur" },
  { value: "chauffagiste", label: "Chauffagiste" },
  { value: "serrurier", label: "Serrurier" },
  { value: "jardinier", label: "Jardinier" },
  { value: "autre", label: "Autre" },
];

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const businessType = watch("businessType");
  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: SignupInput) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signUp(data);

      if (!result.success) {
        setError(result.error?.message || "Une erreur s'est produite");
        return;
      }

      setSuccess(true);
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);

      const result = await signInWithGoogle();

      if (!result.success) {
        setError(result.error?.message || "Une erreur s'est produite");
        return;
      }

      if (result.data?.url) {
        window.location.href = result.data.url;
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
      console.error("Google sign in error:", err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-md bg-accent/15 px-4 py-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
          <svg
            className="h-6 w-6 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold">Compte créé avec succès !</h3>
        <p className="text-sm text-muted-foreground">
          Redirection vers votre espace...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Google OAuth Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
            Connexion...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            S&apos;inscrire avec Google
          </span>
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Ou s&apos;inscrire avec
          </span>
        </div>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Email */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email professionnel *</Label>
            <Input
              id="email"
              type="email"
              placeholder="nom@exemple.fr"
              {...register("email")}
              disabled={isLoading || isGoogleLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe *</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading || isGoogleLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer mot de passe *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              disabled={isLoading || isGoogleLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Nom de votre entreprise *</Label>
            <Input
              id="businessName"
              type="text"
              placeholder="Dupont Plomberie"
              {...register("businessName")}
              disabled={isLoading || isGoogleLoading}
            />
            {errors.businessName && (
              <p className="text-sm text-destructive">
                {errors.businessName.message}
              </p>
            )}
          </div>

          {/* Business Type */}
          <div className="space-y-2">
            <Label htmlFor="businessType">Type d&apos;activité *</Label>
            <Select
              value={businessType}
              onValueChange={(value) =>
                setValue("businessType", value as any, {
                  shouldValidate: true,
                })
              }
              disabled={isLoading || isGoogleLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez..." />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.businessType && (
              <p className="text-sm text-destructive">
                {errors.businessType.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0612345678"
              {...register("phone")}
              disabled={isLoading || isGoogleLoading}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* SIRET (optional) */}
          <div className="space-y-2">
            <Label htmlFor="siret">SIRET (optionnel)</Label>
            <Input
              id="siret"
              type="text"
              placeholder="12345678901234"
              {...register("siret")}
              disabled={isLoading || isGoogleLoading}
            />
            {errors.siret && (
              <p className="text-sm text-destructive">{errors.siret.message}</p>
            )}
          </div>
        </div>

        {/* Terms Acceptance */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("acceptTerms", e.target.checked, {
                shouldValidate: true,
              })
            }
            disabled={isLoading || isGoogleLoading}
          />
          <Label
            htmlFor="acceptTerms"
            className="text-sm font-normal leading-snug"
          >
            J&apos;accepte les{" "}
            <a href="/legal/cgu" className="text-primary hover:underline">
              conditions générales d&apos;utilisation
            </a>{" "}
            et la{" "}
            <a
              href="/legal/confidentialite"
              className="text-primary hover:underline"
            >
              politique de confidentialité
            </a>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-destructive">
            {errors.acceptTerms.message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
              Création du compte...
            </span>
          ) : (
            "Créer mon compte gratuitement"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          En créant un compte, vous commencez votre essai gratuit de 14 jours.
          Aucune carte bancaire requise.
        </p>
      </form>
    </div>
  );
}
