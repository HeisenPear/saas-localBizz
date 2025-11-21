/**
 * Billing Settings Component
 *
 * Configure billing preferences for invoices and quotes:
 * - Invoice numbering
 * - Default payment terms
 * - Tax rates
 * - Bank details for payments
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
import { updateBillingSettings } from "@/lib/settings/actions";
import { Loader2 } from "lucide-react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface BillingSettingsProps {
  profile: Profile;
}

export function BillingSettings({ profile }: BillingSettingsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    invoicePrefix: "FAC",
    quotePrefix: "DEV",
    taxRate: 20,
    paymentTerms: 30,
    iban: "",
    bic: "",
    bankName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateBillingSettings(formData);

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
      {/* Invoice Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de facturation</CardTitle>
          <CardDescription>
            Configurez vos préférences pour les factures et devis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Invoice Prefix */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Préfixe factures</Label>
                <Input
                  id="invoicePrefix"
                  value={formData.invoicePrefix}
                  onChange={(e) =>
                    setFormData({ ...formData, invoicePrefix: e.target.value })
                  }
                  placeholder="FAC"
                  maxLength={10}
                />
                <p className="text-sm text-muted-foreground">
                  Ex: FAC-2024-001
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quotePrefix">Préfixe devis</Label>
                <Input
                  id="quotePrefix"
                  value={formData.quotePrefix}
                  onChange={(e) =>
                    setFormData({ ...formData, quotePrefix: e.target.value })
                  }
                  placeholder="DEV"
                  maxLength={10}
                />
                <p className="text-sm text-muted-foreground">
                  Ex: DEV-2024-001
                </p>
              </div>
            </div>

            {/* Tax Rate */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Taux de TVA par défaut (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taxRate: parseFloat(e.target.value),
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Taux de TVA standard en France: 20%
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">
                  Délai de paiement (jours)
                </Label>
                <Input
                  id="paymentTerms"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.paymentTerms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentTerms: parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Par défaut: 30 jours
                </p>
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
                Paramètres mis à jour avec succès
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

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle>Coordonnées bancaires</CardTitle>
          <CardDescription>
            Ces informations apparaîtront sur vos factures pour les paiements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Nom de la banque</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                placeholder="Ex: Crédit Agricole"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={formData.iban}
                onChange={(e) =>
                  setFormData({ ...formData, iban: e.target.value })
                }
                placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                maxLength={34}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bic">BIC/SWIFT</Label>
              <Input
                id="bic"
                value={formData.bic}
                onChange={(e) =>
                  setFormData({ ...formData, bic: e.target.value })
                }
                placeholder="XXXXXXXXXX"
                maxLength={11}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
