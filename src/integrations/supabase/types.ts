export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string | null
          department: string | null
          id: string
          is_super_admin: boolean | null
          permissions: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          id?: string
          is_super_admin?: boolean | null
          permissions?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          id?: string
          is_super_admin?: boolean | null
          permissions?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          address: Json | null
          awards: Json | null
          campaigns: Json | null
          certifications: Json | null
          created_at: string | null
          description: string | null
          email: string
          featured_products: Json | null
          founding_year: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          logo: string | null
          mission: string | null
          name: string
          new_launch_products: Json | null
          phone: string | null
          press_features: Json | null
          settings: Json | null
          social_links: Json | null
          tagline: string | null
          updated_at: string | null
          user_id: string | null
          video_url: string | null
          vision: string | null
        }
        Insert: {
          address?: Json | null
          awards?: Json | null
          campaigns?: Json | null
          certifications?: Json | null
          created_at?: string | null
          description?: string | null
          email: string
          featured_products?: Json | null
          founding_year?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo?: string | null
          mission?: string | null
          name: string
          new_launch_products?: Json | null
          phone?: string | null
          press_features?: Json | null
          settings?: Json | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          vision?: string | null
        }
        Update: {
          address?: Json | null
          awards?: Json | null
          campaigns?: Json | null
          certifications?: Json | null
          created_at?: string | null
          description?: string | null
          email?: string
          featured_products?: Json | null
          founding_year?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo?: string | null
          mission?: string | null
          name?: string
          new_launch_products?: Json | null
          phone?: string | null
          press_features?: Json | null
          settings?: Json | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          vision?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          created_at: string | null
          id: string
          preferences: Json | null
          saved_brands: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          saved_brands?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          saved_brands?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          brand_id: string | null
          created_at: string | null
          description: string | null
          folder: string | null
          id: string
          last_used: string | null
          metadata: Json | null
          mime_type: string
          name: string
          size: number
          tags: string[] | null
          thumbnail_url: string | null
          type: Database["public"]["Enums"]["file_type"]
          updated_at: string | null
          url: string
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          description?: string | null
          folder?: string | null
          id?: string
          last_used?: string | null
          metadata?: Json | null
          mime_type: string
          name: string
          size: number
          tags?: string[] | null
          thumbnail_url?: string | null
          type: Database["public"]["Enums"]["file_type"]
          updated_at?: string | null
          url: string
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          description?: string | null
          folder?: string | null
          id?: string
          last_used?: string | null
          metadata?: Json | null
          mime_type?: string
          name?: string
          size?: number
          tags?: string[] | null
          thumbnail_url?: string | null
          type?: Database["public"]["Enums"]["file_type"]
          updated_at?: string | null
          url?: string
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_pages: {
        Row: {
          background_color: string
          created_at: string
          font_family: string
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          background_color?: string
          created_at?: string
          font_family?: string
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          background_color?: string
          created_at?: string
          font_family?: string
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          created_at: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      page_components: {
        Row: {
          content: Json
          created_at: string
          id: string
          page_id: string
          position: number
          styles: Json
          type: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          page_id: string
          position: number
          styles?: Json
          type: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          page_id?: string
          position?: number
          styles?: Json
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_components_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      product_designs: {
        Row: {
          content: Json
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          landing_page_id: string | null
          title: string
          updated_at: string | null
          url: string
          user_id: string
          views: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          landing_page_id?: string | null
          title: string
          updated_at?: string | null
          url: string
          user_id: string
          views?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          landing_page_id?: string | null
          title?: string
          updated_at?: string | null
          url?: string
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          brand_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          images: string[] | null
          rating: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          brand_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          rating: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          brand_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          rating?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          age: number | null
          avatar: string | null
          created_at: string | null
          email: string
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          password: string
          phone: string | null
          role: Database["public"]["Enums"]["role_type"] | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          avatar?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          password: string
          phone?: string | null
          role?: Database["public"]["Enums"]["role_type"] | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          avatar?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          password?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["role_type"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_qr_view: {
        Args: { qr_id: string }
        Returns: undefined
      }
    }
    Enums: {
      file_type: "IMAGE" | "PDF" | "VIDEO"
      role_type: "ADMIN" | "BRAND" | "CUSTOMER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      file_type: ["IMAGE", "PDF", "VIDEO"],
      role_type: ["ADMIN", "BRAND", "CUSTOMER"],
    },
  },
} as const
