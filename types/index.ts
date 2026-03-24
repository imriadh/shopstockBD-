// Database Types - Matches Supabase schema
export interface Profile {
  id: string
  user_id: string
  shop_name: string
  shop_address: string
  phone: string
  vat_number?: string
  logo_url?: string
  tier: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  user_id: string
  name: string
  name_bn?: string
  sku: string
  barcode?: string
  description?: string
  category: string
  image_url?: string
  price: number
  cost_price: number
  stock_quantity: number
  low_stock_threshold: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  invoice_number: string
  customer_name?: string
  customer_phone?: string
  transaction_type: 'sale' | 'return' | 'adjustment'
  subtotal: number
  vat_amount: number
  total_amount: number
  payment_method: 'cash' | 'bkash' | 'nagad' | 'other'
  payment_status: 'pending' | 'completed'
  notes?: string
  created_at: string
  updated_at: string
}

export interface TransactionItem {
  id: string
  transaction_id: string
  product_id: string
  quantity: number
  unit_price: number
  line_total: number
  created_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  description?: string
  icon?: string
  created_at: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
  created_at: string
}
