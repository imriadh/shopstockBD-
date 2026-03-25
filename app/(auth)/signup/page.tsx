'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { signUp } = useAuth()
  const { t, language, setLanguage } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password)
      // Redirect to onboarding after successful signup
      router.push('/onboarding')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-dim to-surface-bright px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">storefront</span>
            </div>
            <p className="font-headline text-lg font-extrabold text-on-background">
              ShopStock <span className="text-primary">BD</span>
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-auto rounded-full px-3 text-xs"
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
          >
            {t.language.toggle}
          </Button>
        </div>

        <Card className="backdrop-blur">
          <CardHeader>
            <CardTitle>{t.auth.createAccount}</CardTitle>
            <CardDescription>Use email and password to create your account.</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="mb-4 rounded-xl border border-tertiary/30 bg-tertiary/10 px-3 py-2 text-sm text-tertiary">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@shopname.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.auth.password}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.auth.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="mt-2">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t.auth.signupButton}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-on-surface-variant">
              {t.auth.haveAccount}{' '}
              <Link href="/login" className="font-semibold text-primary">
                {t.auth.login}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
