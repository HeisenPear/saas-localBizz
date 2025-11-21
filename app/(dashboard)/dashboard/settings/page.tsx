/**
 * Settings Page
 *
 * Main settings page with tabbed navigation for:
 * - Profile settings
 * - Business information
 * - Billing configuration
 * - Security settings
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/queries";
import { SettingsTabs } from "@/components/settings/tabs-navigation";

export const metadata = {
  title: "Paramètres",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentUserProfile();

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos préférences et informations de compte
        </p>
      </div>

      <SettingsTabs user={user} profile={profile} />
    </div>
  );
}
