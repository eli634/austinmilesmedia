export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type InquiryStatus = "new" | "reviewed" | "promoted" | "archived";

export type DealStatus =
  | "new_inquiry"
  | "contacted"
  | "call_booked"
  | "proposal_sent"
  | "won"
  | "lost";

export type BookingStatus = "scheduled" | "completed" | "cancelled";

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          created_at: string;
          status: InquiryStatus;
          business_type: string | null;
          goal: string | null;
          name: string;
          business: string | null;
          handle: string | null;
          email: string;
          phone: string | null;
          message: string | null;
          source: string;
          raw_payload: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          status?: InquiryStatus;
          business_type?: string | null;
          goal?: string | null;
          name: string;
          business?: string | null;
          handle?: string | null;
          email: string;
          phone?: string | null;
          message?: string | null;
          source?: string;
          raw_payload?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          status?: InquiryStatus;
          business_type?: string | null;
          goal?: string | null;
          name?: string;
          business?: string | null;
          handle?: string | null;
          email?: string;
          phone?: string | null;
          message?: string | null;
          source?: string;
          raw_payload?: Json;
        };
        Relationships: [];
      };
      contacts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          inquiry_id: string | null;
          name: string;
          business: string | null;
          email: string;
          phone: string | null;
          handle: string | null;
          business_type: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          inquiry_id?: string | null;
          name: string;
          business?: string | null;
          email: string;
          phone?: string | null;
          handle?: string | null;
          business_type?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          inquiry_id?: string | null;
          name?: string;
          business?: string | null;
          email?: string;
          phone?: string | null;
          handle?: string | null;
          business_type?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      deals: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          contact_id: string | null;
          inquiry_id: string | null;
          title: string;
          status: DealStatus;
          value: number | null;
          next_follow_up: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          contact_id?: string | null;
          inquiry_id?: string | null;
          title: string;
          status?: DealStatus;
          value?: number | null;
          next_follow_up?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          contact_id?: string | null;
          inquiry_id?: string | null;
          title?: string;
          status?: DealStatus;
          value?: number | null;
          next_follow_up?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          deal_id: string | null;
          contact_id: string | null;
          title: string;
          starts_at: string;
          ends_at: string | null;
          status: BookingStatus;
          location: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deal_id?: string | null;
          contact_id?: string | null;
          title: string;
          starts_at: string;
          ends_at?: string | null;
          status?: BookingStatus;
          location?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deal_id?: string | null;
          contact_id?: string | null;
          title?: string;
          starts_at?: string;
          ends_at?: string | null;
          status?: BookingStatus;
          location?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      inquiry_status: InquiryStatus;
      deal_status: DealStatus;
      booking_status: BookingStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
