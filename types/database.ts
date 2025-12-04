export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          points: number;
          level: number;
          settings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          points?: number;
          level?: number;
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          points?: number;
          level?: number;
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      wishlists: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string | null;
          type: string;
          privacy: 'public' | 'private' | 'code_only';
          access_code: string | null;
          theme: any;
          due_date: string | null;
          is_active: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description?: string | null;
          type?: string;
          privacy?: 'public' | 'private' | 'code_only';
          access_code?: string | null;
          theme?: any;
          due_date?: string | null;
          is_active?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          description?: string | null;
          type?: string;
          privacy?: 'public' | 'private' | 'code_only';
          access_code?: string | null;
          theme?: any;
          due_date?: string | null;
          is_active?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlists_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          title: string;
          description: string | null;
          price: number;
          currency: string;
          images: any;
          sku: string | null;
          variations: any;
          external_url: string | null;
          stock_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          title: string;
          description?: string | null;
          price: number;
          currency?: string;
          images?: any;
          sku?: string | null;
          variations?: any;
          external_url?: string | null;
          stock_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          currency?: string;
          images?: any;
          sku?: string | null;
          variations?: any;
          external_url?: string | null;
          stock_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "sellers";
            referencedColumns: ["id"];
          }
        ];
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          tier: 'bronze' | 'silver' | 'gold' | 'platinum';
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          tier: 'bronze' | 'silver' | 'gold' | 'platinum';
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
          icon?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          earned_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_badges_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badges";
            referencedColumns: ["id"];
          }
        ];
      };
      sellers: {
        Row: {
          id: string;
          user_id: string;
          shop_name: string;
          description: string | null;
          logo_url: string | null;
          kyc_status: 'pending' | 'approved' | 'rejected';
          payout_info: any;
          settings: any;
          is_active: boolean;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shop_name: string;
          description?: string | null;
          logo_url?: string | null;
          kyc_status?: 'pending' | 'approved' | 'rejected';
          payout_info?: any;
          settings?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          shop_name?: string;
          description?: string | null;
          logo_url?: string | null;
          kyc_status?: 'pending' | 'approved' | 'rejected';
          payout_info?: any;
          settings?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sellers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      wishlist_items: {
        Row: {
          id: string;
          wishlist_id: string;
          product_id: string | null;
          custom_title: string | null;
          custom_price: number | null;
          custom_url: string | null;
          custom_images: any;
          note: string | null;
          priority: number;
          quantity: number;
          is_purchased: boolean;
          purchased_by: string | null;
          purchased_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          wishlist_id: string;
          product_id?: string | null;
          custom_title?: string | null;
          custom_price?: number | null;
          custom_url?: string | null;
          custom_images?: any;
          note?: string | null;
          priority?: number;
          quantity?: number;
          is_purchased?: boolean;
          purchased_by?: string | null;
          purchased_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          wishlist_id?: string;
          product_id?: string | null;
          custom_title?: string | null;
          custom_price?: number | null;
          custom_url?: string | null;
          custom_images?: any;
          note?: string | null;
          priority?: number;
          quantity?: number;
          is_purchased?: boolean;
          purchased_by?: string | null;
          purchased_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey";
            columns: ["wishlist_id"];
            isOneToOne: false;
            referencedRelation: "wishlists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      // Add more table types as needed
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_points: {
        Args: {
          user_id: string;
          points_to_add: number;
        };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
