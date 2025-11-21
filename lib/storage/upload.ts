/**
 * Storage Upload Functions
 *
 * Handles file uploads to Supabase Storage
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

interface UploadFileInput {
  file: File;
  userId: string;
  type: "photo" | "logo";
}

interface UploadFileResult {
  url: string;
  path: string;
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  input: UploadFileInput
): Promise<ApiResponse<UploadFileResult>> {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== input.userId) {
      return { success: false, error: "Non autorisé" };
    }

    // Generate unique file name
    const fileExt = input.file.name.split(".").pop();
    const fileName = `${input.type}-${input.userId}-${Date.now()}.${fileExt}`;
    const filePath = `${input.userId}/${input.type}s/${fileName}`;

    // Convert File to ArrayBuffer (needed for server-side upload)
    const arrayBuffer = await input.file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("user-uploads")
      .upload(filePath, buffer, {
        contentType: input.file.type,
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return { success: false, error: "Échec du téléchargement" };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("user-uploads").getPublicUrl(filePath);

    // Update profile with new photo/logo URL
    const updateField = input.type === "photo" ? "photo_url" : "logo_url";

    // Note: You may need to add these columns to the profiles table
    // For now, we'll just return the URL
    // await supabase
    //   .from("profiles")
    //   .update({ [updateField]: publicUrl })
    //   .eq("id", input.userId);

    return {
      success: true,
      data: {
        url: publicUrl,
        path: data.path,
      },
    };
  } catch (error) {
    console.error("Upload file error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(
  filePath: string,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      return { success: false, error: "Non autorisé" };
    }

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from("user-uploads")
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: "Échec de la suppression" };
    }

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete file error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}
