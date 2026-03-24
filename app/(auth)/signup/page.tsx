'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { LoaderCircle, Eye, EyeOff, Mail, Lock, ArrowForward } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-dim to-surface-bright flex flex-col">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white">storefront</span>
          </div>
          <span className="font-headline font-extrabold text-xl tracking-tight text-on-background">
            ShopStock <span className="text-primary">BD</span>
          </span>
        </div>
        <button
          onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/20 hover:bg-surface-container-low transition-all text-sm font-medium"
        >
          <span className="material-symbols-outlined text-lg">language</span>
          <span className="text-on-surface">{t.language.toggle}</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 mt-16">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding (Desktop only) */}
          <div className="hidden lg:flex flex-col gap-8 pr-12">
            <div>
              <h1 className="font-headline font-extrabold text-5xl text-on-background leading-tight mb-4">
                আজই শুরু করুন
              </h1>
              <p className="text-on-surface-variant text-lg max-w-md font-body leading-relaxed">
                হাজারো দোকানদার ইতিমধ্যে ShopStockBD ব্যবহার করে তাদের ব্যবসা বৃদ্ধি করছেন।
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-background">প্রথম মাস সম্পূর্ণ বিনামূল্যে</h3>
                  <p className="text-xs text-on-surface-variant">সীমাবদ্ধতা ছাড়াই সব ফিচার ব্যবহার করুন।</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-background">বাংলায় সম্পূর্ণ সহায়তা</h3>
                  <p className="text-xs text-on-surface-variant">আপনার পছন্দের ভাষায় ব্যবহার করুন।</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-background">মোবাইল-ফার্স্ট ডিজাইন</h3>
                  <p className="text-xs text-on-surface-variant">যেকোনো জায়গা থেকে পরিচালনা করুন।</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Signup Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl border border-white/20">
              <div className="mb-8">
                <h2 className="font-headline font-extrabold text-3xl text-on-background mb-2">
                  {t.auth.createAccount}
                </h2>
                <p className="text-on-surface-variant font-body text-sm">আপনার নতুন ব্যবসায়িক যাত্রা শুরু করুন এখনই।</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-tertiary/10 border border-tertiary/20 rounded-lg text-tertiary text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold font-label tracking-wider text-on-surface-variant uppercase ml-1">
                    {t.auth.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@shopname.com"
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface font-body"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold font-label tracking-wider text-on-surface-variant uppercase ml-1">
                    {t.auth.password}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface font-body"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold font-label tracking-wider text-on-surface-variant uppercase ml-1">
                    {t.auth.confirmPassword}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface font-body"
                      required
                    />
                  </div>
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
                >
                  {loading ? <LoaderCircle className="animate-spin w-5 h-5" /> : <ArrowForward className="w-5 h-5" />}
                  <span>{t.auth.signupButton}</span>
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center text-sm text-on-surface-variant">
                {t.auth.haveAccount}{' '}
                <Link href="/login" className="font-semibold text-primary hover:text-primary-container transition-colors">
                  {t.auth.login}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
