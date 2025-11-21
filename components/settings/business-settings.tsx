/**
 * Business Settings Component
 *
 * Manage business information including:
 * - Business logo upload
 * - Company details
 * - Legal information (SIRET, address, etc.)
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ProfileUpload } from "@/components/settings/profile-upload";
import { updateBusinessSettings } from "@/lib/settings/actions";
import { Loader2 } from "lucide-react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface BusinessSettingsProps {
  profile: Profile;
}

const BUSINESS_TYPES = [
  "Artisan",
  "PME",
  "Auto-entrepreneur",
  "Plombier",
  "Électricien",
  "Maçon",
  "Menuisier",
  "Peintre",
  "Jardinier",
  "Autre",
];

export function BusinessSettings({ profile }: BusinessSettingsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    businessName: profile.business_name || "",
    businessType: profile.business_type || "",
    siret: profile.siret || "",
    address: {
      street: (profile.address as any)?.street || "",
      city: (profile.address as any)?.city || "",
      postalCode: (profile.address as any)?.postalCode || "",
      country: (profile.address as any)?.country || "France",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateBusinessSettings({
        businessName: formData.businessName,
        businessType: formData.businessType,
        siret: formData.siret,
        address: formData.address,
      });

      if (result.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Business Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Logo de l&apos;entreprise</CardTitle>
          <CardDescription>
            Ce logo apparaîtra sur vos factures, devis et site web
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileUpload userId={profile.id} currentPhotoUrl={null} type="logo" />
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations d&apos;entreprise</CardTitle>
          <CardDescription>
            Ces informations apparaîtront sur vos documents officiels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName">Nom de l&apos;entreprise *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                required
              />
            </div>

            {/* Business Type */}
            <div className="space-y-2">
              <Label htmlFor="businessType">Type d&apos;activité *</Label>
              <select
                id="businessType"
                value={formData.businessType}
                onChange={(e) =>
                  setFormData({ ...formData, businessType: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Sélectionnez...</option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* SIRET */}
            <div className="space-y-2">
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                value={formData.siret}
                onChange={(e) =>
                  setFormData({ ...formData, siret: e.target.value })
                }
                placeholder="123 456 789 00010"
                maxLength={14}
              />
              <p className="text-sm text-muted-foreground">
                14 chiffres sans espaces
              </p>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Adresse</h3>

              <div className="space-y-2">
                <Label htmlFor="street">Rue *</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    value={formData.address.postalCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          postalCode: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={formData.address.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        country: e.target.value,
                      },
                    })
                  }
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                Informations mises à jour avec succès
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
