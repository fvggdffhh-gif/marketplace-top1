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
      profiles: {
        Row: {
          id: string
          name: string
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          original_price: number | null
          category: string
          image: string | null
          rating: number | null
          reviews_count: number | null
          in_stock: boolean | null
          australian_made: boolean | null
          created_at: string
        }
        Insert: {
          id?: never
          name: string
          description?: string | null
          price: number
          original_price?: number | null
          category: string
          image?: string | null
          rating?: number | null
          reviews_count?: number | null
          in_stock?: boolean | null
          australian_made?: boolean | null
          created_at?: string
        }
        Update: {
          id?: never
          name?: string
          description?: string | null
          price?: number
          original_price?: number | null
          category?: string
          image?: string | null
          rating?: number | null
          reviews_count?: number | null
          in_stock?: boolean | null
          australian_made?: boolean | null
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: number
          user_id: string
          product_id: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: never
          user_id: string
          product_id: number
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: never
          user_id?: string
          product_id?: number
          quantity?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          user_id: string
          status: string
          total: number
          shipping_address: string | null
          created_at: string
        }
        Insert: {
          id?: never
          user_id: string
          status?: string
          total: number
          shipping_address?: string | null
          created_at?: string
        }
        Update: {
          id?: never
          user_id?: string
          status?: string
          total?: number
          shipping_address?: string | null
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          product_id: number
          quantity: number
          price: number
        }
        Insert: {
          id?: never
          order_id: number
          product_id: number
          quantity: number
          price: number
        }
        Update: {
          id?: never
          order_id?: number
          product_id?: number
          quantity?: number
          price?: number
        }
      }
      discounts: {
        Row: {
          id: number
          code: string
          percentage: number
          valid_from: string | null
          valid_until: string | null
          active: boolean | null
          created_at: string
        }
        Insert: {
          id?: never
          code: string
          percentage: number
          valid_from?: string | null
          valid_until?: string | null
          active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: never
          code?: string
          percentage?: number
          valid_from?: string | null
          valid_until?: string | null
          active?: boolean | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: number
          product_id: number
          user_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: never
          product_id: number
          user_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: never
          product_id?: number
          user_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
