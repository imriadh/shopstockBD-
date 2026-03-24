import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number, locale = 'bn-BD') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const calculateVAT = (subtotal: number, vatRate = 0.15) => {
  return subtotal * vatRate
}

export const generateInvoiceNumber = () => {
  return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export const formatDate = (date: Date | string, locale = 'bn-BD') => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const parseJSON = <T>(value: string, defaultValue: T): T => {
  try {
    return JSON.parse(value)
  } catch {
    return defaultValue
  }
}
