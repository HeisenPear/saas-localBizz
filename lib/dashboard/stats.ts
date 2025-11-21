/**
 * Dashboard Statistics Functions
 *
 * Functions to fetch and calculate dashboard statistics
 */

import { createClient } from "@/lib/supabase/server";
import type { ActivityItem } from "@/components/dashboard/recent-activity";

export interface DashboardStats {
  invoices: {
    total: number;
    thisMonth: number;
    unpaid: number;
    revenue: number;
    revenueThisMonth: number;
    trend: number; // percentage change vs last month
  };
  quotes: {
    total: number;
    thisMonth: number;
    pending: number;
    trend: number;
  };
  appointments: {
    total: number;
    upcoming: number;
    today: number;
    thisWeek: number;
  };
  clients: {
    total: number;
    newThisMonth: number;
    trend: number;
  };
}

/**
 * Get comprehensive dashboard statistics
 */
export async function getDashboardStats(
  userId: string
): Promise<DashboardStats> {
  const supabase = await createClient();

  // Get current month boundaries
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Fetch invoices data
  const { data: allInvoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", userId);

  const invoicesThisMonth =
    allInvoices?.filter(
      (inv) =>
        new Date((inv as any).invoice_date) >= firstDayOfMonth &&
        new Date((inv as any).invoice_date) <= lastDayOfMonth
    ) || [];

  const invoicesLastMonth =
    allInvoices?.filter(
      (inv) =>
        new Date((inv as any).invoice_date) >= firstDayOfLastMonth &&
        new Date((inv as any).invoice_date) <= lastDayOfLastMonth
    ) || [];

  const unpaidInvoices =
    allInvoices?.filter((inv) => (inv as any).status === "pending") || [];

  const totalRevenue =
    allInvoices?.reduce((sum, inv) => sum + ((inv as any).total_amount || 0), 0) || 0;
  const revenueThisMonth =
    invoicesThisMonth.reduce((sum, inv) => sum + ((inv as any).total_amount || 0), 0) ||
    0;
  const revenueLastMonth =
    invoicesLastMonth.reduce((sum, inv) => sum + ((inv as any).total_amount || 0), 0) ||
    0;

  const invoiceTrend =
    revenueLastMonth > 0
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      : 0;

  // Fetch quotes data
  const { data: allQuotes } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", userId);

  const quotesThisMonth =
    allQuotes?.filter(
      (q) =>
        new Date((q as any).quote_date) >= firstDayOfMonth &&
        new Date((q as any).quote_date) <= lastDayOfMonth
    ) || [];

  const quotesLastMonth =
    allQuotes?.filter(
      (q) =>
        new Date((q as any).quote_date) >= firstDayOfLastMonth &&
        new Date((q as any).quote_date) <= lastDayOfLastMonth
    ) || [];

  const pendingQuotes =
    allQuotes?.filter((q) => (q as any).status === "pending") || [];

  const quoteTrend =
    quotesLastMonth.length > 0
      ? ((quotesThisMonth.length - quotesLastMonth.length) /
          quotesLastMonth.length) *
        100
      : 0;

  // Fetch appointments data
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const { data: allAppointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", userId);

  const upcomingAppointments =
    allAppointments?.filter(
      (apt) =>
        new Date((apt as any).start_time) >= now && (apt as any).status !== "cancelled"
    ) || [];

  const todayAppointments =
    allAppointments?.filter(
      (apt) =>
        new Date((apt as any).start_time) >= today &&
        new Date((apt as any).start_time) < tomorrow &&
        (apt as any).status !== "cancelled"
    ) || [];

  const thisWeekAppointments =
    allAppointments?.filter(
      (apt) =>
        new Date((apt as any).start_time) >= startOfWeek &&
        new Date((apt as any).start_time) < endOfWeek &&
        (apt as any).status !== "cancelled"
    ) || [];

  // Fetch clients data
  const { data: allClients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId);

  const clientsThisMonth =
    allClients?.filter(
      (c) =>
        new Date((c as any).created_at) >= firstDayOfMonth &&
        new Date((c as any).created_at) <= lastDayOfMonth
    ) || [];

  const clientsLastMonth =
    allClients?.filter(
      (c) =>
        new Date((c as any).created_at) >= firstDayOfLastMonth &&
        new Date((c as any).created_at) <= lastDayOfLastMonth
    ) || [];

  const clientTrend =
    clientsLastMonth.length > 0
      ? ((clientsThisMonth.length - clientsLastMonth.length) /
          clientsLastMonth.length) *
        100
      : 0;

  return {
    invoices: {
      total: allInvoices?.length || 0,
      thisMonth: invoicesThisMonth.length,
      unpaid: unpaidInvoices.length,
      revenue: totalRevenue,
      revenueThisMonth,
      trend: invoiceTrend,
    },
    quotes: {
      total: allQuotes?.length || 0,
      thisMonth: quotesThisMonth.length,
      pending: pendingQuotes.length,
      trend: quoteTrend,
    },
    appointments: {
      total: allAppointments?.length || 0,
      upcoming: upcomingAppointments.length,
      today: todayAppointments.length,
      thisWeek: thisWeekAppointments.length,
    },
    clients: {
      total: allClients?.length || 0,
      newThisMonth: clientsThisMonth.length,
      trend: clientTrend,
    },
  };
}

/**
 * Get recent activity items for the dashboard
 */
export async function getRecentActivity(
  userId: string,
  limit: number = 10
): Promise<ActivityItem[]> {
  const supabase = await createClient();

  // Fetch recent items from different tables
  const [invoices, quotes, appointments, clients] = await Promise.all([
    supabase
      .from("invoices")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("quotes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("appointments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("clients")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const activities: ActivityItem[] = [];

  // Add invoice activities
  invoices.data?.forEach((inv) => {
    activities.push({
      id: `invoice-${(inv as any).id}`,
      type: "invoice",
      title: `Facture ${(inv as any).invoice_number}`,
      description: `${(inv as any).client_name} - ${(inv as any).total_amount}€`,
      timestamp: new Date((inv as any).created_at),
      status:
        (inv as any).status === "paid"
          ? "success"
          : (inv as any).status === "cancelled"
          ? "error"
          : "pending",
    });
  });

  // Add quote activities
  quotes.data?.forEach((quote) => {
    activities.push({
      id: `quote-${(quote as any).id}`,
      type: "quote",
      title: `Devis ${(quote as any).quote_number}`,
      description: `${(quote as any).client_name} - ${(quote as any).total_amount}€`,
      timestamp: new Date((quote as any).created_at),
      status:
        (quote as any).status === "accepted"
          ? "success"
          : (quote as any).status === "rejected"
          ? "error"
          : "pending",
    });
  });

  // Add appointment activities
  appointments.data?.forEach((apt) => {
    activities.push({
      id: `appointment-${(apt as any).id}`,
      type: "appointment",
      title: (apt as any).title,
      description: `${(apt as any).client_name} - ${new Date(
        (apt as any).start_time
      ).toLocaleString("fr-FR")}`,
      timestamp: new Date((apt as any).created_at),
      status:
        (apt as any).status === "confirmed"
          ? "success"
          : (apt as any).status === "cancelled"
          ? "error"
          : "pending",
    });
  });

  // Add client activities
  clients.data?.forEach((client) => {
    activities.push({
      id: `client-${(client as any).id}`,
      type: "client",
      title: `Nouveau client`,
      description: `${(client as any).name} ${(client as any).surname || ""}`.trim(),
      timestamp: new Date((client as any).created_at),
      status: "success",
    });
  });

  // Sort by timestamp and limit
  return activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}
