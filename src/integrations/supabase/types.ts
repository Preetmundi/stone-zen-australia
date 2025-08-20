export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      business_profiles: {
        Row: {
          abn: string | null
          address: string | null
          business_hours: string | null
          city: string | null
          company_name: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          gst_rate: number | null
          id: string
          labor_rate: number | null
          logo: string | null
          markup: number | null
          phone: string | null
          postcode: string | null
          service_areas: string[] | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          abn?: string | null
          address?: string | null
          business_hours?: string | null
          city?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          gst_rate?: number | null
          id?: string
          labor_rate?: number | null
          logo?: string | null
          markup?: number | null
          phone?: string | null
          postcode?: string | null
          service_areas?: string[] | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          abn?: string | null
          address?: string | null
          business_hours?: string | null
          city?: string | null
          company_name?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          gst_rate?: number | null
          id?: string
          labor_rate?: number | null
          logo?: string | null
          markup?: number | null
          phone?: string | null
          postcode?: string | null
          service_areas?: string[] | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          customer_type: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          postcode: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          customer_type?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          customer_type?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          availability: string | null
          category: string | null
          created_at: string
          description: string | null
          finish: string | null
          id: string
          image_url: string | null
          lead_time: number | null
          name: string
          sell_price: number | null
          supplier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          finish?: string | null
          id?: string
          image_url?: string | null
          lead_time?: number | null
          name: string
          sell_price?: number | null
          supplier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          finish?: string | null
          id?: string
          image_url?: string | null
          lead_time?: number | null
          name?: string
          sell_price?: number | null
          supplier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          address: string | null
          created_at: string
          customer_id: string | null
          expected_delivery: string | null
          id: string
          notes: string | null
          project_name: string
          project_type: string | null
          status: string | null
          total_cost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          customer_id?: string | null
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          project_name: string
          project_type?: string | null
          status?: string | null
          total_cost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          customer_id?: string | null
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          project_name?: string
          project_type?: string | null
          status?: string | null
          total_cost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          category: string | null
          created_at: string
          description: string
          id: string
          material_id: string | null
          quantity: number
          quote_id: string
          total_price: number
          unit: string | null
          unit_price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          id?: string
          material_id?: string | null
          quantity: number
          quote_id: string
          total_price: number
          unit?: string | null
          unit_price: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          material_id?: string | null
          quantity?: number
          quote_id?: string
          total_price?: number
          unit?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string
          gst: number | null
          id: string
          notes: string | null
          project_id: string | null
          quote_number: string
          status: string | null
          subtotal: number | null
          terms: string | null
          total: number | null
          updated_at: string
          user_id: string
          valid_until: string | null
          version: number | null
        }
        Insert: {
          created_at?: string
          gst?: number | null
          id?: string
          notes?: string | null
          project_id?: string | null
          quote_number: string
          status?: string | null
          subtotal?: number | null
          terms?: string | null
          total?: number | null
          updated_at?: string
          user_id: string
          valid_until?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string
          gst?: number | null
          id?: string
          notes?: string | null
          project_id?: string | null
          quote_number?: string
          status?: string | null
          subtotal?: number | null
          terms?: string | null
          total?: number | null
          updated_at?: string
          user_id?: string
          valid_until?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
