'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { AuthUser, Profile } from '@/types'

interface AuthContextType {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (profile: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const initializingRef = useRef(false)

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }

      console.log('Profile fetched:', profileData)
      setProfile((profileData as Profile | null) ?? null)
      return profileData
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      setProfile(null)
      return null
    }
  }

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initializingRef.current) return
    initializingRef.current = true

    const getSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user as AuthUser | null)

        if (user) {
          await fetchProfile(user.id)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = (session?.user as AuthUser | null) ?? null
      setUser(nextUser)

      if (nextUser) {
        try {
          await fetchProfile(nextUser.id)
        } catch (error) {
          console.error('Error fetching profile after auth change:', error)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
      initializingRef.current = false
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error

    if (data.user) {
      setUser(data.user as AuthUser)
      // Try to fetch profile, but don't fail if it doesn't exist yet
      try {
        await fetchProfile(data.user.id)
      } catch (err) {
        // Profile doesn't exist yet - this is expected for new signups
        console.log('No profile yet - will be created during onboarding')
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    
    setUser(data.user as AuthUser)
    
    // Fetch profile before redirecting to ensure it's loaded
    if (data.user) {
      await fetchProfile(data.user.id)
    }
    
    router.push('/dashboard')
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    setUser(null)
    setProfile(null)
    router.push('/login')
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      console.error('No user found for profile update')
      throw new Error('No user logged in')
    }

    console.log('Updating profile for user:', user.id)
    console.log('Profile updates:', updates)

    try {
      // Direct insert/upsert approach - simpler and more reliable
      console.log('Attempting upsert...')
      
      const profileData = {
        user_id: user.id,
        shop_name: updates.shop_name || '',
        shop_address: updates.shop_address || '',
        phone: updates.phone || '',
        vat_number: updates.vat_number || null,
        logo_url: updates.logo_url || null,
        tier: updates.tier || 'free',
        updated_at: new Date().toISOString(),
      }

      console.log('Profile data to upsert:', profileData)

      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single()

      console.log('Upsert result:', { data, error })

      if (error) {
        console.error('Profile upsert failed:', error)
        throw new Error(`Database error: ${error.message}`)
      }
      
      if (!data) {
        throw new Error('No data returned from profile creation')
      }
      
      console.log('Profile saved successfully:', data)
      setProfile(data as Profile)
      
      // Ensure the profile is fully set before returning
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return data
    } catch (error) {
      console.error('Caught error in updateProfile:', error)
      
      // Provide user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('relation "public.profiles" does not exist')) {
          throw new Error('Database not set up. Please contact support.')
        } else if (error.message.includes('new row violates row-level security')) {
          throw new Error('Permission denied. Please try logging out and back in.')
        }
      }
      
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
