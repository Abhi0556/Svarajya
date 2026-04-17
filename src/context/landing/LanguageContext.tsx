'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '@/locales/landing/en.json';
import hi_mix from '@/locales/landing/hi_mix.json';
import mr_mix from '@/locales/landing/mr_mix.json';

type Language = 'en' | 'hi' | 'mr';

type TranslationValue = string | Record<string, unknown> | unknown[];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number) => string;
}

const translations: Record<Language, typeof en> = {
  en,
  hi: hi_mix,
  mr: mr_mix,
};

const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('svarajya-language');
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
        return saved as Language;
      }
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('svarajya-language', language);
    // Set lang attribute for CSS font switching
    document.documentElement.lang = language;
    
    // Apply Devanagari font class for Hindi and Marathi
    if (language === 'hi' || language === 'mr') {
      document.body.classList.add('font-devanagari');
      document.documentElement.classList.add('font-devanagari');
    } else {
      document.body.classList.remove('font-devanagari');
      document.documentElement.classList.remove('font-devanagari');
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  // Get nested translation value
  const getNestedValue = useCallback((obj: Record<string, unknown>, path: string): TranslationValue | undefined => {
    const keys = path.split('.');
    let current: unknown = obj;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }
    
    return current as TranslationValue;
  }, []);

  // Translation function - returns string
  const t = useCallback((key: string): string => {
    const value = getNestedValue(translations[language] as unknown as Record<string, unknown>, key);
    if (typeof value === 'string') {
      return value;
    }
    // Fallback to English
    const enValue = getNestedValue(translations.en as unknown as Record<string, unknown>, key);
    if (typeof enValue === 'string') {
      return enValue;
    }
    return key;
  }, [language, getNestedValue]);

  // Translation function for arrays
  const tArray = useCallback((key: string): string[] => {
    const value = getNestedValue(translations[language] as unknown as Record<string, unknown>, key);
    if (Array.isArray(value)) {
      return value as string[];
    }
    const enValue = getNestedValue(translations.en as unknown as Record<string, unknown>, key);
    if (Array.isArray(enValue)) {
      return enValue as string[];
    }
    return [];
  }, [language, getNestedValue]);

  // Format number based on locale
  const formatNumber = useCallback((num: number): string => {
    const locale = language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'mr-IN';
    return new Intl.NumberFormat(locale).format(num);
  }, [language]);

  // Format currency
  const formatCurrency = useCallback((amount: number): string => {
    const locale = language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'mr-IN';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      tArray,
      formatNumber,
      formatCurrency,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { languageNames };
export type { Language };
