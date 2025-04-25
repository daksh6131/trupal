export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          id: number
          action: string
          agent_phone: string
          agent_name: string
          customer_id?: string
          customer_name?: string
          shared_cards?: string[]
          details?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          action: string
          agent_phone: string
          agent_name: string
          customer_id?: string
          customer_name?: string
          shared_cards?: string[]
          details?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          action?: string
          agent_phone?: string
          agent_name?: string
          customer_id?: string
          customer_name?: string
          shared_cards?: string[]
          details?: string
          created_at?: string
          updated_at?: string
        }
      }
      admin_phones: {
        Row: {
          id: number
          phone: string
          added_by?: string
          created_at: string
        }
        Insert: {
          id?: number
          phone: string
          added_by?: string
          created_at?: string
        }
        Update: {
          id?: number
          phone?: string
          added_by?: string
          created_at?: string
        }
      }
      admins: {
        Row: {
          id: number
          email: string
          password: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          email: string
          password: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          email?: string
          password?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: number
          name: string
          phone: string
          password: string
          status: string
          last_login: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          phone: string
          password: string
          status?: string
          last_login?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          phone?: string
          password?: string
          status?: string
          last_login?: string
          created_at?: string
          updated_at?: string
        }
      }
      credit_cards: {
        Row: {
          id: number
          name: string
          min_cibil_score: number
          annual_fee: number
          utm_link: string
          benefits: string[]
          tags: string[]
          status: string
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          min_cibil_score: number
          annual_fee: number
          utm_link: string
          benefits: string[]
          tags: string[]
          status?: string
          image_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          min_cibil_score?: number
          annual_fee?: number
          utm_link?: string
          benefits?: string[]
          tags?: string[]
          status?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: number
          name: string
          phone: string
          email: string
          dob: string
          pan: string
          salary: number
          pin: string
          address: string
          cibil_score?: number
          linked_agent: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          phone: string
          email: string
          dob: string
          pan: string
          salary: number
          pin: string
          address: string
          cibil_score?: number
          linked_agent: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          phone?: string
          email?: string
          dob?: string
          pan?: string
          salary?: number
          pin?: string
          address?: string
          cibil_score?: number
          linked_agent?: string
          created_at?: string
          updated_at?: string
        }
      }
      error_logs: {
        Row: {
          id: number
          message: string
          stack?: string
          type?: string
          url?: string
          user_agent?: string
          user_id?: string
          user_role?: string
          metadata?: Json
          severity: string
          status: string
          resolved_at?: string
          resolved_by?: string
          created_at: string
        }
        Insert: {
          id?: number
          message: string
          stack?: string
          type?: string
          url?: string
          user_agent?: string
          user_id?: string
          user_role?: string
          metadata?: Json
          severity?: string
          status?: string
          resolved_at?: string
          resolved_by?: string
          created_at?: string
        }
        Update: {
          id?: number
          message?: string
          stack?: string
          type?: string
          url?: string
          user_agent?: string
          user_id?: string
          user_role?: string
          metadata?: Json
          severity?: string
          status?: string
          resolved_at?: string
          resolved_by?: string
          created_at?: string
        }
      }
      otps: {
        Row: {
          id: number
          phone: string
          code: string
          expires_at: string
          verified: boolean
          attempts: number
          created_at: string
        }
        Insert: {
          id?: number
          phone: string
          code: string
          expires_at: string
          verified?: boolean
          attempts?: number
          created_at?: string
        }
        Update: {
          id?: number
          phone?: string
          code?: string
          expires_at?: string
          verified?: boolean
          attempts?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
