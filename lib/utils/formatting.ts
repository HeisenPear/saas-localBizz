/**
 * Formatting Utilities
 * Functions for formatting currencies, dates, phone numbers, etc.
 */

import { format, formatDistance, formatRelative } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Format a number as Euro currency
 * @example formatCurrency(12345) => "12 345,00 €"
 */
export function formatCurrency(
  amount: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    ...options,
  }).format(amount);
}

/**
 * Format a date in French locale
 * @example formatDate(new Date()) => "20 novembre 2025"
 */
export function formatDate(
  date: Date | string,
  formatStr: string = "d MMMM yyyy"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}

/**
 * Format a date relative to now
 * @example formatRelativeDate(yesterday) => "hier"
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatRelative(dateObj, new Date(), { locale: fr });
}

/**
 * Format distance between dates
 * @example formatDateDistance(pastDate) => "il y a 3 jours"
 */
export function formatDateDistance(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: fr,
  });
}

/**
 * Format a French phone number
 * @example formatPhoneNumber("0612345678") => "06 12 34 56 78"
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  }
  return phone;
}

/**
 * Format a SIRET number
 * @example formatSiret("12345678901234") => "123 456 789 01234"
 */
export function formatSiret(siret: string): string {
  const cleaned = siret.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{5})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return siret;
}

/**
 * Truncate text with ellipsis
 * @example truncate("Long text here", 10) => "Long text..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate initials from a name
 * @example getInitials("Jean Dupont") => "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
