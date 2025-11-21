/**
 * Invoice Actions
 *
 * Server actions for managing invoices
 */

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

interface InvoiceData {
  user_id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_address: any;
  invoice_date: string;
  due_date: string;
  line_items: any[];
  subtotal_amount: number;
  tax_amount: number;
  total_amount: number;
  notes?: string;
  terms?: string;
  status: string;
}

interface InvoiceResponse {
  id: string;
  invoice_number: string;
}

/**
 * Create a new invoice
 */
export async function createInvoice(
  data: InvoiceData
): Promise<ApiResponse<InvoiceResponse>> {
  try {
    const supabase = await createClient();

    // Verify user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== data.user_id) {
      return { success: false, error: "Non autorisé" };
    }

    // Generate invoice number
    // Note: The database trigger will handle this, but we can also do it here
    const year = new Date().getFullYear();
    const { data: lastInvoice } = await supabase
      .from("invoices")
      .select("invoice_number")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let invoiceNumber = `FAC-${year}-001`;
    if ((lastInvoice as any)?.invoice_number) {
      const match = (lastInvoice as any).invoice_number.match(/FAC-(\d{4})-(\d{3})/);
      if (match) {
        const lastYear = parseInt(match[1]);
        const lastNumber = parseInt(match[2]);
        if (lastYear === year) {
          invoiceNumber = `FAC-${year}-${String(lastNumber + 1).padStart(
            3,
            "0"
          )}`;
        }
      }
    }

    // Create invoice
    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert({
        ...data,
        invoice_number: invoiceNumber,
      } as any)
      .select()
      .single();

    if (error) {
      console.error("Invoice creation error:", error);
      return { success: false, error: "Échec de la création de la facture" };
    }

    revalidatePath("/dashboard/invoices");
    return {
      success: true,
      data: {
        id: (invoice as any).id,
        invoice_number: (invoice as any).invoice_number,
      },
    };
  } catch (error) {
    console.error("Create invoice error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Update an existing invoice
 */
export async function updateInvoice(
  invoiceId: string,
  data: Partial<InvoiceData>
): Promise<ApiResponse<InvoiceResponse>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Non autorisé" };
    }

    // Update invoice
    const { data: invoice, error } = await (supabase
      .from("invoices") as any)
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Invoice update error:", error);
      return { success: false, error: "Échec de la mise à jour" };
    }

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    return {
      success: true,
      data: {
        id: (invoice as any).id,
        invoice_number: (invoice as any).invoice_number,
      },
    };
  } catch (error) {
    console.error("Update invoice error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Delete an invoice
 */
export async function deleteInvoice(
  invoiceId: string
): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Non autorisé" };
    }

    // Delete invoice
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Invoice deletion error:", error);
      return { success: false, error: "Échec de la suppression" };
    }

    revalidatePath("/dashboard/invoices");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete invoice error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Mark invoice as paid
 */
export async function markInvoiceAsPaid(
  invoiceId: string
): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Non autorisé" };
    }

    const { error } = await (supabase
      .from("invoices") as any)
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Mark as paid error:", error);
      return { success: false, error: "Échec de la mise à jour" };
    }

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Mark as paid error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Cancel an invoice
 */
export async function cancelInvoice(
  invoiceId: string
): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Non autorisé" };
    }

    const { error } = await (supabase
      .from("invoices") as any)
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Cancel invoice error:", error);
      return { success: false, error: "Échec de l'annulation" };
    }

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Cancel invoice error:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}
