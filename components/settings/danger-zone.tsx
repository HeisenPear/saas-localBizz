/**
 * Danger Zone Component
 *
 * Contains dangerous actions like account deletion
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAccount } from "@/lib/settings/actions";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DangerZoneProps {
  userId: string;
}

export function DangerZone({ userId }: DangerZoneProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== "SUPPRIMER") {
      setError('Veuillez taper "SUPPRIMER" pour confirmer');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteAccount(userId);

      if (result.success) {
        // Redirect to home page after deletion
        router.push("/");
      } else {
        setError(result.error || "Une erreur est survenue");
        setIsDeleting(false);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression");
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <CardTitle className="text-red-900 dark:text-red-100">
            Zone dangereuse
          </CardTitle>
        </div>
        <CardDescription className="text-red-700 dark:text-red-300">
          Actions irréversibles qui affecteront votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isOpen ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">
                Supprimer mon compte
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Supprime définitivement votre compte et toutes vos données
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsOpen(true)}
            >
              Supprimer le compte
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-red-100 p-4 dark:bg-red-950">
              <h4 className="mb-2 font-semibold text-red-900 dark:text-red-100">
                Attention : Cette action est irréversible !
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-red-800 dark:text-red-200">
                <li>Toutes vos données seront supprimées</li>
                <li>Vos factures et devis seront perdus</li>
                <li>Votre site web sera désactivé</li>
                <li>Votre abonnement sera annulé</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmDelete" className="text-red-900 dark:text-red-100">
                Tapez &quot;SUPPRIMER&quot; pour confirmer
              </Label>
              <Input
                id="confirmDelete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="SUPPRIMER"
                className="border-red-300 dark:border-red-800"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-100 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setConfirmText("");
                  setError(null);
                }}
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting || confirmText !== "SUPPRIMER"}
              >
                {isDeleting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Supprimer définitivement
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
