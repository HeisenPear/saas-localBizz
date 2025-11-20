/**
 * Dashboard Layout
 *
 * Layout for all authenticated dashboard pages.
 * Includes:
 * - Navigation sidebar
 * - Top header with user menu
 * - Protected route (requires authentication)
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/queries";
import { DashboardNav } from "@/components/dashboard/nav";
import { UserNav } from "@/components/dashboard/user-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentUserProfile();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                LocalBiz Engine
              </span>
            </Link>

            <DashboardNav />
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

      {/* Main Content */}
      <main className="flex-1 bg-secondary/30">
        <div className="container px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
