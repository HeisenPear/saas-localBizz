/**
 * Dashboard Navigation Component
 *
 * Main navigation menu for the dashboard.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Accueil" },
  { href: "/dashboard/invoices", label: "Factures" },
  { href: "/dashboard/appointments", label: "Rendez-vous" },
  { href: "/dashboard/website", label: "Site web" },
  { href: "/dashboard/settings", label: "Paramètres" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center space-x-1 md:flex">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
