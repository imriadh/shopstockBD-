'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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
  const [supabase] = useState(() => createClient())

  const fetchProfile = async (userId: string) => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      throw error
    }

    setProfile((profileData as Profile | null) ?? null)
  }

  useEffect(() => {
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
    }
  }, [supabase])

  const signUp = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error

    if (data.user) {
      setUser(data.user as AuthUser)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    
    setUser(data.user as AuthUser)
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
    if (!user) throw new Error('No user')

    const { error, data } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) throw error
    setProfile(data as Profile)
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
