/**
 * Invoices Table Component
 *
 * Display invoices in a table with actions
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/dashboard/stats";
import {
  Eye,
  Edit,
  Download,
  Mail,
  MoreVertical,
  Trash,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Database } from "@/types/database";

type Invoice = Database["public"]["Tables"]["invoices"]["Row"];

interface InvoicesTableProps {
  invoices: Invoice[];
  currentPage: number;
  totalPages: number;
}

const statusConfig = {
  draft: { label: "Brouillon", color: "bg-gray-500" },
  pending: { label: "En attente", color: "bg-yellow-500" },
  paid: { label: "Payée", color: "bg-green-500" },
  overdue: { label: "En retard", color: "bg-red-500" },
  cancelled: { label: "Annulée", color: "bg-gray-400" },
};

export function InvoicesTable({
  invoices,
  currentPage,
  totalPages,
}: InvoicesTableProps) {
  const router = useRouter();

  if (!invoices || invoices.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">Aucune facture trouvée</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/invoices/new">Créer votre première facture</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              const status = statusConfig[invoice.status as keyof typeof statusConfig];
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="hover:underline"
                    >
                      {invoice.invoice_number}
                    </Link>
                  </TableCell>
                  <TableCell>{invoice.client_name}</TableCell>
                  <TableCell>
                    {new Date(invoice.invoice_date).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.due_date).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${status.color} text-white`}
                    >
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/invoices/${invoice.id}`)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/invoices/${invoice.id}/edit`)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Envoyer par email
                        </DropdownMenuItem>
                        {invoice.status === "pending" && (
                          <DropdownMenuItem>
                            <Check className="mr-2 h-4 w-4" />
                            Marquer comme payée
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => router.push(`?page=${currentPage - 1}`)}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => router.push(`?page=${currentPage + 1}`)}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
