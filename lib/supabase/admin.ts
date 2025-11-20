/**
 * Supabase Admin Client
 *
 * This client uses the service role key and bypasses Row Level Security (RLS).
 * ⚠️ USE WITH EXTREME CAUTION - Only in secure server-side contexts!
 *
 * Use cases:
 * - Webhook handlers (Stripe webhooks)
 * - Admin operations that need to bypass RLS
 * - Background jobs
 *
 * NEVER expose this client to the browser or client-side code!
 *
 * @example
 * ```tsx
 * import { createAdminClient } from "@/lib/supabase/admin";
 *
 * export async function POST(request: Request) {
 *   const supabase = createAdminClient();
 *   // Admin operations that bypass RLS...
 * }
 * ```
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Admin client cannot be created."
    );
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
