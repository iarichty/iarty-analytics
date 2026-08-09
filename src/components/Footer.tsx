import { motion, type Variants } from 'framer-motion';
import { FiHeart, FiGithub, FiExternalLink, FiShield, FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    } as Variants;

    return (
        <footer className="relative">
            {/* Dekorasi Background agar nyambung dengan blur navbar */}
            <div className="absolute inset-0 -z-10 flex justify-center items-end overflow-hidden pointer-events-none">
                <div className="w-full h-50 bg-purple-500/10 dark:bg-purple-900/20 blur-[100px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mx-auto"
            >
                {/* Main Footer Card */}
                <div className="bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.2)] p-8 md:p-12">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        {/* Left Side: Brand & Credit */}
                        <div className="space-y-6 text-center md:text-left">
                            <Link to="/" className="inline-flex items-center space-x-3 group">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm transition-transform group-hover:rotate-12">
                                    <img src="/img/icon.webp" alt="icon" className="object-cover w-full h-full" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                                    IARTY<span className="text-purple-600">.</span>
                                </span>
                            </Link>

                            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto md:mx-0">
                                Analisis koneksi media sosial Anda dengan aman, cepat, dan transparan tanpa menyimpan data pribadi.
                            </p>

                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
                                <span>Built with</span>
                                <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <FiHeart className="w-4 h-4 text-red-500 fill-red-500" />
                                </motion.span>
                                <span>by</span>
                                <div className="flex gap-2">
                                    <a href="https://fiqtor.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline decoration-2 underline-offset-4">fiqtor.com</a>
                                    <span className="opacity-30">|</span>
                                    <a href="https://iarty.id" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline decoration-2 underline-offset-4">iarty.id</a>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Quick Links */}
                        <div className="grid grid-cols-2 gap-4">
                            <FooterLink to="/instagram/how-analyze-works" icon={<FiInfo />} label="Panduan" />
                            <FooterLink to="/privacy" icon={<FiShield />} label="Privasi" />
                            <FooterLink href="https://github.com/FIQTOR" icon={<FiGithub />} label="GitHub" isExternal />
                            <FooterLink to="/" icon={<FiExternalLink />} label="Sitemap" />
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                            © {currentYear} IARTY GROUP. NO RIGHTS RESERVED.
                        </p>

                        <div className="flex gap-6">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" title="System Online"></span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Version 2.0.4-Beta</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}

// Sub-component untuk link agar kode lebih bersih
interface FooterLinkProps {
    to?: string;
    href?: string;
    icon: React.ReactNode;
    label: string;
    isExternal?: boolean;
}

function FooterLink({ to, href, icon, label, isExternal = false }: FooterLinkProps) {
    const className = "flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-purple-500/30 hover:bg-white dark:hover:bg-white/10 transition-all group";
    const inner = (
        <>
            <span className="text-gray-400 group-hover:text-purple-500 transition-colors">{icon}</span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{label}</span>
        </>
    );

    if (isExternal && href) {
        return (
            <motion.div whileHover={{ y: -4 }}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                    {inner}
                </a>
            </motion.div>
        );
    }

    return (
        <motion.div whileHover={{ y: -4 }}>
            <Link to={to || '/'} className={className}>
                {inner}
            </Link>
        </motion.div>
    );
}