/**
 * Supabase Database Types
 * 
 * This file defines the complete database schema structure for Supabase.
 * These types are used by the Supabase JS client for type-safe queries.
 */

import type { Profile, Product, Transaction } from './index'

/**
 * Root database schema that maps to Supabase tables
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'user_id' | 'created_at'>>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>
      }
      transaction_items: {
        Row: {
          id: string
          transaction_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: Omit<{
          id: string
          transaction_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }, 'id' | 'created_at'>
        Update: Partial<Omit<{
          id: string
          transaction_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }, 'id' | 'transaction_id' | 'product_id' | 'created_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
