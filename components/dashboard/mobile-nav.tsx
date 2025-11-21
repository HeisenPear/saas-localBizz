/**
 * Mobile Bottom Navigation
 *
 * Fixed bottom navigation bar for mobile devices
 * Shows most important navigation items
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mobileNavItems: NavItem[] = [
  {
    title: "Accueil",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Factures",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    title: "Agenda",
    href: "/dashboard/appointments",
    icon: Calendar,
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
];

interface MobileNavProps {
  onMenuClick: () => void;
}

export function MobileNav({ onMenuClick }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
      <div className="grid h-16 grid-cols-5 gap-1">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.title}</span>
            </Link>
          );
        })}

        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs">Menu</span>
        </button>
      </div>
    </nav>
  );
}
