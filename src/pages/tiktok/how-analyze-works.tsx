import { motion } from 'framer-motion';
import {
    FiDownload, FiSettings, FiUser, FiClock,
    FiUpload, FiArrowLeft, FiInfo,
    FiExternalLink, FiFileText
} from 'react-icons/fi';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type Language = 'en' | 'id';

type Step = {
    icon: any;
    title: string;
    description: string;
    color: string;
};

type TranslationType = {
    back: string;
    title: string;
    subtitle: string;
    note: string;
    cta_ready: string;
    cta_open: string;
    steps: Step[];
};

export default function HowTikTokWorks() {
    const [language, setLanguage] = useState<Language>('id');

    const translations: Record<Language, TranslationType> = {
        en: {
            back: 'BACK TO DASHBOARD',
            title: 'How to Get TikTok Data',
            subtitle: 'Follow these steps to request and download your TikTok data for analysis.',
            note: 'Note: TikTok usually takes 1-3 days to process your data request. You will get a notification when it is ready.',
            cta_ready: 'I HAVE THE ZIP FILE',
            cta_open: 'OPEN TIKTOK',
            steps: [
                {
                    icon: <FiSettings />,
                    title: 'Settings & Privacy',
                    description: 'Open TikTok, go to your Profile, tap the three lines (hamburger menu) and select "Settings and Privacy".',
                    color: 'from-gray-600 to-gray-800'
                },
                {
                    icon: <FiUser />,
                    title: 'Account Center',
                    description: 'Tap on "Account" at the top of the menu to access your personal data settings.',
                    color: 'from-[#fe2c55] to-pink-600'
                },
                {
                    icon: <FiDownload />,
                    title: 'Download Data',
                    description: 'Select "Download your data". This is where you request a copy of your TikTok information.',
                    color: 'from-blue-500 to-[#25f4ee]'
                },
                {
                    icon: <FiFileText />,
                    title: 'Select Format',
                    description: 'Crucial: Choose "JSON - Machine-readable file" (NOT TXT). This is the format our analyzer supports.',
                    color: 'from-[#25f4ee] to-teal-500'
                },
                {
                    icon: <FiClock />,
                    title: 'Request & Wait',
                    description: 'Tap "Request data". TikTok will start preparing your file. Check back in the "Download data" tab later.',
                    color: 'from-purple-600 to-[#fe2c55]'
                },
                {
                    icon: <FiUpload />,
                    title: 'Analyze on IARTY',
                    description: 'Once the ZIP is ready, download it to your device and upload it here to see your insights.',
                    color: 'from-orange-500 to-yellow-500'
                }
            ]
        },
        id: {
            back: 'KEMBALI KE DASHBOARD',
            title: 'Cara Ambil Data TikTok',
            subtitle: 'Ikuti langkah berikut untuk meminta dan mengunduh data TikTok Anda dengan aman.',
            note: 'Catatan: TikTok biasanya butuh 1-3 hari untuk memproses permintaan data. Anda akan menerima notifikasi jika sudah siap.',
            cta_ready: 'SAYA SUDAH PUNYA ZIP',
            cta_open: 'BUKA TIKTOK',
            steps: [
                {
                    icon: <FiSettings />,
                    title: 'Pengaturan & Privasi',
                    description: 'Buka TikTok, masuk ke Profil, tekan menu garis tiga di pojok kanan atas dan pilih "Pengaturan dan Privasi".',
                    color: 'from-gray-600 to-gray-800'
                },
                {
                    icon: <FiUser />,
                    title: 'Pusat Akun',
                    description: 'Pilih menu "Akun" untuk mengakses informasi profil dan pengaturan data pribadi Anda.',
                    color: 'from-[#fe2c55] to-pink-600'
                },
                {
                    icon: <FiDownload />,
                    title: 'Unduh Data Anda',
                    description: 'Cari dan pilih menu "Unduh data Anda". Di sini Anda bisa meminta salinan data akun.',
                    color: 'from-blue-500 to-[#25f4ee]'
                },
                {
                    icon: <FiFileText />,
                    title: 'Pilih Format JSON',
                    description: 'Penting: Pilih format "JSON" (BUKAN Teks). Format ini diperlukan agar sistem kami bisa membaca data Anda.',
                    color: 'from-[#25f4ee] to-teal-500'
                },
                {
                    icon: <FiClock />,
                    title: 'Minta & Tunggu',
                    description: 'Klik "Minta data". TikTok akan menyiapkan file. Cek tab "Unduh data" secara berkala (biasanya 24 jam+).',
                    color: 'from-purple-600 to-[#fe2c55]'
                },
                {
                    icon: <FiUpload />,
                    title: 'Unggah ke IARTY',
                    description: 'Setelah file ZIP siap, unduh ke HP/PC Anda, lalu unggah ke halaman analisis untuk melihat hasilnya.',
                    color: 'from-orange-500 to-yellow-500'
                }
            ]
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f13] text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-160 h-160 bg-[#fe2c55] rounded-full blur-[150px] opacity-[0.04] dark:opacity-[0.07]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-160 h-160 bg-[#25f4ee] rounded-full blur-[150px] opacity-[0.04] dark:opacity-[0.07]" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-20 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={() => window.history.back()}
                            className="group flex items-center gap-2 text-xs font-black tracking-[0.2em] text-gray-500 hover:text-[#fe2c55] transition-colors mb-6 uppercase"
                        >
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform w-4 h-4" />
                            {translations[language].back}
                        </button>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4">
                            DATA{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#fe2c55] via-purple-500 to-[#25f4ee]">
                                GUIDE
                            </span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-xl">
                            {translations[language].subtitle}
                        </p>
                    </motion.div>

                    {/* Language Switcher */}
                    <div className="flex p-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm dark:backdrop-blur-md h-fit">
                        {(['id', 'en'] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${language === lang
                                    ? 'bg-[#fe2c55] text-white shadow-lg shadow-[#fe2c55]/20'
                                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
                                    }`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Steps Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {translations[language].steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-white/5 p-10 rounded-[3rem] shadow-sm dark:shadow-2xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Watermark Number */}
                            <div className="absolute top-6 right-10 text-7xl font-black italic text-gray-100 dark:text-white/2 pointer-events-none group-hover:text-[#fe2c55]/10 transition-colors">
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            <div className={`w-16 h-16 bg-linear-to-tr ${step.color} rounded-2xl flex items-center justify-center text-white text-3xl mb-8 shadow-lg`}>
                                {step.icon}
                            </div>

                            <h3 className="text-2xl font-black italic mb-4 tracking-tight text-gray-900 dark:text-white group-hover:text-[#fe2c55] transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer Section */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-24 text-center space-y-10"
                >
                    <div className="inline-flex items-center gap-3 px-8 py-4 bg-red-50 dark:bg-[#fe2c55]/5 text-red-600 dark:text-[#fe2c55] rounded-2xl border border-red-100 dark:border-[#fe2c55]/20 max-w-2xl">
                        <FiInfo className="shrink-0 w-6 h-6" />
                        <p className="text-sm font-bold leading-relaxed text-left">
                            {translations[language].note}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/tiktok"
                            className="flex items-center gap-3 px-12 py-6 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-black text-lg hover:opacity-90 hover:scale-105 active:scale-95 transition-all uppercase tracking-tight shadow-xl"
                        >
                            <FiUpload className="w-6 h-6" />
                            {translations[language].cta_ready}
                        </Link>

                        <a
                            href="https://www.tiktok.com/setting/download-your-data"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-12 py-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full font-black text-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all uppercase tracking-tight shadow-sm"
                        >
                            {translations[language].cta_open} <FiExternalLink className="text-[#25f4ee]" />
                        </a>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}