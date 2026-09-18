import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    FiUploadCloud,
    FiHelpCircle, FiArrowLeft, FiSearch, FiExternalLink, FiBarChart2,
    FiUsers, FiUserMinus, FiArrowUp, FiArrowDown
} from "react-icons/fi";
import AppConfig from "@/config/AppConfig";
import { Link } from "react-router-dom";

interface TikTokUser {
    Date: string;
    UserName: string;
}

interface TikTokData {
    "Profile And Settings": {
        Follower: { FansList: TikTokUser[] };
        Following: { Following: TikTokUser[] };
    };
}

export default function TikTokAnalyze() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [followers, setFollowers] = useState<TikTokUser[]>([]);
    const [following, setFollowing] = useState<TikTokUser[]>([]);
    const [nonFollowbacks, setNonFollowbacks] = useState<TikTokUser[]>([]);
    const [nonFollowing, setNonFollowing] = useState<TikTokUser[]>([]);
    const [activeTab, setActiveTab] = useState<'nonFollowbacks' | 'nonFollowing'>('nonFollowbacks');
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();
            const arrayBuffer = await file.arrayBuffer();
            const zipContent = await zip.loadAsync(arrayBuffer);

            const jsonFile = zipContent.file(/user_data_tiktok\.json$/i)[0];
            if (!jsonFile) throw new Error("File 'user_data_tiktok.json' tidak ditemukan dalam ZIP.");

            const jsonContent = await jsonFile.async("text");
            const data = JSON.parse(jsonContent) as TikTokData;

            const followersData = data["Profile And Settings"]?.Follower?.FansList || [];
            const followingData = data["Profile And Settings"]?.Following?.Following || [];

            if (followersData.length === 0 && followingData.length === 0)
                throw new Error("Data kosong atau format TikTok tidak sesuai.");

            setFollowers(followersData);
            setFollowing(followingData);

            const followerNames = new Set(followersData.map(u => u.UserName));
            const followingNames = new Set(followingData.map(u => u.UserName));

            setNonFollowbacks(followingData.filter(u => !followerNames.has(u.UserName)));
            setNonFollowing(followersData.filter(u => !followingNames.has(u.UserName)));

        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memproses file.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredList = useMemo(() => {
        const list = activeTab === 'nonFollowbacks' ? nonFollowbacks : nonFollowing;
        const filtered = list.filter(user =>
            user.UserName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return [...filtered].sort((a, b) => {
            const ta = new Date(a.Date).getTime() || 0;
            const tb = new Date(b.Date).getTime() || 0;
            return sortOrder === 'newest' ? tb - ta : ta - tb;
        });
    }, [activeTab, nonFollowbacks, nonFollowing, searchQuery, sortOrder]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    useEffect(() => {
        document.title = `TikTok Analyze ${AppConfig.exTitle}`;
    }, []);

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f13] text-gray-900 dark:text-white transition-colors duration-300 selection:bg-[#fe2c55]/20">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#fe2c55] rounded-full blur-[150px] opacity-5 dark:opacity-10" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#25f4ee] rounded-full blur-[150px] opacity-5 dark:opacity-10" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-32">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <button
                            onClick={() => window.history.back()}
                            className="group flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-500 hover:text-[#fe2c55] transition-colors mb-4 uppercase tracking-widest"
                        >
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            Kembali
                        </button>
                        <h1 className="text-5xl font-black italic tracking-tighter">
                            TIKTOK{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#fe2c55] via-purple-500 to-[#25f4ee]">
                                INSIGHTS
                            </span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                            Analisis interaksi follower TikTok Anda dalam hitungan detik.
                        </p>
                    </div>

                    <Link
                        to="/tiktok/how-analyze-works"
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm dark:backdrop-blur-md"
                    >
                        <FiHelpCircle className="text-[#fe2c55]" />
                        Panduan Data
                    </Link>
                </div>

                {/* Upload Area */}
                {!followers.length && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="relative group overflow-hidden bg-white dark:bg-[#1a1a20] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[3rem] p-16 text-center transition-all hover:border-[#fe2c55]/50 shadow-sm dark:shadow-none">
                            <div className="w-24 h-24 bg-linear-to-br from-[#fe2c55] to-[#25f4ee] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(254,44,85,0.25)] group-hover:scale-110 transition-transform duration-500">
                                <FiUploadCloud className="text-white w-12 h-12" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Unggah File TikTok (.zip)</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto">
                                Pastikan Anda telah mengunduh data dalam format <b>JSON</b> dari pengaturan TikTok Anda.
                            </p>

                            <input
                                type="file"
                                accept=".zip"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                disabled={isLoading}
                            />

                            <div className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-black text-lg hover:opacity-90 transition-all">
                                {isLoading ? "Sedang Memproses..." : "PILIH FILE SEKARANG"}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Dashboard Results */}
                <AnimatePresence>
                    {followers.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard label="Followers" value={followers.length} accent="#6366f1" icon={<FiUsers />} />
                                <StatCard label="Following" value={following.length} accent="#25f4ee" icon={<FiUsers />} />
                                <StatCard label="No Follback" value={nonFollowbacks.length} accent="#fe2c55" icon={<FiUserMinus />} />
                                <StatCard
                                    label="Friend Ratio"
                                    value={((followers.length / following.length) || 0).toFixed(1)}
                                    accent="#a855f7"
                                    icon={<FiBarChart2 />}
                                    isRatio
                                />
                            </div>

                            {/* Main Content */}
                            <div className="bg-white dark:bg-[#1a1a20] rounded-[2.5rem] border border-gray-200 dark:border-white/5 overflow-hidden shadow-xl dark:shadow-2xl">
                                <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2 flex flex-col md:flex-row justify-between gap-6">
                                    {/* Tabs */}
                                    <div className="flex p-1.5 bg-gray-100 dark:bg-black/40 rounded-2xl w-fit border border-gray-200 dark:border-white/5">
                                        <button
                                            onClick={() => setActiveTab('nonFollowbacks')}
                                            className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'nonFollowbacks'
                                                ? 'bg-[#fe2c55] text-white shadow-lg'
                                                : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}
                                        >
                                            TIDAK FOLLBACK
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('nonFollowing')}
                                            className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'nonFollowing'
                                                ? 'bg-[#25f4ee] text-black shadow-lg'
                                                : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}
                                        >
                                            BELUM DI FOLLBACK
                                        </button>
                                    </div>

                                    {/* Search & Sort */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <div className="relative">
                                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Cari Username..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-3 outline-none focus:border-[#fe2c55] focus:ring-2 focus:ring-[#fe2c55]/20 transition-all w-full md:w-80 text-gray-900 dark:text-white placeholder:text-gray-400"
                                            />
                                        </div>

                                        {/* Sort Filter */}
                                        <div className="flex p-1.5 bg-gray-100 dark:bg-black/40 rounded-2xl w-fit border border-gray-200 dark:border-white/5">
                                            <SortButton
                                                active={sortOrder === 'newest'}
                                                onClick={() => setSortOrder('newest')}
                                                label="TERBARU"
                                                icon={<FiArrowDown className="w-3.5 h-3.5" />}
                                            />
                                            <SortButton
                                                active={sortOrder === 'oldest'}
                                                onClick={() => setSortOrder('oldest')}
                                                label="TERLAMA"
                                                icon={<FiArrowUp className="w-3.5 h-3.5" />}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-125 overflow-y-auto pr-4">
                                        {filteredList.map((user, idx) => (
                                            <motion.div
                                                layout
                                                key={idx}
                                                className="group relative p-6 bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-3xl hover:bg-gray-100 dark:hover:bg-white/6 hover:border-gray-200 dark:hover:border-white/10 transition-all"
                                            >
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#fe2c55]/10 to-[#25f4ee]/10 dark:from-[#fe2c55]/20 dark:to-[#25f4ee]/20 flex items-center justify-center font-black text-xl text-[#fe2c55] border border-gray-200 dark:border-white/10">
                                                        {user.UserName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-lg truncate tracking-tight text-gray-900 dark:text-white">{user.UserName}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">Aktif: {formatDate(user.Date)}</p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={`https://www.tiktok.com/@${user.UserName}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-[#fe2c55] hover:text-white hover:border-[#fe2c55] dark:hover:bg-white dark:hover:text-black rounded-xl text-xs font-black transition-all uppercase tracking-widest text-gray-700 dark:text-gray-300"
                                                >
                                                    Profil TikTok <FiExternalLink />
                                                </a>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {filteredList.length === 0 && (
                                        <div className="text-center py-20 bg-gray-50 dark:bg-black/20 rounded-3xl border border-dashed border-gray-200 dark:border-white/5">
                                            <FiBarChart2 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                                            <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Data Tidak Ditemukan</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-8 p-6 bg-red-50 dark:bg-[#fe2c55]/10 border border-red-200 dark:border-[#fe2c55]/20 rounded-3xl text-red-600 dark:text-[#fe2c55] text-center font-black"
                    >
                        {error}
                    </motion.div>
                )}
            </main>
        </div>
    );
}

function StatCard({ label, value, accent, icon, isRatio }: {
    label: string;
    value: number | string;
    accent: string;
    icon: React.ReactNode;
    isRatio?: boolean;
}) {
    return (
        <div className="bg-white dark:bg-[#1a1a20] p-6 rounded-4xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</p>
                <span className="text-lg" style={{ color: accent }}>{icon}</span>
            </div>
            <h3 className="text-4xl font-black italic tabular-nums" style={{ color: accent }}>
                {isRatio
                    ? value
                    : <AnimatedNumber value={Number(value)} />}
            </h3>
        </div>
    );
}

// Angka yang menghitung naik saat data masuk
function AnimatedNumber({ value }: { value: number }) {
    const motionValue = useMotionValue(0);
    const spring = useSpring(motionValue, { stiffness: 70, damping: 18, mass: 1 });
    const display = useTransform(spring, (latest) =>
        Math.round(latest).toLocaleString('id-ID')
    );

    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    return <motion.span>{display}</motion.span>;
}

function SortButton({
    active, onClick, label, icon,
}: {
    active: boolean;
    onClick: () => void;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-colors ${
                active
                    ? 'text-black'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
            }`}
        >
            {active && (
                <motion.span
                    layoutId="tt-sort-pill"
                    className="absolute inset-0 bg-[#25f4ee] shadow-lg rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
            )}
            {icon}
            {label}
        </button>
    );
}