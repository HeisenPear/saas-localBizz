/**
 * Database Types - Auto-generated from Supabase Schema
 *
 * These types match the Supabase database schema exactly.
 * Update these types whenever the database schema changes.
 *
 * Note: In production, you can auto-generate these using:
 * npx supabase gen types typescript --project-id your-project-id > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          business_name: string;
          business_type: string;
          phone: string;
          address: Json;
          siret: string | null;
          subscription_tier: string | null;
          subscription_status: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          trial_ends_at: string | null;
          website_subdomain: string;
          website_custom_domain: string | null;
          website_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          business_name: string;
          business_type: string;
          phone: string;
          address?: Json;
          siret?: string | null;
          subscription_tier?: string | null;
          subscription_status?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          trial_ends_at?: string | null;
          website_subdomain: string;
          website_custom_domain?: string | null;
          website_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          business_name?: string;
          business_type?: string;
          phone?: string;
          address?: Json;
          siret?: string | null;
          subscription_tier?: string | null;
          subscription_status?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          trial_ends_at?: string | null;
          website_subdomain?: string;
          website_custom_domain?: string | null;
          website_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          invoice_number: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          client_address: Json;
          status: string;
          issue_date: string;
          due_date: string;
          items: Json;
          subtotal: number;
          tax_amount: number;
          total_amount: number;
          notes: string | null;
          payment_method: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          invoice_number: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          client_address?: Json;
          status?: string;
          issue_date: string;
          due_date: string;
          items?: Json;
          subtotal?: number;
          tax_amount?: number;
          total_amount?: number;
          notes?: string | null;
          payment_method?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          invoice_number?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string;
          client_address?: Json;
          status?: string;
          issue_date?: string;
          due_date?: string;
          items?: Json;
          subtotal?: number;
          tax_amount?: number;
          total_amount?: number;
          notes?: string | null;
          payment_method?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          user_id: string;
          quote_number: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          client_address: Json;
          status: string;
          issue_date: string;
          valid_until: string;
          items: Json;
          subtotal: number;
          tax_amount: number;
          total_amount: number;
          notes: string | null;
          accepted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quote_number: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          client_address?: Json;
          status?: string;
          issue_date: string;
          valid_until: string;
          items?: Json;
          subtotal?: number;
          tax_amount?: number;
          total_amount?: number;
          notes?: string | null;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quote_number?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string;
          client_address?: Json;
          status?: string;
          issue_date?: string;
          valid_until?: string;
          items?: Json;
          subtotal?: number;
          tax_amount?: number;
          total_amount?: number;
          notes?: string | null;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          user_id: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          service_type: string;
          start_time: string;
          end_time: string;
          status: string;
          notes: string | null;
          address: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          client_name: string;
          client_email: string;
          client_phone: string;
          service_type: string;
          start_time: string;
          end_time: string;
          status?: string;
          notes?: string | null;
          address?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string;
          service_type?: string;
          start_time?: string;
          end_time?: string;
          status?: string;
          notes?: string | null;
          address?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          address: Json;
          notes: string | null;
          total_invoiced: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          address?: Json;
          notes?: string | null;
          total_invoiced?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: Json;
          notes?: string | null;
          total_invoiced?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      website_content: {
        Row: {
          id: string;
          user_id: string;
          hero_title: string;
          hero_subtitle: string;
          about_text: string;
          services: Json;
          gallery_images: Json;
          contact_email: string;
          contact_phone: string;
          business_hours: Json;
          social_links: Json;
          seo_title: string;
          seo_description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hero_title?: string;
          hero_subtitle?: string;
          about_text?: string;
          services?: Json;
          gallery_images?: Json;
          contact_email: string;
          contact_phone: string;
          business_hours?: Json;
          social_links?: Json;
          seo_title?: string;
          seo_description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hero_title?: string;
          hero_subtitle?: string;
          about_text?: string;
          services?: Json;
          gallery_images?: Json;
          contact_email?: string;
          contact_phone?: string;
          business_hours?: Json;
          social_links?: Json;
          seo_title?: string;
          seo_description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          action_type: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action_type: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action_type?: string;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_invoice_number: {
        Args: { p_user_id: string };
        Returns: string;
      };
      generate_quote_number: {
        Args: { p_user_id: string };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
