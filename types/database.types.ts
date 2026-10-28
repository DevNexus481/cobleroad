export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          line1: string
          line2: string | null
          phone: string | null
          postal_code: string
          state: string
          user_id: string | null
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean
          line1: string
          line2?: string | null
          phone?: string | null
          postal_code: string
          state: string
          user_id?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          line1?: string
          line2?: string | null
          phone?: string | null
          postal_code?: string
          state?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          details: Json | null
          id: string
          resource: string
          resource_id: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          resource: string
          resource_id?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          resource?: string
          resource_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          currency_snapshot: string
          id: string
          personalisation: Json | null
          price_minor_snapshot: number
          product_id: string
          quantity: number
          updated_at: string
          variant_id: string
        }
        Insert: {
          cart_id: string
          created_at?: string
          currency_snapshot: string
          id?: string
          personalisation?: Json | null
          price_minor_snapshot: number
          product_id: string
          quantity?: number
          updated_at?: string
          variant_id: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          currency_snapshot?: string
          id?: string
          personalisation?: Json | null
          price_minor_snapshot?: number
          product_id?: string
          quantity?: number
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "admin_product_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          currency: string
          id: string
          session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          consented_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          consented_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          consented_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          currency: string
          id: string
          order_id: string
          personalisation: Json | null
          product_id: string | null
          product_name_snapshot: string
          quantity: number
          subtotal_minor: number
          unit_price_minor: number
          variant_colour_snapshot: string | null
          variant_id: string | null
          variant_sku_snapshot: string | null
        }
        Insert: {
          currency: string
          id?: string
          order_id: string
          personalisation?: Json | null
          product_id?: string | null
          product_name_snapshot: string
          quantity: number
          subtotal_minor: number
          unit_price_minor: number
          variant_colour_snapshot?: string | null
          variant_id?: string | null
          variant_sku_snapshot?: string | null
        }
        Update: {
          currency?: string
          id?: string
          order_id?: string
          personalisation?: Json | null
          product_id?: string | null
          product_name_snapshot?: string
          quantity?: number
          subtotal_minor?: number
          unit_price_minor?: number
          variant_colour_snapshot?: string | null
          variant_id?: string | null
          variant_sku_snapshot?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "admin_order_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "admin_product_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          discount_minor: number
          guest_email: string | null
          id: string
          notes: string | null
          order_number: string
          shipping_address: Json
          shipping_minor: number
          status: string
          subtotal_minor: number
          tax_minor: number
          total_minor: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency: string
          discount_minor?: number
          guest_email?: string | null
          id?: string
          notes?: string | null
          order_number: string
          shipping_address: Json
          shipping_minor?: number
          status?: string
          subtotal_minor?: number
          tax_minor?: number
          total_minor?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          discount_minor?: number
          guest_email?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          shipping_address?: Json
          shipping_minor?: number
          status?: string
          subtotal_minor?: number
          tax_minor?: number
          total_minor?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_minor: number
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          order_id: string
          razorpay_order_id: string
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_minor: number
          created_at?: string
          currency: string
          failure_reason?: string | null
          id?: string
          order_id: string
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_minor?: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          order_id?: string
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "admin_order_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_collections: {
        Row: {
          collection_id: string
          product_id: string
        }
        Insert: {
          collection_id: string
          product_id: string
        }
        Update: {
          collection_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "admin_product_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string
          id: string
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "admin_product_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_prices: {
        Row: {
          amount_minor: number
          created_at: string
          currency: string
          id: string
          product_id: string
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          amount_minor: number
          created_at?: string
          currency: string
          id?: string
          product_id: string
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          amount_minor?: number
          created_at?: string
          currency?: string
          id?: string
          product_id?: string
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "admin_product_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_prices_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          allow_backorder: boolean
          colour: string | null
          created_at: string
          id: string
          product_id: string
          size: string | null
          sku: string | null
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          allow_backorder?: boolean
          colour?: string | null
          created_at?: string
          id?: string
          product_id: string
          size?: string | null
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          allow_backorder?: boolean
          colour?: string | null
          created_at?: string
          id?: string
          product_id?: string
          size?: string | null
          sku?: string | null
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "admin_product_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          care_instructions: string | null
          created_at: string
          description: string | null
          dimensions_cm: string | null
          id: string
          is_demo: boolean
          is_featured: boolean
          material_description: string | null
          name: string
          personalisation: Json | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          status: string
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          care_instructions?: string | null
          created_at?: string
          description?: string | null
          dimensions_cm?: string | null
          id?: string
          is_demo?: boolean
          is_featured?: boolean
          material_description?: string | null
          name: string
          personalisation?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          status?: string
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          care_instructions?: string | null
          created_at?: string
          description?: string | null
          dimensions_cm?: string | null
          id?: string
          is_demo?: boolean
          is_featured?: boolean
          material_description?: string | null
          name?: string
          personalisation?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          status?: string
          updated_at?: string
          weight_grams?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          announcement_enabled: boolean
          announcement_text: string | null
          contact_email: string | null
          facebook_url: string | null
          id: string
          instagram_url: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          announcement_enabled?: boolean
          announcement_text?: string | null
          contact_email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          announcement_enabled?: boolean
          announcement_text?: string | null
          contact_email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          error: string | null
          event_id: string
          event_type: string
          id: string
          payload: Json | null
          processed: boolean
          processed_at: string | null
          provider: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_id: string
          event_type: string
          id?: string
          payload?: Json | null
          processed?: boolean
          processed_at?: string | null
          provider: string
        }
        Update: {
          created_at?: string
          error?: string | null
          event_id?: string
          event_type?: string
          id?: string
          payload?: Json | null
          processed?: boolean
          processed_at?: string | null
          provider?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_order_overview: {
        Row: {
          contact_email: string | null
          created_at: string | null
          currency: string | null
          customer_email: string | null
          customer_name: string | null
          guest_email: string | null
          id: string | null
          order_number: string | null
          status: string | null
          total_minor: number | null
        }
        Relationships: []
      }
      admin_product_overview: {
        Row: {
          created_at: string | null
          id: string | null
          is_demo: boolean | null
          is_featured: boolean | null
          min_price_inr: number | null
          name: string | null
          slug: string | null
          status: string | null
          total_stock: number | null
          variant_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      decrement_stock: {
        Args: { p_quantity: number; p_variant_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
