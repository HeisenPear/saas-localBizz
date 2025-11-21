/**
 * Dashboard Home Page
 *
 * Main dashboard page showing overview, statistics, and quick actions.
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/stats-card";
import { QuickActionButton } from "@/components/dashboard/quick-action-button";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { getDashboardStats, getRecentActivity } from "@/lib/dashboard/stats";
import { formatCurrency } from "@/lib/utils/format";
import {
  FileText,
  FileSpreadsheet,
  Calendar,
  Users,
  Globe,
  Settings,
  AlertCircle,
  Euro,
} from "lucide-react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const metadata = {
  title: "Tableau de bord",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  const profile: Profile | null = await getCurrentUserProfile();

  if (!profile) {
    return <div>Loading...</div>;
  }

  // Fetch dashboard statistics
  const stats = await getDashboardStats(user.id);
  const activities = await getRecentActivity(user.id);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenue, {profile.business_name}
        </h1>
        <p className="text-muted-foreground">
          Gérez votre activité depuis votre tableau de bord
        </p>
      </div>

      {/* Trial Banner (if applicable) */}
      {profile.subscription_status === "trial" && profile.trial_ends_at && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold">
                Votre essai gratuit est en cours
              </h3>
              <p className="text-sm text-muted-foreground">
                Profitez de toutes les fonctionnalités jusqu&apos;au{" "}
                {new Date(profile.trial_ends_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Button asChild>
              <Link href="/pricing">Choisir un plan</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Unpaid Invoices Alert */}
      {stats.invoices.unpaid > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                  {stats.invoices.unpaid} facture{stats.invoices.unpaid > 1 ? "s" : ""} impayée{stats.invoices.unpaid > 1 ? "s" : ""}
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Relancez vos clients pour accélérer les paiements
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/invoices?status=unpaid">Voir</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Vue d&apos;ensemble</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Chiffre d'affaires"
            value={formatCurrency(stats.invoices.revenueThisMonth)}
            description="Ce mois-ci"
            icon={<Euro className="h-4 w-4" />}
            trend={{
              value: Math.round(stats.invoices.trend),
              label: "vs mois dernier",
            }}
          />
          <StatsCard
            title="Factures ce mois"
            value={stats.invoices.thisMonth}
            description={`${stats.invoices.unpaid} impayée${stats.invoices.unpaid > 1 ? "s" : ""}`}
            icon={<FileText className="h-4 w-4" />}
          />
          <StatsCard
            title="Rendez-vous"
            value={stats.appointments.upcoming}
            description={`${stats.appointments.today} aujourd'hui`}
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatsCard
            title="Clients"
            value={stats.clients.total}
            description={`+${stats.clients.newThisMonth} ce mois`}
            icon={<Users className="h-4 w-4" />}
            trend={{
              value: Math.round(stats.clients.trend),
              label: "vs mois dernier",
            }}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Actions rapides</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionButton
              href="/dashboard/invoices/new"
              icon={<FileText className="h-6 w-6" />}
              label="Créer une facture"
              description="Nouvelle facture client"
            />
            <QuickActionButton
              href="/dashboard/quotes/new"
              icon={<FileSpreadsheet className="h-6 w-6" />}
              label="Créer un devis"
              description="Nouveau devis"
            />
            <QuickActionButton
              href="/dashboard/appointments/new"
              icon={<Calendar className="h-6 w-6" />}
              label="Nouveau RDV"
              description="Planifier un rendez-vous"
            />
            <QuickActionButton
              href="/dashboard/clients/new"
              icon={<Users className="h-6 w-6" />}
              label="Ajouter un client"
              description="Nouveau contact"
            />
            <QuickActionButton
              href="/dashboard/website"
              icon={<Globe className="h-6 w-6" />}
              label="Modifier le site"
              description={profile.website_subdomain}
            />
            <QuickActionButton
              href="/dashboard/settings"
              icon={<Settings className="h-6 w-6" />}
              label="Paramètres"
              description="Configurer"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} maxItems={8} />
        </div>
      </div>
    </div>
  );
}
