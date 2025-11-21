/**
 * API Response Types
 *
 * Common types for API responses
 */

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
