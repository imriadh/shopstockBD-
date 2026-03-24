/**
 * Authentication Helper Functions
 * 
 * Provides utilities for signup, login, logout, and session management.
 * These functions work in both Client Components and Server Components.
 */

import { createClient as createBrowserClient } from './client'
import { createClient as createServerClient } from './server'

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignUpData extends AuthCredentials {
  shopName: string
}

/**
 * BROWSER: Sign up with email and password
 * Creates new auth user and profile
 */
export async function signUpClient(data: SignUpData) {
  const supabase = createBrowserClient()
  
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          shop_name: data.shopName,
        },
      },
    })

    if (authError) throw authError

    return {
      user: authData.user,
      session: authData.session,
      success: true,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Signup failed',
      success: false,
    }
  }
}

/**
 * BROWSER: Login with email and password
 */
export async function loginClient(credentials: AuthCredentials) {
  const supabase = createBrowserClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error

    return {
      user: data.user,
      session: data.session,
      success: true,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Login failed',
      success: false,
    }
  }
}

/**
 * BROWSER: Logout current user
 */
export async function logoutClient() {
  const supabase = createBrowserClient()

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Logout failed',
      success: false,
    }
  }
}

/**
 * SERVER: Sign up with email and password
 * Use in Server Actions or Route Handlers
 */
export async function signUpServer(data: SignUpData) {
  const supabase = await createServerClient()

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          shop_name: data.shopName,
        },
      },
    })

    if (authError) throw authError

    return {
      user: authData.user,
      session: authData.session,
      success: true,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Signup failed',
      success: false,
    }
  }
}

/**
 * SERVER: Login with email and password
 * Use in Server Actions or Route Handlers
 */
export async function loginServer(credentials: AuthCredentials) {
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error

    return {
      user: data.user,
      session: data.session,
      success: true,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Login failed',
      success: false,
    }
  }
}

/**
 * SERVER: Create user's profile after signup
 * Call this in a Route Handler after auth user is created
 */
export async function createUserProfile(
  userId: string,
  shopName: string,
  phone: string,
  address: string
) {
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        shop_name: shopName,
        phone,
        shop_address: address,
        tier: 'free',
      })
      .select()
      .single()

    if (error) throw error

    return { profile: data, success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Profile creation failed',
      success: false,
    }
  }
}

/**
 * Update user's profile information
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    shop_name: string
    shop_address: string
    phone: string
    vat_number: string
    logo_url: string
  }>
) {
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return { profile: data, success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Profile update failed',
      success: false,
    }
  }
}

/**
 * Get user's profile
 */
export async function getUserProfile(userId: string) {
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', userId)
      .single()

    if (error) throw error

    return { profile: data, success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to fetch profile',
      success: false,
    }
  }
}
