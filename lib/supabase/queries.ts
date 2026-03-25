/**
 * Common Database Queries
 * 
 * Helper functions for fetching data from Supabase with proper error handling.
 * These are designed to be used with TanStack Query (React Query).
 */

import { createClient } from './server'

/**
 * Get all products for a user
 */
export async function getUserProducts(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get products filtered by category
 */
export async function getProductsByCategory(userId: string, category: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get low stock products
 */
export async function getLowStockProducts(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('stock_quantity', { ascending: true })

  if (error) throw error

  type StockRow = { stock_quantity: number; low_stock_threshold: number }
  const rows = (data ?? []) as StockRow[]
  return rows.filter((row) => row.stock_quantity < row.low_stock_threshold)
}

/**
 * Search products by name or SKU
 */
export async function searchProducts(userId: string, query: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,sku.ilike.%${query}%`)
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get product by ID with validation
 */
export async function getProductById(userId: string, productId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

/**
 * Get all transactions for a user
 */
export async function getUserTransactions(userId: string, limit = 50) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Get transaction with items
 */
export async function getTransactionWithItems(transactionId: string) {
  const supabase = await createClient()

  const { data: transaction, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single()

  if (txError) throw txError
  if (!transaction) throw new Error('Transaction not found')

  const { data: items, error: itemsError } = await supabase
    .from('transaction_items')
    .select('*')
    .eq('transaction_id', transactionId)

  if (itemsError) throw itemsError

  return { transaction, items }
}

/**
 * Get sales data for dashboard (last 30 days)
 */
export async function getSalesStats(userId: string) {
  const supabase = await createClient()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data, error } = await supabase
    .from('transactions')
    .select('total_amount, vat_amount, created_at')
    .eq('user_id', userId)
    .eq('payment_status', 'completed')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get today's sales
 */
export async function getTodaysSales(userId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('transactions')
    .select('total_amount, vat_amount')
    .eq('user_id', userId)
    .eq('payment_status', 'completed')
    .gte('created_at', `${today}T00:00:00`)
    .lt('created_at', `${today}T23:59:59`)

  if (error) throw error

  type SalesAccumulator = { count: number; total: number; vat: number }
  type SalesRow = { total_amount: number; vat_amount: number }
  const rows = (data ?? []) as SalesRow[]

  return rows.reduce<SalesAccumulator>(
    (acc, tx) => ({
      count: acc.count + 1,
      total: acc.total + tx.total_amount,
      vat: acc.vat + tx.vat_amount,
    }),
    { count: 0, total: 0, vat: 0 }
  )
}

/**
 * Get categories list
 */
export async function getCategories(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('user_id', userId)
    .eq('is_active', true)
    .not('category', 'is', null)

  if (error) throw error
  type CategoryRow = { category: string | null }
  const rows = (data ?? []) as CategoryRow[]
  const categories = rows
    .map((row) => row.category)
    .filter((category): category is string => Boolean(category))
  return Array.from(new Set(categories))
}
