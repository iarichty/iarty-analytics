import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiHeart, FiShield, FiTrendingUp, FiArrowRight, FiInfo } from 'react-icons/fi';

export default function Home() {
    const platforms = [
        {
            name: 'Instagram',
            description: 'Analyze followers, following, and find who isn\'t following you back instantly.',
            icon: '/img/instagram.svg',
            link: '/instagram',
            howItWorks: '/instagram/how-analyze-works',
            gradient: 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
            buttonColor: 'bg-linear-to-r from-pink-600 to-orange-500'
        },
        {
            name: 'TikTok',
            description: 'Deep dive into your TikTok connections and track your fan-base growth locally.',
            icon: '/img/tiktok.svg',
            link: '/tiktok',
            howItWorks: '/tiktok/how-analyze-works',
            gradient: 'from-[#00f2ea] to-[#ff0050]',
            buttonColor: 'bg-linear-to-r from-cyan-500 to-pink-600'
        }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fafafa] dark:bg-[#08080a] transition-colors duration-500">
            {/* Ambient Background Grains */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:py-32">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Local Privacy First</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-6">
                        IARTY{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-pink-500 to-orange-400">
                            Analytics
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        The professional toolkit for social insights.
                        <span className="text-gray-900 dark:text-white font-medium"> No account access required.</span>
                    </p>
                </motion.div>

                {/* Platform Selection */}
                <div className="grid md:grid-cols-2 gap-8 mb-32">
                    {platforms.map((platform, i) => (
                        <motion.div
                            key={platform.name}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.7 }}
                            whileHover={{ y: -10 }}
                            className="group relative"
                        >
                            {/* Card Outer Glow */}
                            <div className={`absolute -inset-1 bg-linear-to-r ${platform.gradient} rounded-[2.5rem] opacity-0 group-hover:opacity-10 blur-2xl transition duration-500`} />

                            <div className="relative h-full bg-white dark:bg-white/3 backdrop-blur-2xl border border-black/6 dark:border-white/8 p-10 rounded-[2.5rem] shadow-xl overflow-hidden">

                                <div className="flex justify-between items-start mb-12">
                                    {/* Platform Icon */}
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-linear-to-r ${platform.gradient} blur-lg opacity-20 group-hover:opacity-40 transition-opacity`} />
                                        <div className="relative w-20 h-20 rounded-2xl bg-white dark:bg-gray-900 border border-black/5 dark:border-white/10 flex items-center justify-center p-4 shadow-inner transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                                            <img
                                                src={platform.icon}
                                                alt={`${platform.name} icon`}
                                                width={48}
                                                height={48}
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>

                                    <Link
                                        to={platform.howItWorks}
                                        className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                                    >
                                        <FiInfo size={22} />
                                    </Link>
                                </div>

                                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{platform.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg leading-relaxed">{platform.description}</p>

                                <div className="flex flex-col gap-4">
                                    <Link
                                        to={platform.link}
                                        className={`w-full py-5 rounded-2xl ${platform.buttonColor} text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-black/5 hover:shadow-xl hover:brightness-110 transition-all active:scale-[0.98]`}
                                    >
                                        Analyze Account
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="grid md:grid-cols-3 gap-10">
                    {[
                        { icon: FiShield, title: "Pure Privacy", desc: "We use Client-Side processing. Your data never leaves this browser tab.", color: "text-green-500" },
                        { icon: FiClock, title: "Blazing Fast", desc: "No API limits. Scan thousands of profiles in seconds using optimized JS.", color: "text-blue-500" },
                        { icon: FiTrendingUp, title: "Clean Export", desc: "Download your analysis as a clean CSV or JSON for professional use.", color: "text-purple-500" }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center px-4"
                        >
                            <div className="mb-6 p-4 rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm">
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 pt-12 border-t border-black/5 dark:border-white/5 text-center"
                >
                    <a
                        href="https://saweria.co/fiqtor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-pink-500 transition-colors"
                    >
                        Created with <FiHeart className="group-hover:fill-pink-500 transition-all duration-300" /> by <span className="font-bold underline underline-offset-4 decoration-pink-500/30 group-hover:decoration-pink-500">Fiqtor</span>
                    </a>
                </motion.div>
            </main>
        </div>
    );
}