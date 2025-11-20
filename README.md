# LocalBiz Engine - SaaS Platform for French Local Businesses

A complete Next.js 14 SaaS application built for French artisans and local businesses.

## 🎯 Project Overview

LocalBiz Engine is an all-in-one platform that helps French local businesses (artisans, PME) manage their operations with:

- **Professional Website**: Auto-generated business website with custom subdomain
- **Invoicing System**: Create and manage invoices and quotes (devis)
- **Appointment Booking**: Online appointment scheduling
- **CRM**: Customer database and relationship management
- **Subscription Management**: Stripe-powered tiered pricing (Essential, Pro, Premium)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **Payments**: Stripe (subscriptions + billing)
- **Email**: Resend (transactional emails)
- **Form Management**: React Hook Form + Zod validation

## 📁 Project Structure

```
/app
  /(auth)              # Authentication pages (login, signup, reset password)
  /(marketing)         # Public pages (landing, pricing, features)
  /(dashboard)         # Protected dashboard pages
  /api                 # API routes (Stripe webhooks, etc.)
/components
  /ui                  # shadcn/ui components
  /auth                # Authentication components
  /dashboard           # Dashboard-specific components
  /billing             # Billing and subscription components
/lib
  /supabase           # Supabase client utilities
  /stripe             # Stripe utilities
  /auth               # Auth server actions
  /utils              # Utility functions
  /validations        # Zod schemas
/types                # TypeScript type definitions
/hooks                # Custom React hooks
/styles               # Global CSS
/public               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (https://supabase.com)
- A Stripe account (https://stripe.com)
- A Resend account (https://resend.com) - optional for emails

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_ESSENTIAL=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_PREMIUM=price_...

# Resend
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and execute the SQL script

This will create all necessary tables, indexes, RLS policies, and functions.

### 4. Configure Google OAuth (Optional)

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials
4. Add authorized redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 5. Set Up Stripe Products

1. In Stripe Dashboard, create 3 products:
   - **Essential**: €79/month
   - **Pro**: €149/month
   - **Premium**: €299/month

2. Copy each product's Price ID to your `.env.local` file

3. Set up a webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📦 What's Included

### Sprint 1.1: Project Setup ✅
- [x] Next.js 14 project initialization
- [x] TypeScript configuration
- [x] Tailwind CSS setup with custom colors
- [x] Complete folder structure
- [x] Environment variables template
- [x] Root layout with SEO metadata
- [x] Middleware for route protection
- [x] Core TypeScript types

### Sprint 1.2: Database Schema ✅
- [x] Complete PostgreSQL schema
- [x] Row Level Security (RLS) policies
- [x] Database helper functions
- [x] TypeScript database types
- [x] Supabase client utilities (server, client, admin)
- [x] Reusable query functions

### Sprint 1.3: Authentication System ✅
- [x] Login page with email/password
- [x] Signup page with business information
- [x] Password reset flow
- [x] Google OAuth integration
- [x] OAuth callback handler
- [x] Zod validation schemas
- [x] Server actions for auth operations
- [x] Protected routes middleware

### Sprint 1.4: Dashboard ✅
- [x] Dashboard layout with navigation
- [x] Dashboard home page
- [x] User profile display
- [x] Trial period banner
- [x] Quick stats cards
- [x] Quick action buttons

## ⚙️ Configuration

### Tailwind Custom Colors

The application uses a custom color scheme optimized for SaaS:

- **Primary**: Indigo (#4F46E5) - Main brand color
- **Secondary**: Slate - Supporting UI elements
- **Accent**: Emerald (#10B981) - Success states, CTAs
- **Destructive**: Red - Error states, warnings

### Subscription Tiers

Three tiers are pre-configured:

1. **Essential** (€79/month):
   - Professional website
   - Unlimited invoicing
   - Online appointments
   - 50 quotes/month
   - Email support

2. **Pro** (€149/month):
   - Everything in Essential
   - CRM clients
   - Unlimited quotes
   - Automated review requests
   - Advanced analytics
   - Priority support

3. **Premium** (€299/month):
   - Everything in Pro
   - Multi-user (up to 5)
   - Custom domain
   - API access
   - White-label
   - Phone support

## 🔧 Next Steps

To complete the application, you need to implement:

### Priority Features:
1. **Invoicing Module** (Sprint 2.1)
   - Create/edit invoice page
   - Invoice list with filters
   - PDF generation
   - Email sending

2. **Quotes Module** (Sprint 2.2)
   - Create/edit quote page
   - Quote list and management
   - Convert quote to invoice

3. **Appointments Module** (Sprint 2.3)
   - Calendar view
   - Create/edit appointments
   - Email notifications
   - Public booking page

4. **Website Builder** (Sprint 2.4)
   - Website customization UI
   - Content editor
   - Gallery management
   - SEO settings
   - Publish/unpublish

5. **Billing Dashboard** (Sprint 2.5)
   - Current subscription display
   - Upgrade/downgrade
   - Payment history
   - Invoice downloads

## 🐛 Known Issues

- There are some TypeScript build errors that need to be resolved related to Supabase type inference
- Middleware deprecation warning (Next.js 16 issue - will be resolved in future updates)

## 📚 Documentation

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🤝 Contributing

This is a private project. For any issues or questions, please contact the development team.

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ for French local businesses**
