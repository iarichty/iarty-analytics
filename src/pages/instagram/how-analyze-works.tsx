import { motion } from 'framer-motion';
import { FiDownload, FiSettings, FiUser, FiClock, FiCheck, FiUpload, FiArrowLeft, FiInfo, FiExternalLink } from 'react-icons/fi';
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
    steps: Step[];
};

export default function HowInstagramWorks() {
    const [language, setLanguage] = useState<Language>('id');

    const translations: Record<Language, TranslationType> = {
        en: {
            back: 'BACK TO DASHBOARD',
            title: 'How to Get Your Data',
            subtitle: 'Follow these steps to securely download your Instagram connections data.',
            note: 'Note: Instagram usually takes 5-30 minutes to prepare your file, but it can take longer depending on your account size.',
            steps: [
                {
                    icon: <FiSettings />,
                    title: 'Instagram Settings',
                    description: 'Open Instagram, go to your profile, tap the three lines menu and select "Settings and Activity".',
                    color: 'from-purple-500 to-indigo-500'
                },
                {
                    icon: <FiUser />,
                    title: 'Accounts Center',
                    description: 'Tap "Accounts Center" at the top, then scroll to "Your information and permissions".',
                    color: 'from-indigo-500 to-blue-500'
                },
                {
                    icon: <FiDownload />,
                    title: 'Download Information',
                    description: 'Select "Download or transfer information", then "Request a download".',
                    color: 'from-blue-500 to-cyan-500'
                },
                {
                    icon: <FiCheck />,
                    title: 'Select Specific Types',
                    description: 'Choose "Some of your information" and find "Followers and Following".',
                    color: 'from-cyan-500 to-teal-500'
                },
                {
                    icon: <FiClock />,
                    title: 'Format & Period',
                    description: 'Crucial: Select JSON format (not HTML) and set Date Range to "All Time".',
                    color: 'from-teal-500 to-orange-500'
                },
                {
                    icon: <FiUpload />,
                    title: 'Upload to IARTY',
                    description: 'Wait for the email from Instagram, download the .zip file, and upload it to our analyzer.',
                    color: 'from-orange-500 to-pink-500'
                }
            ]
        },
        id: {
            back: 'KEMBALI KE DASHBOARD',
            title: 'Cara Ambil Data',
            subtitle: 'Ikuti langkah-langkah berikut untuk mendapatkan data koneksi Instagram Anda dengan aman.',
            note: 'Catatan: Instagram biasanya membutuhkan 5-30 menit untuk menyiapkan file, namun bisa lebih lama tergantung ukuran akun Anda.',
            steps: [
                {
                    icon: <FiSettings />,
                    title: 'Pengaturan Instagram',
                    description: 'Buka Instagram, masuk ke profil, tekan menu garis tiga dan pilih "Pengaturan dan Aktivitas".',
                    color: 'from-purple-500 to-indigo-500'
                },
                {
                    icon: <FiUser />,
                    title: 'Pusat Akun',
                    description: 'Ketuk "Pusat Akun" di bagian atas, lalu cari menu "Informasi dan izin Anda".',
                    color: 'from-indigo-500 to-blue-500'
                },
                {
                    icon: <FiDownload />,
                    title: 'Unduh Informasi',
                    description: 'Pilih "Unduh atau transfer informasi", kemudian pilih "Minta unduhan".',
                    color: 'from-blue-500 to-cyan-500'
                },
                {
                    icon: <FiCheck />,
                    title: 'Pilih Jenis Data',
                    description: 'Pilih "Sebagian informasi Anda" dan centang "Pengikut dan Mengikuti".',
                    color: 'from-cyan-500 to-teal-500'
                },
                {
                    icon: <FiClock />,
                    title: 'Format & Periode',
                    description: 'Penting: Pilih format JSON (bukan HTML) dan atur Rentang Tanggal ke "Sepanjang Waktu".',
                    color: 'from-teal-500 to-orange-500'
                },
                {
                    icon: <FiUpload />,
                    title: 'Unggah ke IARTY',
                    description: 'Tunggu email dari Instagram, unduh file .zip tersebut, dan unggah ke halaman analisis kami.',
                    color: 'from-orange-500 to-pink-500'
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
            {/* Background Decor - Synchronized with Main Page */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={() => window.history.back()}
                            className="group flex items-center gap-2 text-xs font-black tracking-widest text-slate-500 hover:text-purple-600 transition-colors mb-6"
                        >
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform w-4 h-4" />
                            {translations[language].back}
                        </button>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                            Guide <span className="text-transparent bg-clip-text bg-linear-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">Center</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl">
                            {translations[language].subtitle}
                        </p>
                    </motion.div>

                    {/* Language Switcher */}
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
                            whileHover={{ y: -8 }}
                            className="group relative bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Step Number Badge */}
                            <div className="absolute top-6 right-8 text-6xl font-black text-slate-100 dark:text-white/3 pointer-events-none group-hover:text-purple-500/10 transition-colors">
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            <div className={`w-14 h-14 bg-linear-to-tr ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-purple-500/20`}>
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

                {/* Footer Note & CTA */}
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
                            to="/instagram"
                            className="flex items-center gap-2 px-10 py-5 bg-linear-to-r from-purple-600 to-orange-500 text-white rounded-3xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-500/20"
                        >
                            <FiUpload className="w-5 h-5" />
                            SAYA SUDAH PUNYA FILE
                        </Link>
                        <a
                            href="https://accountscenter.instagram.com/your_information_and_permissions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-10 py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl font-black hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                        >
                            BUKA INSTAGRAM <FiExternalLink />
                        </a>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}