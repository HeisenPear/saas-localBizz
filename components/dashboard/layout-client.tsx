/**
 * Dashboard Layout Client Component
 *
 * Client-side layout wrapper that handles:
 * - Sidebar visibility
 * - Mobile menu state
 * - Responsive layout
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { UserNav } from "@/components/dashboard/user-nav";
import { Sidebar, MobileSidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: User;
  profile: Profile | null;
}

export function DashboardLayoutClient({
  children,
  user,
  profile,
}: DashboardLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                LocalBiz Engine
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {profile && (
              <div className="hidden text-sm sm:block">
                <p className="font-medium">{profile.business_name}</p>
                <p className="text-xs text-muted-foreground">
                  {profile.subscription_status === "trial"
                    ? "Essai gratuit"
                    : profile.subscription_tier || "Aucun abonnement"}
                </p>
              </div>
            )}
            <UserNav user={user} profile={profile} />
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 bg-secondary/30 pb-20 lg:ml-64 lg:pb-8">
        <div className="container px-4 py-8">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav onMenuClick={() => setIsMobileMenuOpen(true)} />
    </div>
  );
}
