/**
 * Invoice Filters Component
 *
 * Filter invoices by status
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InvoiceFiltersProps {
  currentStatus: string;
}

const filters = [
  { value: "all", label: "Toutes" },
  { value: "draft", label: "Brouillons" },
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payées" },
  { value: "overdue", label: "En retard" },
  { value: "cancelled", label: "Annulées" },
];

export function InvoiceFilters({ currentStatus }: InvoiceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page"); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentStatus === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilter(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
