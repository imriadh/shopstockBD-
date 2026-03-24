'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { LoaderCircle, Eye, EyeOff, Mail, Lock, ArrowForward } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()
  const { t, language, setLanguage } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
                সহজে ইনভেন্টরি পরিচালনা করুন
              </h1>
              <p className="text-on-surface-variant text-lg max-w-md font-body leading-relaxed">
                ShopStockBD আপনার দোকানের স্টক এবং বিক্রয় পরিচালনা করা সহজ করে তোলে। সহজ, দ্রুত এবং নির্ভরযোগ্য।
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                <span className="material-symbols-outlined text-primary mb-3 block">security</span>
                <h3 className="font-headline font-bold text-on-background mb-1">Bank-Grade</h3>
                <p className="text-xs text-on-surface-variant">আপনার ডেটা ২৪/৭ এনক্রিপ্ট এবং ব্যাকআপ করা হয়।</p>
              </div>
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                <span className="material-symbols-outlined text-secondary mb-3 block">bolt</span>
                <h3 className="font-headline font-bold text-on-background mb-1">আল্ট্রা ফাস্ট</h3>
                <p className="text-xs text-on-surface-variant">তাৎক্ষণিক POS এবং স্টক আপডেট।</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-48 group">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb4_p2cq7xRrqsnDruT_AYbzbfC-Oeg1qpWJidQDNDZqRyf0E_50rzpIxcJUh_-GH02wkkRqAqgOpZE6FGUJ4Jtcx3_fG74foB1X-X6uz2HFgY1E1ClGuORd3DgD59Rfdu_CiHkeaurMqDM5HhsSi3eRl0OL9E_32nXkkCdDa_mZjVERDDiLc99aWj3Y9K7bdSIAxfvUpBIDs24Qxx-0y73DmjCpfTMbWpoUJ_DNwLJXOSRTyhr_8c9r84AyCyyUNGfcOuxDKXxJ8u"
                alt="Shop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/60 to-transparent flex items-end p-6">
                <p className="text-white text-sm font-medium italic">
                  "ShopStock BD এর মাধ্যমে আমি তিন মাসে ৩০% লাভ বৃদ্ধি করেছি।" — রহমান টি., স্টোর মালিক
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl border border-white/20">
              <div className="mb-8">
                <h2 className="font-headline font-extrabold text-3xl text-on-background mb-2">
                  {t.auth.welcomeBack}
                </h2>
                <p className="text-on-surface-variant font-body text-sm">{t.auth.signInToManage}</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-tertiary/10 border border-tertiary/20 rounded-lg text-tertiary text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold font-label tracking-wider text-on-surface-variant uppercase ml-1">
                    {t.auth.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline pointerevents-none" />
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
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold font-label tracking-wider text-on-surface-variant uppercase">
                      {t.auth.password}
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-primary hover:text-primary-container transition-colors"
                    >
                      {t.auth.forgotPassword}
                    </Link>
                  </div>
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

                {/* Remember Me */}
                <div className="flex items-center gap-3 px-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember" className="text-sm font-medium text-on-surface-variant cursor-pointer">
                    {t.auth.keepSignedIn}
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <LoaderCircle className="animate-spin w-5 h-5" /> : <ArrowForward className="w-5 h-5" />}
                  <span>{t.auth.loginButton}</span>
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/30"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-label tracking-widest">
                  <span className="bg-white px-4 text-outline font-bold">{t.auth.continueWith}</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center text-sm text-on-surface-variant">
                {t.auth.noAccount}{' '}
                <Link href="/signup" className="font-semibold text-primary hover:text-primary-container transition-colors">
                  {t.auth.createAccount}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
