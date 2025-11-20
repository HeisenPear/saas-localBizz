/**
 * Supabase Client for Server Components and Server Actions
 *
 * Use this client in:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 *
 * This client properly handles cookies in the server environment.
 *
 * @example
 * ```tsx
 * import { createClient } from "@/lib/supabase/server";
 *
 * export async function MyServerComponent() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('profiles').select('*');
 *   // ...
 * }
 * ```
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
