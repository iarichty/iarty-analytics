import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiUploadCloud, FiUsers, FiUserPlus, FiUserX,
    FiArrowLeft, FiSearch, FiInstagram, FiInfo
} from "react-icons/fi";
import AppConfig from "@/config/AppConfig";
import { Link } from "react-router-dom";

interface InstagramUser {
    string_list_data: Array<{
        href: string;
        timestamp: number;
        value: string;
    }>;
}

export default function InstagramAnalyze() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [followers, setFollowers] = useState<InstagramUser[]>([]);
    const [following, setFollowing] = useState<InstagramUser[]>([]);
    const [nonFollowbacks, setNonFollowbacks] = useState<InstagramUser[]>([]);
    const [nonFollowing, setNonFollowing] = useState<InstagramUser[]>([]);
    const [activeTab, setActiveTab] = useState<'nonFollowbacks' | 'nonFollowing'>('nonFollowbacks');
    const [searchQuery, setSearchQuery] = useState("");

    // Logika Pemrosesan File
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsLoading(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const JSZip = (await import('jszip')).default;
                    const zip = new JSZip();
                    const zipContent = await zip.loadAsync(e.target?.result as ArrayBuffer);

                    const followersFile = zipContent.file("connections/followers_and_following/followers_1.json");
                    const followingFile = zipContent.file("connections/followers_and_following/following.json");

                    if (!followersFile || !followingFile) {
                        throw new Error("Struktur file tidak valid. Pastikan Anda mengunggah ZIP dari Instagram.");
                    }

                    const followersData = JSON.parse(await followersFile.async("text"));
                    const followingRawData = JSON.parse(await followingFile.async("text"));
                    const followingData = followingRawData.relationships_following;

                    setFollowers(followersData);
                    setFollowing(followingData);

                    // Filter Logic
                    const followerHrefs = new Set(followersData.map((f: any) => f.string_list_data[0].href));
                    const followingHrefs = new Set(followingData.map((f: any) => f.string_list_data[0].href.replace('/_u', '')));

                    setNonFollowbacks(followingData.filter((f: any) => !followerHrefs.has(f.string_list_data[0].href.replace('/_u', ''))));
                    setNonFollowing(followersData.filter((f: any) => !followingHrefs.has(f.string_list_data[0].href)));

                } catch (err) {
                    setError("Gagal memproses file. Pastikan format JSON sesuai.");
                } finally {
                    setIsLoading(false);
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (err) {
            setError("Terjadi kesalahan sistem.");
            setIsLoading(false);
        }
    };

    // Filter berdasarkan search query
    const filteredList = useMemo(() => {
        const list = activeTab === 'nonFollowbacks' ? nonFollowbacks : nonFollowing;
        return list.filter(user =>
            user.string_list_data[0].href.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeTab, nonFollowbacks, nonFollowing, searchQuery]);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-400 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-32">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <button
                            onClick={() => window.history.back()}
                            className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors mb-4"
                        >
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            BACK TO DASHBOARD
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Instagram <span className="text-transparent bg-clip-text bg-linear-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">Insights</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Temukan siapa yang tidak mengikuti Anda kembali secara instan.</p>
                    </div>

                    <Link
                        to="/instagram/how-analyze-works"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        <FiInfo className="text-purple-500" />
                        Cara Ambil Data
                    </Link>
                </div>

                {/* Upload Section */}
                {!followers.length && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-orange-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-white dark:bg-gray-900 border-2 border-dashed border-slate-200 dark:border-white/10 p-12 rounded-[2.5rem] text-center transition-all">
                            <div className="w-20 h-20 bg-linear-to-tr from-purple-500 to-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform">
                                <FiUploadCloud className="text-white w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Unggah File ZIP Anda</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">Tarik file data Instagram Anda ke sini atau klik untuk memilih dari folder.</p>

                            <input
                                type="file"
                                accept=".zip"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isLoading}
                            />

                            <div className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white dark:text-black text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all">
                                {isLoading ? "Memproses..." : "Pilih File ZIP"}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Results Section */}
                <AnimatePresence>
                    {followers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatsCard label="Followers" value={followers.length} icon={<FiUsers />} color="blue" />
                                <StatsCard label="Following" value={following.length} icon={<FiUserPlus />} color="purple" />
                                <StatsCard label="Unfoll Back" value={nonFollowbacks.length} icon={<FiUserX />} color="red" />
                                <StatsCard label="Not Followed" value={nonFollowing.length} icon={<FiInstagram />} color="orange" />
                            </div>

                            {/* Main Analysis Card */}
                            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5">
                                <div className="p-8 border-b border-slate-100 dark:border-white/5">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        {/* Tabs */}
                                        <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit">
                                            <TabButton
                                                active={activeTab === 'nonFollowbacks'}
                                                onClick={() => setActiveTab('nonFollowbacks')}
                                                label="Tidak Follback"
                                            />
                                            <TabButton
                                                active={activeTab === 'nonFollowing'}
                                                onClick={() => setActiveTab('nonFollowing')}
                                                label="Belum Anda Follow"
                                            />
                                        </div>

                                        {/* Search */}
                                        <div className="relative">
                                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Cari username..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-64 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* List Grid */}
                                <div className="p-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-150 overflow-y-auto pr-2">
                                        {filteredList.map((user, idx) => (
                                            <motion.div
                                                layout
                                                key={idx}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group p-5 bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5 rounded-3xl hover:border-purple-500/50 transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-linear-to-tr from-purple-100 to-orange-100 dark:from-purple-900/20 dark:to-orange-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xl">
                                                        {getCleanUsername(user, activeTab).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold truncate text-slate-800 dark:text-white">
                                                            {getCleanUsername(user, activeTab)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Sejak {formatDate(user.string_list_data[0].timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={user.string_list_data[0].href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-4 block w-full py-2 text-center text-xs font-bold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all"
                                                >
                                                    Lihat Profil
                                                </a>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {filteredList.length === 0 && (
                                        <div className="text-center py-20">
                                            <p className="text-slate-500 font-medium">Tidak ada hasil yang ditemukan.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/30 text-center font-bold"
                    >
                        {error}
                    </motion.div>
                )}
            </main>
        </div>
    );
}

// --- Sub-Components ---

function StatsCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
    const colors: Record<string, string> = {
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
        red: "text-red-600 bg-red-50 dark:bg-red-900/20",
        orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-4xl border border-slate-200 dark:border-white/10 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</p>
            <h4 className="text-3xl font-black mt-1">{value}</h4>
        </div>
    );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${active
                ? 'bg-white dark:bg-white/10 shadow-md text-purple-600 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
        >
            {label}
        </button>
    );
}

function getCleanUsername(user: InstagramUser, tab: string) {
    const href = user.string_list_data[0].href;
    return tab === 'nonFollowbacks'
        ? href.replace('https://www.instagram.com/_u/', '')
        : href.replace('https://www.instagram.com/', '');
}

// Suppress unused import warning for AppConfig (used for page title pattern)
void AppConfig;