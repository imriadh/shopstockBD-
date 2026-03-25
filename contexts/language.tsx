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

  useEffect(() => {
    // Get saved language from localStorage and validate it.
    const saved = localStorage.getItem('language')
    const nextLanguage: Language = saved === 'bn' || saved === 'en' ? saved : 'en'
    document.documentElement.lang = nextLanguage
    setLanguageState(nextLanguage)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    document.documentElement.lang = lang
    localStorage.setItem('language', lang)
  }

  const translations = language === 'bn' ? bn : en

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
