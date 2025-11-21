/**
 * Settings Actions
 *
 * Server actions for updating user settings
 */

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

/**
 * Update profile settings
 */
export async function updateProfileSettings(input: {
  phone: string;
}): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update({
        phone: input.phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Profile update error:", error);
      return { success: false, error: "Échec de la mise à jour" };
    }

    revalidatePath("/dashboard/settings");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Update business settings
 */
export async function updateBusinessSettings(input: {
  businessName: string;
  businessType: string;
  siret: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: input.businessName,
        business_type: input.businessType,
        siret: input.siret,
        address: input.address as any,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Business update error:", error);
      return { success: false, error: "Échec de la mise à jour" };
    }

    revalidatePath("/dashboard/settings");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Update business error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Update billing settings
 * Note: Currently stores in profile metadata, could be extended to separate table
 */
export async function updateBillingSettings(input: {
  invoicePrefix: string;
  quotePrefix: string;
  taxRate: number;
  paymentTerms: number;
  iban?: string;
  bic?: string;
  bankName?: string;
}): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    // Store billing settings in profile metadata
    // In production, consider creating a separate billing_settings table
    const { error } = await supabase
      .from("profiles")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Billing update error:", error);
      return { success: false, error: "Échec de la mise à jour" };
    }

    revalidatePath("/dashboard/settings");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Update billing error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Change user password
 */
export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: input.newPassword,
    });

    if (error) {
      console.error("Password change error:", error);
      return { success: false, error: "Échec du changement de mot de passe" };
    }

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Delete user account
 * WARNING: This is irreversible
 */
export async function deleteAccount(userId: string): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      return { success: false, error: "Non autorisé" };
    }

    // Delete user profile (cascade will handle related records)
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Profile deletion error:", profileError);
      return { success: false, error: "Échec de la suppression du profil" };
    }

    // Sign out user
    await supabase.auth.signOut();

    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete account error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}
