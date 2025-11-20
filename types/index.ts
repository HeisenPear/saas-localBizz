/**
 * TypeScript Type Definitions for LocalBiz Engine
 * Core data models for the application
 */

/**
 * ============================================
 * USER & AUTHENTICATION TYPES
 * ============================================
 */

export type SubscriptionTier = "essential" | "pro" | "premium" | null;
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trial"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | null;

export type BusinessType =
  | "plombier"
  | "electricien"
  | "macon"
  | "peintre"
  | "menuisier"
  | "couvreur"
  | "chauffagiste"
  | "serrurier"
  | "jardinier"
  | "autre";

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  businessName: string;
  businessType: BusinessType;
  phone: string;
  address: Address;
  siret?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialEndsAt?: Date;
  websiteSubdomain: string;
  websiteCustomDomain?: string;
  websitePublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ============================================
 * SUBSCRIPTION & BILLING TYPES
 * ============================================
 */

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  description: string;
  priceId: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ============================================
 * INVOICE TYPES
 * ============================================
 */

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "canceled";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // Percentage (e.g., 20 for 20%)
  total: number;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: Address;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  paymentMethod?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ============================================
 * QUOTE (DEVIS) TYPES
 * ============================================
 */

export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"
  | "expired";

export interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface Quote {
  id: string;
  userId: string;
  quoteNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: Address;
  status: QuoteStatus;
  issueDate: Date;
  validUntil: Date;
  items: QuoteItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ============================================
 * APPOINTMENT TYPES
 * ============================================
 */

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "canceled";

export interface Appointment {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes?: string;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ============================================
 * CLIENT (CUSTOMER) TYPES
 * ============================================
 */

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  notes?: string;
  totalInvoiced: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ============================================
 * WEBSITE CONTENT TYPES
 * ============================================
 */

export interface ServiceItem {
  name: string;
  description: string;
  price?: number;
}

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface WebsiteContent {
  id: string;
  userId: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  services: ServiceItem[];
  galleryImages: GalleryImage[];
  contactEmail: string;
  contactPhone: string;
  businessHours: BusinessHours;
  socialLinks: SocialLinks;
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ============================================
 * USAGE LOGS TYPES
 * ============================================
 */

export type UsageActionType =
  | "invoice_created"
  | "invoice_sent"
  | "invoice_paid"
  | "quote_created"
  | "quote_sent"
  | "quote_accepted"
  | "appointment_booked"
  | "appointment_completed"
  | "client_created"
  | "website_published"
  | "website_updated";

export interface UsageLog {
  id: string;
  userId: string;
  actionType: UsageActionType;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * ============================================
 * API RESPONSE TYPES
 * ============================================
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}
