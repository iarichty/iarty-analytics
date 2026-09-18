import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: (origin?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // Ambil tema awal dari localStorage atau preferensi sistem
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme') as Theme;
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    // Circle bloom/ripple effect saat ganti tema
    const runBloomTransition = useCallback((origin: { x: number; y: number }) => {
        const root = window.document.documentElement;

        // Titik pusat ripple (relatif terhadap viewport)
        const x = origin.x;
        const y = origin.y;

        // Radius yang dibutuhkan agar menutupi seluruh layar
        const radius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Buat elemen overlay bloom
        const bloom = document.createElement('div');
        bloom.className = 'theme-bloom-overlay';
        bloom.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
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

        // Warna overlay menyesuaikan tema tujuan
        const targetIsDark = !root.classList.contains('dark');
        bloom.style.background = targetIsDark
            ? 'radial-gradient(circle, #0a0a0c 0%, #0a0a0c 60%, transparent 100%)'
            : 'radial-gradient(circle, #fafafa 0%, #fafafa 60%, transparent 100%)';

        document.body.appendChild(bloom);

        // Trigger animasi bloom
        requestAnimationFrame(() => {
            bloom.style.transform = 'scale(1)';
            bloom.style.opacity = '0';
        });

        // Terapkan perubahan tema saat ripple sudah mulai menutupi layar
        setTimeout(() => {
            root.classList.remove('light', 'dark');
            root.classList.add(targetIsDark ? 'dark' : 'light');
        }, 220);

        // Bersihkan elemen setelah selesai
        setTimeout(() => {
            bloom.remove();
        }, 700);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        if (!root.classList.contains('light') && !root.classList.contains('dark')) {
            root.classList.add(theme);
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (origin?: { x: number; y: number }) => {
        const root = window.document.documentElement;
        if (!root.classList.contains(theme)) {
            root.classList.add(theme);
        }

        if (origin) {
            // Animasi bloom dari titik klik
            runBloomTransition(origin);
            // Update state tanpa mengganggu animasi ripple
            flushSync(() => {
                setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
            });
        } else {
            // Fallback tanpa animasi
            root.classList.remove('light', 'dark');
            setTheme((prev) => {
                const next = prev === 'light' ? 'dark' : 'light';
                root.classList.add(next);
                return next;
            });
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook kustom agar panggilnya gampang
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
