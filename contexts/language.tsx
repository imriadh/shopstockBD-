'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import en from '@/i18n/en.json'
import bn from '@/i18n/bn.json'

type Language = 'en' | 'bn'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof en
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Get saved language from localStorage
    const saved = localStorage.getItem('language') as Language || 'en'
    setLanguageState(saved)
    setHydrated(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const translations = language === 'bn' ? bn : en

  if (!hydrated) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
