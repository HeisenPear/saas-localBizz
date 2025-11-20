/**
 * Supabase Client for Client Components
 *
 * Use this client in Client Components (components with "use client" directive).
 * This client uses browser cookies for session management.
 *
 * @example
 * ```tsx
 * "use client";
 * import { createClient } from "@/lib/supabase/client";
 *
 * export function MyClientComponent() {
 *   const supabase = createClient();
 *   // Use supabase client...
 * }
 * ```
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
