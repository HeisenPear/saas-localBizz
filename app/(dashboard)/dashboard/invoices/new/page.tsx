/**
 * New Invoice Page
 *
 * Create a new invoice with line items
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/queries";
import { InvoiceForm } from "@/components/invoices/invoice-form";

export const metadata = {
  title: "Nouvelle facture",
};

export default async function NewInvoicePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/dashboard");
  }

  // Fetch clients for selector
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle facture</h1>
        <p className="text-muted-foreground">
          Créez une facture pour votre client
        </p>
      </div>

      <InvoiceForm
        userId={user.id}
        profile={profile}
        clients={clients || []}
        mode="create"
      />
    </div>
  );
}
