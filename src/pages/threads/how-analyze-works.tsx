import { motion } from 'framer-motion';
import { FiDownload, FiSettings, FiUser, FiClock, FiCheck, FiUpload, FiArrowLeft, FiInfo, FiExternalLink } from 'react-icons/fi';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import HelmetContainer from '@/components/HelmetContainer';

type Language = 'en' | 'id';

type Step = {
    icon: ReactNode;
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

export default function HowThreadsWorks() {
    const [language, setLanguage] = useState<Language>('en');

    const translations: Record<Language, TranslationType> = {
        en: {
            back: 'BACK TO DASHBOARD',
            title: 'How to Get Your Data',
            subtitle: 'Threads connections come from the same Accounts Center export as Instagram. Follow these steps.',
            note: 'Note: Meta usually takes 5-30 minutes to prepare your file, depending on the size of your account.',
            cta_ready: 'I ALREADY HAVE THE FILE',
            cta_open: 'OPEN ACCOUNTS CENTER',
            steps: [
                {
                    icon: <FiSettings />,
                    title: 'Open Threads',
                    description: 'Open the Threads app, tap your profile, then the two-line menu and "Settings".',
                    color: 'from-slate-700 to-slate-900'
                },
                {
                    icon: <FiUser />,
                    title: 'Accounts Center',
                    description: 'Tap "Accounts Center", then scroll to "Your information and permissions".',
                    color: 'from-slate-600 to-slate-800'
                },
                {
                    icon: <FiDownload />,
                    title: 'Download Information',
                    description: 'Select "Download or transfer information" and choose your Threads account.',
                    color: 'from-slate-500 to-slate-700'
                },
                {
                    icon: <FiCheck />,
                    title: 'Select Specific Types',
                    description: 'Choose "Some of your information" and tick "Followers and Following".',
                    color: 'from-slate-500 to-gray-600'
                },
                {
                    icon: <FiClock />,
                    title: 'Format & Period',
                    description: 'Crucial: select JSON format (not HTML) and set the date range to "All time".',
                    color: 'from-gray-500 to-zinc-600'
                },
                {
                    icon: <FiUpload />,
                    title: 'Upload to IARTY',
                    description: 'Wait for the email from Meta, download the .zip file and upload it to our analyzer.',
                    color: 'from-zinc-600 to-slate-800'
                }
            ]
        },
        id: {
            back: 'KEMBALI KE DASHBOARD',
            title: 'Cara Ambil Data',
            subtitle: 'Koneksi Threads berasal dari export Accounts Center yang sama dengan Instagram. Ikuti langkah berikut.',
            note: 'Catatan: Meta biasanya membutuhkan 5-30 menit untuk menyiapkan file, tergantung ukuran akun Anda.',
            cta_ready: 'SAYA SUDAH PUNYA FILE',
            cta_open: 'BUKA ACCOUNTS CENTER',
            steps: [
                {
                    icon: <FiSettings />,
                    title: 'Buka Threads',
                    description: 'Buka aplikasi Threads, masuk ke profil, tekan menu dua garis lalu "Pengaturan".',
                    color: 'from-slate-700 to-slate-900'
                },
                {
                    icon: <FiUser />,
                    title: 'Pusat Akun',
                    description: 'Ketuk "Pusat Akun", lalu cari menu "Informasi dan izin Anda".',
                    color: 'from-slate-600 to-slate-800'
                },
                {
                    icon: <FiDownload />,
                    title: 'Unduh Informasi',
                    description: 'Pilih "Unduh atau transfer informasi" dan pilih akun Threads Anda.',
                    color: 'from-slate-500 to-slate-700'
                },
                {
                    icon: <FiCheck />,
                    title: 'Pilih Jenis Data',
                    description: 'Pilih "Sebagian informasi Anda" dan centang "Pengikut dan Mengikuti".',
                    color: 'from-slate-500 to-gray-600'
                },
                {
                    icon: <FiClock />,
                    title: 'Format & Periode',
                    description: 'Penting: pilih format JSON (bukan HTML) dan atur rentang tanggal ke "Sepanjang waktu".',
                    color: 'from-gray-500 to-zinc-600'
                },
                {
                    icon: <FiUpload />,
                    title: 'Unggah ke IARTY',
                    description: 'Tunggu email dari Meta, unduh file .zip tersebut, dan unggah ke halaman analisis kami.',
                    color: 'from-zinc-600 to-slate-800'
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
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <HelmetContainer
                title="How to get your Threads data | IARTY Tools"
                path="/threads/how-analyze-works"
            />
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-slate-400 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-zinc-500 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={() => window.history.back()}
                            className="group flex items-center gap-2 text-xs font-black tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
                        >
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform w-4 h-4" />
                            {translations[language].back}
                        </button>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                            {translations[language].title.split(' ').slice(0, -1).join(' ')}{' '}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-gray-500 dark:from-white dark:to-gray-400">
                                {translations[language].title.split(' ').slice(-1)}
                            </span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl">
                            {translations[language].subtitle}
                        </p>
                    </motion.div>

                    <div className="flex p-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm h-fit">
                        {(['id', 'en'] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${language === lang
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

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
                            whileHover={{ y: -8 }}
                            className="group relative bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute top-6 right-8 text-6xl font-black text-slate-100 dark:text-white/3 pointer-events-none group-hover:text-slate-500/10 transition-colors">
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            <div className={`w-14 h-14 bg-linear-to-tr ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-slate-500/20`}>
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-3 tracking-tight text-slate-800 dark:text-white">
                                {step.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-20 text-center space-y-8"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <FiInfo className="shrink-0" />
                        <p className="text-sm font-bold tracking-tight">
                            {translations[language].note}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/threads"
                            className="flex items-center gap-2 px-10 py-5 bg-linear-to-r from-slate-800 to-gray-600 text-white rounded-3xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-500/20"
                        >
                            <FiUpload className="w-5 h-5" aria-hidden />
                            {translations[language].cta_ready}
                        </Link>
                        <a
                            href="https://accountscenter.instagram.com/your_information_and_permissions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-10 py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl font-black hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                        >
                            {translations[language].cta_open} <FiExternalLink aria-hidden />
                        </a>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
