import { create } from 'zustand';
import { translations, TranslationKey } from '../locales/translations';

export type LanguageCode = 'fa' | 'en' | 'ru' | 'zh';

export interface LanguageItem {
  code: LanguageCode;
  name: string;        // نام فارسی
  nativeName: string;  // نام به زبان اصلی
  flag: string;        // پرچم کشور
  shortCode: string;   // نماد کوتاه (FA, EN, RU, ZH)
  country: string;
}

export const AVAILABLE_LANGUAGES: LanguageItem[] = [
  {
    code: 'fa',
    name: 'فارسی',
    nativeName: 'فارسی (ایران)',
    flag: '🇮🇷',
    shortCode: 'فا',
    country: 'Iran',
  },
  {
    code: 'en',
    name: 'انگلیسی',
    nativeName: 'English (US)',
    flag: '🇬🇧',
    shortCode: 'EN',
    country: 'United States / UK',
  },
  {
    code: 'ru',
    name: 'روسی',
    nativeName: 'Русский',
    flag: '🇷🇺',
    shortCode: 'RU',
    country: 'Russia',
  },
  {
    code: 'zh',
    name: 'چینی',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    shortCode: 'ZH',
    country: 'China',
  },
];

interface LanguageStore {
  currentLanguage: LanguageCode;
  isLanguageModalOpen: boolean;
  setLanguageModalOpen: (open: boolean) => void;
  setLanguage: (code: LanguageCode) => void;
  getCurrentLanguageItem: () => LanguageItem;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const getInitialLang = (): LanguageCode => {
  const saved = localStorage.getItem('app_language') as LanguageCode;
  if (saved && (saved === 'fa' || saved === 'en' || saved === 'ru' || saved === 'zh')) {
    return saved;
  }
  return 'fa';
};

const initialLang = getInitialLang();

// Apply initial DOM direction and language tag
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
  document.documentElement.dir = initialLang === 'fa' ? 'rtl' : 'ltr';
  document.body.dir = initialLang === 'fa' ? 'rtl' : 'ltr';
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  currentLanguage: initialLang,
  isLanguageModalOpen: false,
  setLanguageModalOpen: (open) => set({ isLanguageModalOpen: open }),
  setLanguage: (code) => {
    localStorage.setItem('app_language', code);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code;
      document.documentElement.dir = code === 'fa' ? 'rtl' : 'ltr';
      document.body.dir = code === 'fa' ? 'rtl' : 'ltr';
    }
    set({ currentLanguage: code });
  },
  getCurrentLanguageItem: () => {
    const lang = get().currentLanguage;
    return AVAILABLE_LANGUAGES.find((l) => l.code === lang) || AVAILABLE_LANGUAGES[0];
  },
  t: (key: TranslationKey, params?: Record<string, string | number>): string => {
    const lang = get().currentLanguage;
    const dict = (translations[lang] || translations.fa) as Record<string, string>;
    let text = dict[key] || (translations.fa as Record<string, string>)[key] || (key as string);

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      });
    }

    return text;
  },
}));

/**
 * Convenient React hook for components to access translation helper, current direction, and active language
 */
export const useTranslation = () => {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const t = useLanguageStore((state) => state.t);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const getCurrentLanguageItem = useLanguageStore((state) => state.getCurrentLanguageItem);
  const isLanguageModalOpen = useLanguageStore((state) => state.isLanguageModalOpen);
  const setLanguageModalOpen = useLanguageStore((state) => state.setLanguageModalOpen);

  const isRTL = currentLanguage === 'fa';
  const dir: 'rtl' | 'ltr' = isRTL ? 'rtl' : 'ltr';
  const langItem = getCurrentLanguageItem();

  return {
    t,
    currentLanguage,
    dir,
    isRTL,
    langItem,
    setLanguage,
    isLanguageModalOpen,
    setLanguageModalOpen,
  };
};
