import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useRef, useState } from 'react';
import { FiMenu, FiX, FiInstagram, FiMusic, FiHome, FiSun, FiMoon } from 'react-icons/fi';

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        toggleTheme({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        });
    };

    return (
        <button
            onClick={handleClick}
            aria-label="Toggle theme"
            className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                    <motion.span
                        key="sun"
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.25 }}
                        className="block"
                    >
                        <FiSun size={18} />
                    </motion.span>
                ) : (
                    <motion.span
                        key="moon"
                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.25 }}
                        className="block"
                    >
                        <FiMoon size={18} />
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navRef = useRef<HTMLDivElement>(null);

    const menuItems = [
        { href: '/', label: 'Home', icon: FiHome },
        { href: '/instagram', label: 'Instagram', icon: FiInstagram },
        { href: '/tiktok', label: 'TikTok', icon: FiMusic },
    ];

    const activeHref = menuItems
        .map((m) => m.href)
        .find((href) => (href === '/' ? location.pathname === '/' : location.pathname.startsWith(href))) ?? '/';

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 sm:p-6 lg:p-8">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-5xl bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-4xl px-6 py-2"
            >
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative w-9 h-9 overflow-hidden rounded-xl border border-black/5 dark:border-white/10 shadow-sm transition-transform group-hover:scale-110">
                            <img src="/img/icon.webp" alt="icon" className="object-cover w-full h-full" />
                        </div>
                        <span className="hidden sm:block text-lg font-black tracking-tight text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            TOOLS
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div
                        ref={navRef}
                        className="hidden md:flex items-center bg-gray-100/50 dark:bg-white/5 rounded-full px-2 py-1 gap-1"
                    >
                        {menuItems.map((item) => {
                            const isActive = item.href === activeHref;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`relative flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${isActive
                                        ? 'text-purple-600 dark:text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-active-pill"
                                            className="absolute inset-0 bg-white dark:bg-white/10 shadow-md rounded-full -z-10"
                                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                        />
                                    )}
                                    <item.icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                        <ThemeToggle />

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="flex flex-col space-y-1 pb-4 pt-2 border-t border-black/5 dark:border-white/5 mt-2">
                                {menuItems.map((item) => {
                                    const isActive = item.href === activeHref;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`relative flex items-center space-x-4 px-4 py-3 rounded-2xl font-bold transition-all ${isActive
                                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
}
