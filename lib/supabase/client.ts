import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for browser usage (Client Components)
 * 
 * Features:
 * - Persists session in localStorage
 * - Auto-refreshes auth tokens via cookies
 * - Type-safe database queries (when types are generated)
 * 
 * @example
 * ```tsx
 * 'use client'
 * const supabase = createClient()
 * const { data } = await supabase.from('products').select()
 * ```
 */
export const createClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
    )
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        flowType: 'pkce', // Recommended for browser apps
        persistSession: true, // Keep user logged in across page reloads
        detectSessionInUrl: true, // For OAuth redirects
      },
    }
  )
}
