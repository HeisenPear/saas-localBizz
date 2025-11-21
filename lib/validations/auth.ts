/**
 * Authentication Validation Schemas
 *
 * Zod schemas for validating authentication forms:
 * - Login
 * - Signup
 * - Reset password
 * - Update password
 */

import { z } from "zod";

/**
 * Login Form Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Adresse email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Signup Form Schema
 */
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Adresse email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
    businessName: z
      .string()
      .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères")
      .max(100, "Le nom de l'entreprise est trop long"),
    businessType: z.enum(
      [
        "plombier",
        "electricien",
        "macon",
        "peintre",
        "menuisier",
        "couvreur",
        "chauffagiste",
        "serrurier",
        "jardinier",
        "autre",
      ],
      {
        message: "Veuillez sélectionner un type d'activité",
      }
    ),
    phone: z
      .string()
      .min(1, "Le numéro de téléphone est requis")
      .regex(
        /^0[1-9]\d{8}$/,
        "Numéro de téléphone invalide (format: 0612345678)"
      ),
    siret: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === "") return true;
          const cleaned = val.replace(/\s/g, "");
          return /^\d{14}$/.test(cleaned);
        },
        {
          message: "SIRET invalide (14 chiffres requis)",
        }
      ),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "Vous devez accepter les conditions générales",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Adresse email invalide"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Update Password Schema
 */
export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
