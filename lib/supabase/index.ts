/**
 * Supabase Utilities - Main Export
 * 
 * Import commonly used functions from here:
 * 
 * @example
 * ```tsx
 * import { createClient, loginClient, signUpClient } from '@/lib/supabase'
 * ```
 */

// Client creation
export { createClient } from './client'
export { createClient as createServerClient, getCurrentUser, getSession } from './server'

// Authentication
export {
  signUpClient,
  loginClient,
  logoutClient,
  signUpServer,
  loginServer,
  createUserProfile,
  updateUserProfile,
  getUserProfile,
  type AuthCredentials,
  type SignUpData,
} from './auth'

// Database queries
export {
  getUserProducts,
  getProductsByCategory,
  getLowStockProducts,
  searchProducts,
  getProductById,
  getUserTransactions,
  getTransactionWithItems,
  getSalesStats,
  getTodaysSales,
  getCategories,
} from './queries'

// Middleware utilities
export { updateSession } from './middleware'
