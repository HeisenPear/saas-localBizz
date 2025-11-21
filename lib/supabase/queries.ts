/**
 * Supabase Database Queries
 *
 * Reusable database query functions for common operations.
 * These functions use the server client by default.
 */

import { createClient } from "./server";
import type { User, Invoice, Quote, Appointment, Client } from "@/types";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return profile;
}

/**
 * Get user's invoices
 */
export async function getUserInvoices(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

/**
 * Get single invoice by ID
 */
export async function getInvoiceById(invoiceId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Get user's quotes
 */
export async function getUserQuotes(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

/**
 * Get user's appointments
 */
export async function getUserAppointments(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", userId)
    .order("start_time", { ascending: true });

  if (error) throw error;

  return data;
}

/**
 * Get user's clients
 */
export async function getUserClients(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) throw error;

  return data;
}

/**
 * Get user's website content
 */
export async function getUserWebsiteContent(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("website_content")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = No rows returned
    throw error;
  }

  return data;
}

/**
 * Generate next invoice number for user
 */
export async function generateInvoiceNumber(userId: string) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any).rpc("generate_invoice_number", {
    p_user_id: userId,
  });

  if (error) throw error;

  return data as string;
}

/**
 * Generate next quote number for user
 */
export async function generateQuoteNumber(userId: string) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any).rpc("generate_quote_number", {
    p_user_id: userId,
  });

  if (error) throw error;

  return data as string;
}

/**
 * Log user action for analytics
 */
export async function logUserAction(
  userId: string,
  actionType: string,
  metadata?: Record<string, any>
) {
  const supabase = await createClient();

  const { error } = await (supabase.from("usage_logs") as any).insert({
    user_id: userId,
    action_type: actionType,
    metadata: metadata || {},
  });

  if (error) throw error;
}
