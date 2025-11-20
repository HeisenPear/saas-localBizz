/**
 * Root Layout for LocalBiz Engine
 *
 * This is the root layout component that wraps all pages in the application.
 * It includes:
 * - SEO metadata
 * - Font optimization (Inter)
 * - Global styles
 * - Providers wrapper (for context, themes, etc.)
 *
 * Architecture:
 * - Uses Next.js 14 App Router
 * - Server Component by default (no "use client")
 * - Client-side providers wrapped separately
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "@/styles/globals.css";

// Font optimization with Next.js font loader
// Inter is a clean, professional sans-serif font perfect for SaaS applications
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// SEO Metadata Configuration
// This metadata applies to all pages unless overridden
export const metadata: Metadata = {
  title: {
    default: "LocalBiz Engine - Plateforme tout-en-un pour artisans",
    template: "%s | LocalBiz Engine",
  },
  description:
    "Solution complète pour gérer votre activité d'artisan : site web, facturation, prise de RDV, CRM clients. Essai gratuit 14 jours.",
  keywords: [
    "artisan",
    "PME",
    "facturation",
    "devis",
    "site web",
    "prise de rendez-vous",
    "gestion clients",
    "CRM",
  ],
  authors: [{ name: "LocalBiz Engine" }],
  creator: "LocalBiz Engine",
  publisher: "LocalBiz Engine",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "LocalBiz Engine - Plateforme tout-en-un pour artisans",
    description:
      "Solution complète pour gérer votre activité d'artisan : site web, facturation, prise de RDV, CRM clients.",
    siteName: "LocalBiz Engine",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalBiz Engine - Plateforme tout-en-un pour artisans",
    description:
      "Solution complète pour gérer votre activité d'artisan : site web, facturation, prise de RDV, CRM clients.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
