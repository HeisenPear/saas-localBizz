/**
 * Settings Tabs Navigation
 *
 * Tabbed interface for different settings sections
 */

"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { BusinessSettings } from "@/components/settings/business-settings";
import { BillingSettings } from "@/components/settings/billing-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import { User, Building2, CreditCard, Shield } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface SettingsTabsProps {
  user: SupabaseUser;
  profile: Profile;
}

export function SettingsTabs({ user, profile }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 lg:w-auto">
        <TabsTrigger value="profile" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profil</span>
        </TabsTrigger>
        <TabsTrigger value="business" className="gap-2">
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">Entreprise</span>
        </TabsTrigger>
        <TabsTrigger value="billing" className="gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Facturation</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Sécurité</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4">
        <ProfileSettings user={user} profile={profile} />
      </TabsContent>

      <TabsContent value="business" className="space-y-4">
        <BusinessSettings profile={profile} />
      </TabsContent>

      <TabsContent value="billing" className="space-y-4">
        <BillingSettings profile={profile} />
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <SecuritySettings user={user} />
      </TabsContent>
    </Tabs>
  );
}
