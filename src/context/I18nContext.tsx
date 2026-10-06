import { useCallback, useEffect, useMemo, useState } from 'react';
import { I18nContext } from './useI18n';
import { detectLocale, translate, type Locale } from '@/lib/i18n';

const STORAGE_KEY = 'locale';

/** Resolve the initial locale: saved choice first, then browser detection. */
function getInitialLocale(): Locale {
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'en' || saved === 'id') return saved;
    }
    return detectLocale();
}

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
    const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next);
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, next);
        }
    }, []);

    // Keep the <html lang> attribute in sync for accessibility / SEO.
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;
        }
    }, [locale]);

    const t = useCallback(
        (key: string, vars?: Record<string, string | number>) =>
            translate(locale, key, vars),
        [locale],
    );

    const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
