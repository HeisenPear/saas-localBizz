/**
 * Profile Upload Component
 *
 * Handles file uploads for profile photos and business logos
 * Uses Supabase Storage
 */

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/storage/upload";
import { Camera, Loader2, Upload } from "lucide-react";
import Image from "next/image";

interface ProfileUploadProps {
  userId: string;
  currentPhotoUrl: string | null;
  type?: "photo" | "logo";
}

export function ProfileUpload({
  userId,
  currentPhotoUrl,
  type = "photo",
}: ProfileUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload file
      const result = await uploadFile({
        file,
        userId,
        type,
      });

      if (result.success && result.data?.url) {
        // Update succeeded
        router.refresh();
      } else {
        setError(result.error || "Échec du téléchargement");
        setPreviewUrl(currentPhotoUrl);
      }
    } catch (err) {
      setError("Une erreur est survenue lors du téléchargement");
      setPreviewUrl(currentPhotoUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayText = type === "logo" ? "Logo" : "Photo de profil";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        {/* Photo Preview */}
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-secondary">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={displayText}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Téléchargement...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Télécharger {type === "logo" ? "un logo" : "une photo"}
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            JPG, PNG ou GIF (max. 5MB)
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}
