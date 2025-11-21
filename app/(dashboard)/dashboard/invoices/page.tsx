/**
 * Invoices List Page
 *
 * Display all invoices with filters, search, and actions
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoicesTable } from "@/components/invoices/invoices-table";
import { InvoiceFilters } from "@/components/invoices/invoice-filters";
import { Plus, Search } from "lucide-react";

export const metadata = {
  title: "Factures",
};

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function InvoicesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Await searchParams
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "all";
  const page = parseInt(params.page || "1");
  const perPage = 20;

  // Build query
  let query = supabase
    .from("invoices")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("invoice_date", { ascending: false });

  // Apply filters
  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `invoice_number.ilike.%${search}%,client_name.ilike.%${search}%`
    );
  }

  // Apply pagination
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data: invoices, count, error } = await query;

  if (error) {
    console.error("Error fetching invoices:", error);
  }

  const totalPages = count ? Math.ceil(count / perPage) : 0;

  // Calculate stats
  const allInvoices = await supabase
    .from("invoices")
    .select("total_amount, status")
    .eq("user_id", user.id);

  const stats = {
    total: allInvoices.data?.length || 0,
    paid: allInvoices.data?.filter((inv) => inv.status === "paid").length || 0,
    pending:
      allInvoices.data?.filter((inv) => inv.status === "pending").length || 0,
    overdue:
      allInvoices.data?.filter((inv) => inv.status === "overdue").length || 0,
    totalAmount:
      allInvoices.data?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) ||
      0,
    pendingAmount:
      allInvoices.data
        ?.filter((inv) => inv.status === "pending" || inv.status === "overdue")
        .reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factures</h1>
          <p className="text-muted-foreground">
            Gérez vos factures et suivez vos paiements
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle facture
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total factures
          </div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">Payées</div>
          <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            En attente
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            En retard
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <InvoiceFilters currentStatus={status} />
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            defaultValue={search}
            className="pl-8"
            name="search"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <InvoicesTable
        invoices={invoices || []}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
