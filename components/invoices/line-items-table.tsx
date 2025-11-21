/**
 * Line Items Table Component
 *
 * Manage invoice line items with add/remove/edit
 */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import type { LineItem } from "./invoice-form";

interface LineItemsTableProps {
  lineItems: LineItem[];
  onUpdateLineItems: (items: LineItem[]) => void;
}

export function LineItemsTable({
  lineItems,
  onUpdateLineItems,
}: LineItemsTableProps) {
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unit_price: 0,
      tax_rate: 20,
      amount: 0,
    };
    onUpdateLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      onUpdateLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    const updated = lineItems.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate amount
        updatedItem.amount = updatedItem.quantity * updatedItem.unit_price;
        return updatedItem;
      }
      return item;
    });
    onUpdateLineItems(updated);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Description</TableHead>
              <TableHead className="w-[12%]">Quantité</TableHead>
              <TableHead className="w-[15%]">Prix unitaire</TableHead>
              <TableHead className="w-[12%]">TVA (%)</TableHead>
              <TableHead className="w-[15%]">Montant HT</TableHead>
              <TableHead className="w-[6%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input
                    placeholder="Description du service ou produit"
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(item.id, "description", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(
                        item.id,
                        "quantity",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) =>
                      updateLineItem(
                        item.id,
                        "unit_price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <select
                    value={item.tax_rate}
                    onChange={(e) =>
                      updateLineItem(
                        item.id,
                        "tax_rate",
                        parseFloat(e.target.value)
                      )
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="0">0%</option>
                    <option value="5.5">5.5%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                  </select>
                </TableCell>
                <TableCell className="font-medium">
                  {item.amount.toFixed(2)} €
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addLineItem}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter une ligne
      </Button>
    </div>
  );
}
