'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { Loader2, Store, MapPin, Hash } from 'lucide-react'

export default function OnboardingPage() {
  const [shopName, setShopName] = useState('')
  const [address, setAddress] = useState('')
  const [vatNumber, setVatNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { updateProfile } = useAuth()
  const { t, language, setLanguage } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!shopName || !address) {
      setError(t.onboarding.requiredFieldsError)
      return
    }

    if (loading) return // Prevent double submission

    setLoading(true)

    try {
      console.log('Submitting profile with:', { shopName, address, vatNumber })
      
      await updateProfile({
        shop_name: shopName,
        shop_address: address,
        phone: '', // Empty string as placeholder since it's required by schema
        vat_number: vatNumber.trim() ? vatNumber.trim() : null,
        tier: 'free',
      })
      
      console.log('Profile updated successfully!')
      
      // Force redirect to dashboard
      window.location.href = '/dashboard'
    } catch (err) {
      console.error('Profile update error:', err)
      console.error('Error details:', JSON.stringify(err, null, 2))
      
      const errorMessage = err instanceof Error ? err.message : t.onboarding.saveFailed
      setError(`Error: ${errorMessage}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-dim to-surface-bright flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-6 py-4 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white">storefront</span>
            </div>
            <span className="font-headline font-extrabold text-lg tracking-tight text-on-background">
              ShopStock <span className="text-primary">BD</span>
            </span>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-primary hover:bg-primary-fixed-dim/20 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined">language</span>
            <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 mt-20 mb-6">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-2 bg-primary rounded-full"></div>
            </div>
            <h1 className="text-4xl font-headline font-extrabold text-on-background mb-2">
              {t.onboarding.title}
            </h1>
            <p className="text-on-surface-variant">{t.onboarding.subtitle}</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-white/20">
            {error && (
              <div className="mb-6 p-4 bg-tertiary/10 border border-tertiary/20 rounded-lg text-tertiary text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shop Name */}
              <div className="space-y-2">
                <label className="block text-sm font-headline font-bold text-on-background">
                  {t.onboarding.shopName}
                  <span className="text-tertiary ml-1">*</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder={t.onboarding.shopNamePlaceholder}
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface font-body"
                    required
                  />
                </div>
              </div>

              {/* Shop Address */}
              <div className="space-y-2">
                <label className="block text-sm font-headline font-bold text-on-background">
                  {t.onboarding.address}
                  <span className="text-tertiary ml-1">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-outline" />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t.onboarding.addressPlaceholder}
                    rows={3}
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface font-body resize-none"
                    required
                  />
                </div>
              </div>

              {/* VAT Number */}
              <div className="space-y-2">
                <label className="block text-sm font-headline font-bold text-on-background">
                  {t.onboarding.vatNumber}
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input
                    type="text"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    placeholder="e.g. 12345678901"
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all outline-none text-on-surface font-body"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>{t.onboarding.saving}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">check</span>
                    <span>{t.onboarding.completeProfile}</span>
                  </>
                )}
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-8 p-4 bg-primary-fixed-dim/10 border border-primary-fixed-dim/20 rounded-lg">
              <p className="text-xs text-primary text-center font-semibold">
                {'✓ ' + t.onboarding.secureNote}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
