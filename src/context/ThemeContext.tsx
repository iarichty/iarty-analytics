import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { ThemeContext, type Theme } from './useTheme';

/** Resolve the initial theme, preferring the class set by the anti-FOUC script. */
function getInitialTheme(): Theme {
    if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (root.classList.contains('dark')) return 'dark';
        if (root.classList.contains('light')) return 'light';
    }
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    const prefersReducedMotion = () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /** Circle-bloom ripple that plays from the point the toggle was clicked. */
    const runBloomTransition = useCallback(
        (origin: { x: number; y: number }, targetIsDark: boolean) => {
            const x = origin.x;
            const y = origin.y;
            const radius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y),
            );

            const bloom = document.createElement('div');
            bloom.className = 'theme-bloom-overlay';
            bloom.style.cssText = `
                position: fixed;
                z-index: 9999;
                pointer-events: none;
                border-radius: 9999px;
                width: ${radius * 2}px;
                height: ${radius * 2}px;
                left: ${x - radius}px;
                top: ${y - radius}px;
                transform: scale(0);
                opacity: 0.95;
                transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.65s ease;
                will-change: transform, opacity;
            `;
            bloom.style.background = targetIsDark
                ? 'radial-gradient(circle, #0a0a0c 0%, #0a0a0c 60%, transparent 100%)'
                : 'radial-gradient(circle, #fafafa 0%, #fafafa 60%, transparent 100%)';

            document.body.appendChild(bloom);
            requestAnimationFrame(() => {
                bloom.style.transform = 'scale(1)';
                bloom.style.opacity = '0';
            });

            // Swap the theme once the ripple starts covering the screen.
            setTimeout(() => {
                const root = document.documentElement;
                root.classList.remove('light', 'dark');
                root.classList.add(targetIsDark ? 'dark' : 'light');
            }, 220);

            setTimeout(() => bloom.remove(), 700);
        },
        [],
    );

    // Keep the <html> class and persisted value in sync with state.
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Follow the OS preference while the user has not made an explicit choice.
    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = (event: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                setTheme(event.matches ? 'dark' : 'light');
            }
        };
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    const toggleTheme = (origin?: { x: number; y: number }) => {
        const next: Theme = theme === 'light' ? 'dark' : 'light';

        if (origin && !prefersReducedMotion()) {
            runBloomTransition(origin, next === 'dark');
            flushSync(() => setTheme(next));
        } else {
            setTheme(next);
        }
    };

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
