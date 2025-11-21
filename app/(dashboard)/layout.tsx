/**
 * Dashboard Layout
 *
 * Layout for all authenticated dashboard pages.
 * Includes:
 * - Desktop sidebar navigation
 * - Mobile bottom navigation
 * - Top header with user menu
 * - Protected route (requires authentication)
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/queries";
import { UserNav } from "@/components/dashboard/user-nav";
import { DashboardLayoutClient } from "@/components/dashboard/layout-client";

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
    <DashboardLayoutClient user={user} profile={profile}>
      {children}
    </DashboardLayoutClient>
  );
}
