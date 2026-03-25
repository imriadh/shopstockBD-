import { createBrowserClient } from '@supabase/ssr/dist/module'
import type { Database } from '@/types/supabase'

// Singleton client instance to prevent lock conflicts
let client: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Creates a Supabase client for browser usage (Client Components)
 * 
 * Features:
 * - Persists session in localStorage
 * - Auto-refreshes auth tokens via cookies
 * - Type-safe database queries (when types are generated)
 * - Singleton pattern to prevent auth lock conflicts
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

  // Return existing client if already created (singleton pattern)
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        flowType: 'pkce', // Recommended for browser apps
        persistSession: true, // Keep user logged in across page reloads
        detectSessionInUrl: true, // For OAuth redirects
        autoRefreshToken: true,
      },
    }
  )

  return client
}
