/**
 * Providers Component
 * Wraps the application with necessary context providers
 * - Toast notifications (future)
 * - Theme provider (future)
 * - React Query (future)
 */

"use client";

import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // For now, this is a simple wrapper
  // We'll add Toast, Theme, and React Query providers as needed
  return <>{children}</>;
}
