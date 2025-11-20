/**
 * Landing Page (Home) for LocalBiz Engine
 *
 * This is the public-facing homepage that showcases the platform
 * to potential customers. Features:
 * - Hero section with value proposition
 * - Feature highlights
 * - Social proof
 * - CTA to signup
 */

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              LocalBiz Engine
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Tarifs
            </Link>
            <Link
              href="/features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Fonctionnalités
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Gérez votre activité d&apos;artisan en{" "}
            <span className="text-primary">toute simplicité</span>
          </h1>

          <p className="text-xl text-muted-foreground">
            Site web professionnel, facturation, prise de RDV, CRM clients.
            Tout ce dont vous avez besoin pour développer votre entreprise.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90"
            >
              Démarrer gratuitement
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-border px-8 py-3 text-lg font-medium hover:bg-secondary"
            >
              Voir les tarifs
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            ✓ Essai gratuit 14 jours • ✓ Sans carte bancaire • ✓ Support en
            français
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Tout ce qu&apos;il vous faut
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-semibold">Site web pro</h3>
              <p className="text-muted-foreground">
                Un site moderne pour présenter vos services et gagner en
                visibilité
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold">Facturation simple</h3>
              <p className="text-muted-foreground">
                Créez devis et factures en quelques clics. Conforme à la loi
                française
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold">Prise de RDV</h3>
              <p className="text-muted-foreground">
                Vos clients réservent directement en ligne. Fini les appels
                manqués
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 LocalBiz Engine. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
