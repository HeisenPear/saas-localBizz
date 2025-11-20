/**
 * User Navigation Component
 *
 * User menu with profile info and logout.
 */

"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface UserNavProps {
  user: User;
  profile: Profile | null;
}

export function UserNav({ user, profile }: UserNavProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="hidden flex-col items-end text-sm sm:flex">
        <p className="font-medium">{user.email}</p>
      </div>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        Déconnexion
      </Button>
    </div>
  );
}
