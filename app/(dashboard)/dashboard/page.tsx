'use client'

import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const router = useRouter()

  // Show loading while auth state is initializing
  // Don't redirect here - let middleware handle route protection
  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    )
  }

  // If user exists but no profile, redirect to onboarding
  if (user && !profile) {
    router.push('/onboarding')
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-dim to-surface-bright">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">storefront</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">ShopStock BD</h1>
              <p className="text-xs text-on-surface-variant">{profile?.shop_name || 'My Shop'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-3 py-1.5 rounded-lg text-primary hover:bg-primary-fixed-dim/20 transition-colors text-sm font-semibold flex items-center gap-2"
            >
              <span className="material-symbols-outlined">language</span>
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            <div className="h-8 w-px bg-outline-variant/30"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-tertiary hover:bg-tertiary/10 transition-colors font-semibold"
            >
              <LogOut className="w-5 h-5" />
              <span>{language === 'en' ? 'Logout' : 'লগআউট'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        <section className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-background mb-4">
            {language === 'en' ? 'Welcome to Dashboard' : 'ড্যাশবোর্ডে স্বাগতম'}
          </h1>
          <p className="text-lg text-on-surface-variant mb-8">
            {language === 'en'
              ? `Shop: ${profile?.shop_name || 'Loading...'}`
              : `দোকান: ${profile?.shop_name || 'লোড হচ্ছে...'}`}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {/* Stat Cards - We'll finish these in the next phase */}
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">0</div>
              <p className="text-sm text-on-surface-variant">{language === 'en' ? "Today's Sales" : 'আজকের বিক্রয়'}</p>
            </div>
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">0</div>
              <p className="text-sm text-on-surface-variant">{language === 'en' ? 'Total Products' : 'মোট পণ্য'}</p>
            </div>
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-sm">
              <div className="text-3xl font-bold text-tertiary mb-2">0</div>
              <p className="text-sm text-on-surface-variant">{language === 'en' ? 'Low Stock' : 'স্বল্প স্টক'}</p>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl shadow-lg shadow-primary/20 text-white">
              <div className="text-3xl font-bold mb-2">0</div>
              <p className="text-sm text-white/80">{language === 'en' ? 'Monthly Profit' : 'মাসিক লাভ'}</p>
            </div>
          </div>

          {/* Coming Soon Message */}
          <div className="mt-16 p-8 bg-primary-fixed-dim/10 border border-primary-fixed-dim/30 rounded-2xl">
            <span className="material-symbols-outlined text-4xl text-primary block mb-4">construction</span>
            <h2 className="text-2xl font-headline font-bold text-on-background mb-2">
              {language === 'en' ? 'Dashboard Coming Soon!' : 'ড্যাশবোর্ড শীঘ্রই আসছে!'}
            </h2>
            <p className="text-on-surface-variant mb-6">
              {language === 'en'
                ? 'We are building amazing features for you. Check back soon!'
                : 'আমরা আপনার জন্য দুর্দান্ত ফিচার তৈরি করছি। শীঘ্রই ফিরে আসুন!'}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
                📊 {language === 'en' ? 'Analytics' : 'বিশ্লেষণ'}
              </span>
              <span className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
                🛍️ {language === 'en' ? 'Products' : 'পণ্য'}
              </span>
              <span className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
                💳 {language === 'en' ? 'Sales' : 'বিক্রয়'}
              </span>
              <span className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
                📄 {language === 'en' ? 'Invoices' : 'চালান'}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
