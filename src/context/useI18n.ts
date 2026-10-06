import { createContext, useContext } from 'react';
import type { Locale } from '@/lib/i18n';

export interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    /** Translate a key, with optional `{placeholder}` substitution. */
    t: (key: string, vars?: Record<string, string | number>) => string;
}

// Kept separate from the provider component so Fast Refresh stays happy.
export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n(): I18nContextType {
    const context = useContext(I18nContext);
    if (!context) throw new Error('useI18n must be used within I18nProvider');
    return context;
}
