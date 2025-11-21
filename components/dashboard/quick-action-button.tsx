/**
 * Quick Action Button Component
 *
 * A visually prominent button for common dashboard actions
 */

import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickActionButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  variant?: "default" | "outline";
  className?: string;
}

export function QuickActionButton({
  href,
  icon,
  label,
  description,
  variant = "outline",
  className,
}: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border p-6 transition-all hover:scale-105 hover:shadow-md",
        variant === "default"
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border bg-background hover:border-primary hover:bg-secondary/50",
        className
      )}
    >
      <div className="rounded-full bg-primary/10 p-3">{icon}</div>
      <div className="text-center">
        <div className="font-medium">{label}</div>
        {description && (
          <div className="mt-1 text-xs text-muted-foreground">
            {description}
          </div>
        )}
      </div>
    </Link>
  );
}
