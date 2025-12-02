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
