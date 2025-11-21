/**
 * Client Selector Component
 *
 * Select or create a client for invoice
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Check } from "lucide-react";
import type { Database } from "@/types/database";

type Client = Database["public"]["Tables"]["clients"]["Row"];

interface ClientSelectorProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client | null) => void;
}

export function ClientSelector({
  clients,
  selectedClient,
  onSelectClient,
}: ClientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedClient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border bg-secondary/30 p-4">
          <div>
            <div className="font-medium">{selectedClient.name}</div>
            {selectedClient.email && (
              <div className="text-sm text-muted-foreground">
                {selectedClient.email}
              </div>
            )}
            {selectedClient.phone && (
              <div className="text-sm text-muted-foreground">
                {selectedClient.phone}
              </div>
            )}
            {selectedClient.address && (
              <div className="text-sm text-muted-foreground">
                {(selectedClient.address as any).street},{" "}
                {(selectedClient.address as any).postalCode}{" "}
                {(selectedClient.address as any).city}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectClient(null)}
          >
            Changer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Label htmlFor="clientSearch">Rechercher un client</Label>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="clientSearch"
            placeholder="Nom, email ou téléphone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="pl-8"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && searchQuery && (
          <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border bg-background shadow-lg">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-secondary"
                  onClick={() => {
                    onSelectClient(client);
                    setShowDropdown(false);
                    setSearchQuery("");
                  }}
                >
                  <div className="font-medium">{client.name}</div>
                  {client.email && (
                    <div className="text-sm text-muted-foreground">
                      {client.email}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Aucun client trouvé
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link href="/dashboard/clients/new?return=/dashboard/invoices/new">
          <Plus className="mr-2 h-4 w-4" />
          Créer un nouveau client
        </Link>
      </Button>
    </div>
  );
}
