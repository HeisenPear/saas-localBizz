/**
 * Invoice Preview Component
 *
 * Display a preview of the invoice document
 */

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import type { Database } from "@/types/database";
import type { LineItem } from "./invoice-form";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

interface InvoicePreviewProps {
  profile: Profile;
  client: Client | null;
  invoiceData: {
    invoice_number: string;
    invoice_date: string;
    due_date: string;
    line_items: LineItem[];
    subtotal_amount: number;
    tax_amount: number;
    total_amount: number;
    notes?: string;
    terms?: string;
  };
}

export function InvoicePreview({
  profile,
  client,
  invoiceData,
}: InvoicePreviewProps) {
  if (!client) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">
            Sélectionnez un client pour voir l&apos;aperçu
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <CardContent className="p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">{profile.business_name}</h1>
            {profile.address && (
              <div className="mt-2 text-sm text-muted-foreground">
                <p>{(profile.address as any).street}</p>
                <p>
                  {(profile.address as any).postalCode}{" "}
                  {(profile.address as any).city}
                </p>
                {profile.phone && <p>{profile.phone}</p>}
                {profile.email && <p>{profile.email}</p>}
                {profile.siret && <p>SIRET: {profile.siret}</p>}
              </div>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">FACTURE</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {invoiceData.invoice_number}
            </p>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-8">
          <div className="text-sm font-medium text-muted-foreground">
            Facturé à :
          </div>
          <div className="mt-2">
            <p className="font-medium">{client.name}</p>
            {client.email && (
              <p className="text-sm text-muted-foreground">{client.email}</p>
            )}
            {client.address && (
              <div className="text-sm text-muted-foreground">
                <p>{(client.address as any).street}</p>
                <p>
                  {(client.address as any).postalCode}{" "}
                  {(client.address as any).city}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="mb-8 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Date de facture : </span>
            <span className="font-medium">
              {new Date(invoiceData.invoice_date).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Date d&apos;échéance : </span>
            <span className="font-medium">
              {new Date(invoiceData.due_date).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <table className="w-full">
            <thead className="border-b-2 border-primary">
              <tr>
                <th className="pb-2 text-left text-sm font-medium">
                  Description
                </th>
                <th className="pb-2 text-right text-sm font-medium">Qté</th>
                <th className="pb-2 text-right text-sm font-medium">P.U.</th>
                <th className="pb-2 text-right text-sm font-medium">TVA</th>
                <th className="pb-2 text-right text-sm font-medium">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.line_items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 text-sm">{item.description}</td>
                  <td className="py-3 text-right text-sm">{item.quantity}</td>
                  <td className="py-3 text-right text-sm">
                    {item.unit_price.toFixed(2)} €
                  </td>
                  <td className="py-3 text-right text-sm">{item.tax_rate}%</td>
                  <td className="py-3 text-right text-sm font-medium">
                    {item.amount.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mb-8 ml-auto max-w-xs space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total HT :</span>
            <span>{formatCurrency(invoiceData.subtotal_amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">TVA :</span>
            <span>{formatCurrency(invoiceData.tax_amount)}</span>
          </div>
          <div className="border-t pt-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total TTC :</span>
            <span>{formatCurrency(invoiceData.total_amount)}</span>
          </div>
        </div>

        {/* Notes */}
        {invoiceData.notes && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium">Notes :</h3>
            <p className="text-sm text-muted-foreground">{invoiceData.notes}</p>
          </div>
        )}

        {/* Terms */}
        {invoiceData.terms && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium">
              Conditions de paiement :
            </h3>
            <p className="text-sm text-muted-foreground">{invoiceData.terms}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 border-t pt-4 text-center text-xs text-muted-foreground">
          <p>
            En cas de retard de paiement, une pénalité de 3 fois le taux
            d&apos;intérêt légal sera appliquée, à laquelle s&apos;ajoutera une
            indemnité forfaitaire pour frais de recouvrement de 40 euros.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
