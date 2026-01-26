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
      tenants: {
        Row: {
          id: string;
          name: string;
          org_number: string | null;
          email: string;
          phone: string | null;
          subscription_status: string;
          monthly_fee_sek: number;
          success_fee_percent: number;
          settings: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          org_number?: string | null;
          email: string;
          phone?: string | null;
          subscription_status?: string;
          monthly_fee_sek?: number;
          success_fee_percent?: number;
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          org_number?: string | null;
          email?: string;
          phone?: string | null;
          subscription_status?: string;
          monthly_fee_sek?: number;
          success_fee_percent?: number;
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          tenant_id: string;
          fortnox_customer_number: string | null;
          name: string;
          org_number: string | null;
          email: string | null;
          phone: string | null;
          address_line1: string | null;
          address_line2: string | null;
          postal_code: string | null;
          city: string | null;
          country: string | null;
          contact_person: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          total_outstanding_sek: number;
          oldest_overdue_days: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          fortnox_customer_number?: string | null;
          name: string;
          org_number?: string | null;
          email?: string | null;
          phone?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string | null;
          contact_person?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          total_outstanding_sek?: number;
          oldest_overdue_days?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          fortnox_customer_number?: string | null;
          name?: string;
          org_number?: string | null;
          email?: string | null;
          phone?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          postal_code?: string | null;
          city?: string | null;
          country?: string | null;
          contact_person?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          total_outstanding_sek?: number;
          oldest_overdue_days?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          tenant_id: string;
          customer_id: string;
          fortnox_invoice_number: string | null;
          invoice_date: string;
          due_date: string;
          original_amount_sek: number;
          remaining_amount_sek: number;
          currency: string;
          status: string;
          collection_started_at: string | null;
          collection_paused_at: string | null;
          paid_at: string | null;
          handed_off_at: string | null;
          pause_reason: string | null;
          internal_notes: string | null;
          ocr_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          customer_id: string;
          fortnox_invoice_number?: string | null;
          invoice_date: string;
          due_date: string;
          original_amount_sek: number;
          remaining_amount_sek?: number;
          currency?: string;
          status?: string;
          collection_started_at?: string | null;
          collection_paused_at?: string | null;
          paid_at?: string | null;
          handed_off_at?: string | null;
          pause_reason?: string | null;
          internal_notes?: string | null;
          ocr_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          customer_id?: string;
          fortnox_invoice_number?: string | null;
          invoice_date?: string;
          due_date?: string;
          original_amount_sek?: number;
          remaining_amount_sek?: number;
          currency?: string;
          status?: string;
          collection_started_at?: string | null;
          collection_paused_at?: string | null;
          paid_at?: string | null;
          handed_off_at?: string | null;
          pause_reason?: string | null;
          internal_notes?: string | null;
          ocr_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          tenant_id: string;
          invoice_id: string;
          customer_id: string;
          amount_sek: number;
          payment_date: string;
          source: string | null;
          fortnox_payment_id: string | null;
          attributed_to_collection: boolean;
          success_fee_sek: number | null;
          success_fee_invoiced: boolean;
          success_fee_invoice_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          invoice_id: string;
          customer_id: string;
          amount_sek: number;
          payment_date: string;
          source?: string | null;
          fortnox_payment_id?: string | null;
          attributed_to_collection?: boolean;
          success_fee_sek?: number | null;
          success_fee_invoiced?: boolean;
          success_fee_invoice_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          invoice_id?: string;
          customer_id?: string;
          amount_sek?: number;
          payment_date?: string;
          source?: string | null;
          fortnox_payment_id?: string | null;
          attributed_to_collection?: boolean;
          success_fee_sek?: number | null;
          success_fee_invoiced?: boolean;
          success_fee_invoice_id?: string | null;
          created_at?: string;
        };
      };
      communication_log: {
        Row: {
          id: string;
          tenant_id: string;
          invoice_id: string | null;
          customer_id: string | null;
          scheduled_action_id: string | null;
          channel: string;
          direction: string;
          recipient_address: string | null;
          subject: string | null;
          content: string | null;
          external_id: string | null;
          status: string;
          status_updated_at: string | null;
          call_duration_seconds: number | null;
          call_recording_url: string | null;
          call_transcript: string | null;
          call_outcome: string | null;
          ai_summary: string | null;
          ai_sentiment: string | null;
          ai_next_action: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          invoice_id?: string | null;
          customer_id?: string | null;
          scheduled_action_id?: string | null;
          channel: string;
          direction: string;
          recipient_address?: string | null;
          subject?: string | null;
          content?: string | null;
          external_id?: string | null;
          status?: string;
          status_updated_at?: string | null;
          call_duration_seconds?: number | null;
          call_recording_url?: string | null;
          call_transcript?: string | null;
          call_outcome?: string | null;
          ai_summary?: string | null;
          ai_sentiment?: string | null;
          ai_next_action?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          invoice_id?: string | null;
          customer_id?: string | null;
          scheduled_action_id?: string | null;
          channel?: string;
          direction?: string;
          recipient_address?: string | null;
          subject?: string | null;
          content?: string | null;
          external_id?: string | null;
          status?: string;
          status_updated_at?: string | null;
          call_duration_seconds?: number | null;
          call_recording_url?: string | null;
          call_transcript?: string | null;
          call_outcome?: string | null;
          ai_summary?: string | null;
          ai_sentiment?: string | null;
          ai_next_action?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      v_tenant_dashboard: {
        Row: {
          tenant_id: string;
          tenant_name: string;
          active_collections: number;
          pending_invoices: number;
          paid_last_30_days: number;
          total_outstanding_sek: number;
          collected_last_30_days: number;
          actions_today: number;
        };
      };
      v_invoices_ready_for_collection: {
        Row: {
          id: string;
          tenant_id: string;
          customer_id: string;
          fortnox_invoice_number: string | null;
          invoice_date: string;
          due_date: string;
          original_amount_sek: number;
          remaining_amount_sek: number;
          currency: string;
          status: string;
          collection_started_at: string | null;
          collection_paused_at: string | null;
          paid_at: string | null;
          handed_off_at: string | null;
          pause_reason: string | null;
          internal_notes: string | null;
          ocr_number: string | null;
          created_at: string;
          updated_at: string;
          days_overdue: number;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string | null;
          tenant_name: string;
          collection_start_day: number | null;
        };
      };
    };
    Functions: {};
    Enums: {};
  };
}

// Helper types for easier usage
export type Tenant = Database['public']['Tables']['tenants']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type CommunicationLog = Database['public']['Tables']['communication_log']['Row'];
export type TenantDashboard = Database['public']['Views']['v_tenant_dashboard']['Row'];
export type InvoiceReadyForCollection = Database['public']['Views']['v_invoices_ready_for_collection']['Row'];
