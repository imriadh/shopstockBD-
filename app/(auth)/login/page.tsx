'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { LoaderCircle, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const { t, language, setLanguage } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
            <CardTitle>{t.auth.welcomeBack}</CardTitle>
            <CardDescription>{t.auth.signInToManage}</CardDescription>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t.auth.password}</Label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-primary">
                    {t.auth.forgotPassword}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
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

              <div className="flex items-center gap-2">
                <input id="remember" type="checkbox" className="h-4 w-4 rounded border-outline-variant" />
                <Label htmlFor="remember" className="text-xs font-medium text-on-surface-variant">
                  {t.auth.keepSignedIn}
                </Label>
              </div>

              <Button type="submit" disabled={loading} className="mt-2">
                {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t.auth.loginButton}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-on-surface-variant">
              {t.auth.noAccount}{' '}
              <Link href="/signup" className="font-semibold text-primary">
                {t.auth.createAccount}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
