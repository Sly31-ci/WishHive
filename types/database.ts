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
          username: string;
          avatar_url: string | null;
          bio: string | null;
          points: number;
          level: number;
          settings: Json;
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
          settings?: Json;
        };
        Update: {
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          settings?: Json;
        };
      };
      sellers: {
        Row: {
          id: string;
          user_id: string;
          shop_name: string;
          logo_url: string | null;
          description: string | null;
          kyc_status: 'pending' | 'approved' | 'rejected';
          payout_info: Json;
          settings: Json;
          is_active: boolean;
          created_at: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string | null;
          type: 'birthday' | 'wedding' | 'christmas' | 'baby' | 'general' | 'custom';
          privacy: 'public' | 'private' | 'code_only';
          access_code: string | null;
          theme: Json;
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
          type?: 'birthday' | 'wedding' | 'christmas' | 'baby' | 'general' | 'custom';
          privacy?: 'public' | 'private' | 'code_only';
          access_code?: string | null;
          theme?: Json;
          due_date?: string | null;
          is_active?: boolean;
          view_count?: number;
        };
        Update: {
          title?: string;
          description?: string | null;
          type?: 'birthday' | 'wedding' | 'christmas' | 'baby' | 'general' | 'custom';
          privacy?: 'public' | 'private' | 'code_only';
          access_code?: string | null;
          theme?: Json;
          due_date?: string | null;
          is_active?: boolean;
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
          images: Json;
          sku: string | null;
          variations: Json;
          external_url: string | null;
          stock_count: number;
          is_active: boolean;
          created_at: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          wishlist_id: string;
          product_id: string | null;
          custom_title: string | null;
          custom_price: number | null;
          custom_url: string | null;
          custom_images: Json;
          note: string | null;
          priority: number;
          quantity: number;
          is_purchased: boolean;
          purchased_by: string | null;
          purchased_at: string | null;
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string | null;
          wishlist_item_id: string | null;
          seller_id: string | null;
          product_id: string | null;
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          total_amount: number;
          currency: string;
          delivery_option: 'to_recipient' | 'to_buyer';
          delivery_address: Json | null;
          is_anonymous: boolean;
          payment_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      badges: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon_url: string | null;
          criteria: Json;
          points_reward: number;
          tier: 'bronze' | 'silver' | 'gold' | 'platinum';
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
      };
      reactions: {
        Row: {
          id: string;
          user_id: string | null;
          target_type: 'wishlist' | 'product' | 'item';
          target_id: string;
          reaction_type: 'heart' | 'fire' | 'celebrate' | 'shush';
          is_anonymous: boolean;
          created_at: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          following_type: 'user' | 'seller';
          created_at: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'earn' | 'spend' | 'refund';
          amount: number;
          source: string;
          reference_id: string | null;
          description: string | null;
          created_at: string;
        };
      };
    };
  };
}
