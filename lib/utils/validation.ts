/**
 * Validation Utilities
 * Helper functions for validating French business data
 */

/**
 * Validate French SIRET number (14 digits)
 * @example isValidSiret("12345678901234") => true
 */
export function isValidSiret(siret: string): boolean {
  const cleaned = siret.replace(/\s/g, "");
  if (!/^\d{14}$/.test(cleaned)) return false;

  // Luhn algorithm validation
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = parseInt(cleaned[i]);
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/**
 * Validate French phone number
 * @example isValidPhoneNumber("0612345678") => true
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "");
  return /^0[1-9]\d{8}$/.test(cleaned);
}

/**
 * Validate French postal code
 * @example isValidPostalCode("75001") => true
 */
export function isValidPostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode);
}

/**
 * Generate a URL-friendly subdomain from business name
 * @example generateSubdomain("Dupont Plomberie") => "dupont-plomberie"
 */
export function generateSubdomain(businessName: string): string {
  return businessName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove consecutive hyphens
    .slice(0, 63); // Max subdomain length
}
