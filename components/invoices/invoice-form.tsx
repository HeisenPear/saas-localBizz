/**
 * Invoice Form Component
 *
 * Form for creating and editing invoices with line items
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientSelector } from "@/components/invoices/client-selector";
import { LineItemsTable } from "@/components/invoices/line-items-table";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { createInvoice, updateInvoice } from "@/lib/invoices/actions";
import { Loader2, Save, Send, Eye } from "lucide-react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];
type Invoice = Database["public"]["Tables"]["invoices"]["Row"];

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  amount: number;
}

interface InvoiceFormProps {
  userId: string;
  profile: Profile;
  clients: Client[];
  invoice?: Invoice;
  mode: "create" | "edit";
}

export function InvoiceForm({
  userId,
  profile,
  clients,
  invoice,
  mode,
}: InvoiceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    invoice
      ? clients.find((c) => c.id === invoice.client_id) || null
      : null
  );

  const [formData, setFormData] = useState({
    invoiceDate: invoice?.invoice_date
      ? new Date(invoice.invoice_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    dueDate: invoice?.due_date
      ? new Date(invoice.due_date).toISOString().split("T")[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
    notes: invoice?.notes || "",
    terms: invoice?.terms || "Paiement sous 30 jours",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>(
    invoice?.line_items
      ? (invoice.line_items as any[]).map((item: any, index: number) => ({
          id: `${index}`,
          ...item,
        }))
      : [
          {
            id: "1",
            description: "",
            quantity: 1,
            unit_price: 0,
            tax_rate: 20,
            amount: 0,
          },
        ]
  );

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const totalTax = lineItems.reduce(
    (sum, item) => sum + item.amount * (item.tax_rate / 100),
    0
  );
  const total = subtotal + totalTax;

  const handleSubmit = async (status: "draft" | "pending") => {
    if (!selectedClient) {
      setError("Veuillez sélectionner un client");
      return;
    }

    if (lineItems.length === 0 || !lineItems[0].description) {
      setError("Veuillez ajouter au moins une ligne");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const invoiceData = {
        user_id: userId,
        client_id: selectedClient.id,
        client_name: selectedClient.name,
        client_email: selectedClient.email || "",
        client_address: selectedClient.address as any,
        invoice_date: formData.invoiceDate,
        due_date: formData.dueDate,
        line_items: lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate,
          amount: item.amount,
        })),
        subtotal_amount: subtotal,
        tax_amount: totalTax,
        total_amount: total,
        notes: formData.notes,
        terms: formData.terms,
        status,
      };

      let result;
      if (mode === "create") {
        result = await createInvoice(invoiceData);
      } else {
        result = await updateInvoice(invoice!.id, invoiceData);
      }

      if (result.success && result.data) {
        router.push(`/dashboard/invoices/${result.data.id}`);
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (showPreview) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            Retour à l&apos;édition
          </Button>
        </div>
        <InvoicePreview
          profile={profile}
          client={selectedClient}
          invoiceData={{
            invoice_number: invoice?.invoice_number || "FAC-PREVIEW",
            invoice_date: formData.invoiceDate,
            due_date: formData.dueDate,
            line_items: lineItems,
            subtotal_amount: subtotal,
            tax_amount: totalTax,
            total_amount: total,
            notes: formData.notes,
            terms: formData.terms,
          }}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Form */}
      <div className="space-y-6 lg:col-span-2">
        {/* Client Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientSelector
              clients={clients}
              selectedClient={selectedClient}
              onSelectClient={setSelectedClient}
            />
          </CardContent>
        </Card>

        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de la facture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Date de facture</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) =>
                    setFormData({ ...formData, invoiceDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d&apos;échéance</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <CardTitle>Articles / Prestations</CardTitle>
          </CardHeader>
          <CardContent>
            <LineItemsTable
              lineItems={lineItems}
              onUpdateLineItems={setLineItems}
            />
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations complémentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Notes internes ou instructions pour le client"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Conditions de paiement</Label>
              <Input
                id="terms"
                value={formData.terms}
                onChange={(e) =>
                  setFormData({ ...formData, terms: e.target.value })
                }
                placeholder="Paiement sous 30 jours"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Totals Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total HT :</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">TVA :</span>
              <span>{totalTax.toFixed(2)} €</span>
            </div>
            <div className="border-t pt-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total TTC :</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full"
              onClick={() => handleSubmit("pending")}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Enregistrer et envoyer
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSubmit("draft")}
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              Enregistrer comme brouillon
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Aperçu
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
