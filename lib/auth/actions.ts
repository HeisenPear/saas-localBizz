/**
 * Authentication Server Actions
 *
 * Server-side functions for handling authentication operations.
 * These actions are called from client components and run on the server.
 *
 * All actions use "use server" directive and return ApiResponse type.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateSubdomain } from "@/lib/utils/validation";
import type { ApiResponse } from "@/types";
import type { LoginInput, SignupInput } from "@/lib/validations/auth";

/**
 * Sign up a new user
 *
 * Creates a new user account and profile in the database.
 * Sets up trial period and generates website subdomain.
 */
export async function signUp(
  input: SignupInput
): Promise<ApiResponse<{ userId: string }>> {
  try {
    const supabase = await createClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (authError) {
      return {
        success: false,
        error: {
          message: authError.message,
          code: authError.code,
        },
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: {
          message: "Erreur lors de la création du compte",
        },
      };
    }

    // Generate website subdomain from business name
    const subdomain = generateSubdomain(input.businessName);

    // Calculate trial end date (14 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    // Create user profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: input.email,
      business_name: input.businessName,
      business_type: input.businessType,
      phone: input.phone,
      siret: input.siret || null,
      address: {},
      subscription_tier: null,
      subscription_status: "trial",
      trial_ends_at: trialEndsAt.toISOString(),
      website_subdomain: subdomain,
      website_published: false,
    });

    if (profileError) {
      // If profile creation fails, we should delete the auth user
      // but for now, we'll just return an error
      return {
        success: false,
        error: {
          message: "Erreur lors de la création du profil",
          details: profileError,
        },
      };
    }

    // Create default website content
    const { error: websiteError } = await supabase
      .from("website_content")
      .insert({
        user_id: authData.user.id,
        hero_title: `Bienvenue chez ${input.businessName}`,
        hero_subtitle: "Votre artisan de confiance",
        about_text: "",
        services: [],
        gallery_images: [],
        contact_email: input.email,
        contact_phone: input.phone,
        business_hours: {},
        social_links: {},
        seo_title: input.businessName,
        seo_description: `${input.businessName} - Artisan professionnel`,
      });

    if (websiteError) {
      console.error("Failed to create website content:", websiteError);
      // Non-critical error, continue
    }

    return {
      success: true,
      data: {
        userId: authData.user.id,
      },
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: {
        message: "Une erreur inattendue s'est produite",
        details: error,
      },
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(
  input: LoginInput
): Promise<ApiResponse<{ redirectTo: string }>> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      return {
        success: false,
        error: {
          message:
            error.code === "invalid_credentials"
              ? "Email ou mot de passe incorrect"
              : error.message,
          code: error.code,
        },
      };
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      data: {
        redirectTo: "/dashboard",
      },
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: {
        message: "Une erreur inattendue s'est produite",
        details: error,
      },
    };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<
  ApiResponse<{ url: string }>
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      success: true,
      data: {
        url: data.url,
      },
    };
  } catch (error) {
    console.error("Google sign in error:", error);
    return {
      success: false,
      error: {
        message: "Une erreur inattendue s'est produite",
        details: error,
      },
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<ApiResponse> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    revalidatePath("/", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: {
        message: "Une erreur inattendue s'est produite",
        details: error,
      },
    };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<ApiResponse> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: {
        message: "Une erreur inattendue s'est produite",
        details: error,
      },
    };
  }
}

/**
 * Update user password
 */
export async function updatePassword(
  newPassword: string
): Promise<ApiResponse> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update password error:", error);
    return {
      success: false,
      error: {
        message: "Une erreur inattendue s'est produite",
        details: error,
      },
    };
  }
}
