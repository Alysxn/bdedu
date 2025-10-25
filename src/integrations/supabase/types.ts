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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: string
          created_at: string | null
          description: string
          icon: string
          id: string
          reward_coins: number | null
          reward_points: number | null
          target: number
          title: string
        }
        Insert: {
          achievement_type: string
          created_at?: string | null
          description: string
          icon: string
          id: string
          reward_coins?: number | null
          reward_points?: number | null
          target: number
          title: string
        }
        Update: {
          achievement_type?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          reward_coins?: number | null
          reward_points?: number | null
          target?: number
          title?: string
        }
        Relationships: []
      }
      aulas: {
        Row: {
          created_at: string | null
          description: string
          duration: string
          id: number
          title: string
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description: string
          duration: string
          id?: number
          title: string
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string
          duration?: string
          id?: number
          title?: string
          video_url?: string
        }
        Relationships: []
      }
      desafios: {
        Row: {
          aula_id: number | null
          coins: number | null
          created_at: string | null
          description: string
          hint: string | null
          id: number
          points: number | null
          scenario: string
          title: string
          validation_rules: Json
        }
        Insert: {
          aula_id?: number | null
          coins?: number | null
          created_at?: string | null
          description: string
          hint?: string | null
          id?: number
          points?: number | null
          scenario: string
          title: string
          validation_rules: Json
        }
        Update: {
          aula_id?: number | null
          coins?: number | null
          created_at?: string | null
          description?: string
          hint?: string | null
          id?: number
          points?: number | null
          scenario?: string
          title?: string
          validation_rules?: Json
        }
        Relationships: [
          {
            foreignKeyName: "desafios_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
        ]
      }
      exercicios: {
        Row: {
          aula_id: number | null
          coins: number | null
          created_at: string | null
          description: string
          hint: string | null
          id: number
          points: number | null
          skeleton: string | null
          title: string
          validation_rules: Json
        }
        Insert: {
          aula_id?: number | null
          coins?: number | null
          created_at?: string | null
          description: string
          hint?: string | null
          id?: number
          points?: number | null
          skeleton?: string | null
          title: string
          validation_rules: Json
        }
        Update: {
          aula_id?: number | null
          coins?: number | null
          created_at?: string | null
          description?: string
          hint?: string | null
          id?: number
          points?: number | null
          skeleton?: string | null
          title?: string
          validation_rules?: Json
        }
        Relationships: [
          {
            foreignKeyName: "exercicios_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
        ]
      }
      materiais: {
        Row: {
          aula_id: number | null
          category: string
          created_at: string | null
          description: string
          id: number
          pdf_url: string
          title: string
        }
        Insert: {
          aula_id?: number | null
          category: string
          created_at?: string | null
          description: string
          id?: number
          pdf_url: string
          title: string
        }
        Update: {
          aula_id?: number | null
          category?: string
          created_at?: string | null
          description?: string
          id?: number
          pdf_url?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "materiais_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_icon: string | null
          coins: number | null
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          points: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_icon?: string | null
          coins?: number | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id: string
          points?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_icon?: string | null
          coins?: number | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          points?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_materials: {
        Row: {
          id: string
          material_id: number
          saved_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          material_id: number
          saved_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          material_id?: number
          saved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_materials_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
        ]
      }
      store_items: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id: string
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          claimed: boolean | null
          claimed_at: string | null
          created_at: string | null
          current_progress: number | null
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          claimed?: boolean | null
          claimed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          claimed?: boolean | null
          claimed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          attempts: number | null
          completed: boolean | null
          completed_at: string | null
          content_id: number
          content_type: string
          created_at: string | null
          id: string
          progress_percentage: number | null
          user_id: string | null
        }
        Insert: {
          attempts?: number | null
          completed?: boolean | null
          completed_at?: string | null
          content_id: number
          content_type: string
          created_at?: string | null
          id?: string
          progress_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          attempts?: number | null
          completed?: boolean | null
          completed_at?: string | null
          content_id?: number
          content_type?: string
          created_at?: string | null
          id?: string
          progress_percentage?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_purchases: {
        Row: {
          id: string
          item_id: string | null
          purchased_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          item_id?: string | null
          purchased_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          item_id?: string | null
          purchased_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "store_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_completed_content: {
        Args: { _content_id: number; _content_type: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_previous_lesson_completed: {
        Args: { _lesson_id: number; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
