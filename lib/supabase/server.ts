import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for server usage (Server Components & Route Handlers)
 * 
 * Features:
 * - Works in App Router Server Components
 * - Manages auth session via cookies (SSR compatible)
 * - Supports RLS (Row Level Security)
 * - Does NOT persist to localStorage (server-side only)
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * const supabase = await createClient()
 * const { data } = await supabase.from('products').select()
 * ```
 */
export const createClient = async () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
    )
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Silently fail when called from Server Component during static rendering.
            // Middleware will handle session refresh on request.
            console.debug('Failed to set cookie in Server Component:', error)
          }
        },
      },
      auth: {
        persistSession: false, // Don't persist to localStorage on server
      },
    }
  )
}

/**
 * Gets current authenticated user (server-side)
 * 
 * @returns User object or null if not authenticated
 * @example
 * ```tsx
 * const user = await getCurrentUser()
 * if (!user) redirect('/login')
 * ```
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Gets current user's session (for token refresh, etc.)
 */
export async function getSession() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
