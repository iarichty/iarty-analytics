import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiShield, FiTrendingUp, FiArrowRight, FiInfo, FiWifiOff } from 'react-icons/fi';
import HelmetContainer from '@/components/HelmetContainer';
import { useI18n } from '@/context/useI18n';
import { PLATFORMS } from '@/lib/platforms';

const platformFeatKeys = [
    { icon: FiShield, titleKey: 'home.feature.privacy.title', descKey: 'home.feature.privacy.desc', color: 'text-green-500' },
    { icon: FiClock, titleKey: 'home.feature.fast.title', descKey: 'home.feature.fast.desc', color: 'text-blue-500' },
    { icon: FiTrendingUp, titleKey: 'home.feature.insights.title', descKey: 'home.feature.insights.desc', color: 'text-purple-500' },
];

// Subtle noise texture, inlined to avoid an external network request.
const NOISE_BG =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

export default function Home() {
    const { t } = useI18n();
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fafafa] transition-colors duration-500 dark:bg-[#08080a]">
            <HelmetContainer title="IARTY Analytics — Social Media Analytics Tool" />

            {/* Ambient background */}
            <div className="absolute inset-0 z-0" aria-hidden>
                <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-purple-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-blue-500/10 blur-[120px]" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{ backgroundImage: NOISE_BG }}
                />
            </div>

            <main className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-24 text-center"
                >
                    <h1 className="mb-6 text-6xl font-black tracking-tighter text-gray-900 dark:text-white md:text-8xl">
                        {t('home.title1')}{' '}
                        <span className="bg-linear-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                            {t('home.title2')}
                        </span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 md:text-xl">
                        {t('home.tagline')}
                        <span className="font-medium text-gray-900 dark:text-white">
                            {' '}
                            {t('home.noAccess')}
                        </span>
                    </p>
                </motion.div>

                <div className="mb-32 grid gap-8 md:grid-cols-2">
                    {PLATFORMS.map((platform, i) => (
                        <motion.div
                            key={platform.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.7 }}
                            whileHover={{ y: -10 }}
                            className="group relative"
                        >
                            <div
                                className={`absolute -inset-1 rounded-[2.5rem] bg-linear-to-r ${platform.gradient} opacity-0 blur-2xl transition duration-500 group-hover:opacity-10`}
                            />
                            <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-black/6 bg-white p-10 shadow-xl backdrop-blur-2xl dark:border-white/8 dark:bg-white/3">
                                <div className="mb-12 flex items-start justify-between">
                                    <div className="relative">
                                        <div
                                            className={`absolute inset-0 bg-linear-to-r ${platform.gradient} opacity-20 blur-lg transition-opacity group-hover:opacity-40`}
                                        />
                                        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-black/5 bg-white p-4 shadow-inner transition-all duration-500 group-hover:-rotate-3 group-hover:scale-110 dark:border-white/10 dark:bg-gray-900">
                                            <img
                                                src={platform.icon}
                                                alt={`${platform.name} icon`}
                                                width={48}
                                                height={48}
                                                className="object-contain"
                                                onError={(e) => {
                                                    // Placeholder icons for planned
                                                    // platforms may not exist yet.
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {platform.comingSoon ? (
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-gray-500 dark:bg-white/10 dark:text-gray-300">
                                            {t('home.comingSoon')}
                                        </span>
                                    ) : (
                                        <Link
                                            to={platform.howItWorks ?? '#'}
                                            aria-label={`How ${platform.name} analysis works`}
                                            className="rounded-full p-3 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white"
                                        >
                                            <FiInfo size={22} aria-hidden />
                                        </Link>
                                    )}
                                </div>

                                <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {platform.name}
                                </h2>
                                <p className="mb-10 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                                    {t(platform.descriptionKey)}
                                </p>

                                {platform.comingSoon || !platform.link ? (
                                    <div className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 py-5 text-lg font-bold text-gray-400 dark:border-white/10 dark:text-gray-500">
                                        {t('home.comingSoon')}
                                    </div>
                                ) : (
                                    <Link
                                        to={platform.link}
                                        className={`flex w-full items-center justify-center gap-2 rounded-2xl py-5 text-lg font-bold text-white shadow-lg shadow-black/5 transition-all hover:brightness-110 active:scale-[0.98] ${platform.buttonColor}`}
                                    >
                                        {t('home.analyzeAccount')}
                                        <FiArrowRight
                                            className="transition-transform group-hover:translate-x-1"
                                            aria-hidden
                                        />
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-10 md:grid-cols-3">
                    {platformFeatKeys.map((feature) => (
                        <motion.div
                            key={feature.titleKey}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center px-4 text-center"
                        >
                            <div className="mb-6 rounded-full border border-black/5 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-white/5">
                                <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                                {t(feature.titleKey)}
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                {t(feature.descKey)}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-5 py-2 text-sm font-bold text-green-600 dark:text-green-400">
                        <FiWifiOff aria-hidden />
                        {t('home.offline')}
                    </span>
                </div>
            </main>
        </div>
    );
}
