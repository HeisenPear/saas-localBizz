/**
 * Formatting Utilities
 *
 * Common formatting functions that can be used in both client and server components
 */

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format short date (DD/MM/YYYY)
 */
export function formatShortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR");
}
