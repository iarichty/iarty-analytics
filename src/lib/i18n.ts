/**
 * Tiny zero-dependency i18n layer.
 *
 * The app ships two locales (English + Bahasa Indonesia). Translations live in
 * a flat dictionary keyed by a stable string id, so components can look them up
 * via the `useI18n()` hook. We intentionally avoid a third-party i18n runtime to
 * keep the bundle lean and the mental model simple.
 */

export type Locale = 'en' | 'id';

export const LOCALES: Locale[] = ['en', 'id'];

/** Human-readable label for the language switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
    en: 'English',
    id: 'Bahasa Indonesia',
};

/** Short label (2 letters) for the compact switcher. */
export const LOCALE_SHORT: Record<Locale, string> = {
    en: 'EN',
    id: 'ID',
};

type Dict = Record<string, string>;

const en: Dict = {
    'nav.home': 'Home',
    'nav.instagram': 'Instagram',
    'nav.tiktok': 'TikTok',
    'nav.theme': 'Toggle theme',
    'nav.language': 'Change language',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',

    'common.back': 'Back',
    'common.viewProfile': 'View Profile',
    'common.loading': 'Loading…',
    'common.processing': 'Processing…',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.copy': 'Copy',
    'common.copied': 'Copied!',

    'home.title1': 'IARTY',
    'home.title2': 'Analytics',
    'home.tagline': 'The professional toolkit for social insights.',
    'home.noAccess': 'No account access required.',
    'home.analyzeAccount': 'Analyze Account',
    'home.feature.privacy.title': 'Pure Privacy',
    'home.feature.privacy.desc':
        'Client-side processing. Your data never leaves this browser tab.',
    'home.feature.fast.title': 'Blazing Fast',
    'home.feature.fast.desc':
        'No API limits. Scan thousands of profiles in seconds, right on your device.',
    'home.feature.insights.title': 'Actionable Insights',
    'home.feature.insights.desc':
        'Instantly see who unfollowed you and who you should follow back.',
    'home.ig.desc':
        "Analyze followers, following, and find who isn't following you back instantly.",
    'home.tt.desc':
        'Deep dive into your TikTok connections and track your fan-base growth locally.',
    'home.demo': 'Try with sample data',
    'home.offline': 'Works fully offline',
    'home.comingSoon': 'Coming soon',
    'home.threads.desc':
        'Analyze your Threads connections from your Instagram export — on the way.',
    'home.x.desc': 'Bring your X (Twitter) archive for the same insight — coming soon.',

    'upload.ig.title': 'Upload your ZIP file',
    'upload.ig.desc':
        'Drag your Instagram data export here, or click to choose it from your folder.',
    'upload.ig.button': 'Choose ZIP file',
    'upload.tt.title': 'Upload your TikTok file (.zip)',
    'upload.tt.desc':
        'Make sure you have downloaded your data from TikTok in JSON format.',
    'upload.tt.button': 'Select file now',
    'upload.progress.reading': 'Reading file…',
    'upload.progress.unzipping': 'Unzipping…',
    'upload.progress.parsing': 'Analyzing connections…',
    'upload.preview': 'Detected',
    'upload.previewFollowers': 'followers',
    'upload.previewFollowing': 'following',

    'stat.followers': 'Followers',
    'stat.following': 'Following',
    'stat.notFollowingBack': 'Not Following Back',
    'stat.youDontFollowBack': "You Don't Follow Back",
    'stat.ratio': 'Follower Ratio',
    'stat.mutuals': 'Mutuals',
    'stat.fans': 'Fans',
    'stat.avgFollowAge': 'Avg. Follow Age',
    'stat.days': 'days',

    'tab.notFollowingBack': 'Not Following Back',
    'tab.youDontFollowBack': "You Don't Follow Back",
    'tab.followers': 'Followers',
    'tab.following': 'Following',
    'tab.mutuals': 'Mutuals',
    'tab.fans': 'Fans',

    'search.placeholder': 'Search username…',
    'sort.label': 'Sort order',
    'sort.newest': 'Newest',
    'sort.oldest': 'Oldest',
    'results.empty': 'No results found.',
    'results.copyAll': 'Copy all',
    'results.exportCsv': 'Export CSV',
    'results.exportAll': 'Download all (ZIP)',
    'results.exportPng': 'Save as image',
    'results.selectAll': 'Select all',
    'results.selected': '{count} selected',
    'results.openSelected': 'Open selected',
    'results.exportSummary': 'Export summary',
    'results.popupBlocked': 'Allow pop-ups to open multiple profiles.',
    'a11y.resultCategory': 'Result category',
    'a11y.selectUser': 'Select {name}',

    'insights.title': 'Insights',
    'insights.growth': 'Follower growth',
    'insights.growthEmpty': 'Not enough dated data to chart growth.',
    'insights.mutual': 'Mutual connections',
    'insights.fans': 'Fans (you don\'t follow)',
    'insights.oldest': 'Longest-standing follow',

    'unfollower.title': 'Since your last analysis',
    'unfollower.subtitle': 'Compared with the snapshot saved on {date}.',
    'unfollower.unfollowedYou': 'Unfollowed you',
    'unfollower.newFollowers': 'New followers',
    'unfollower.youUnfollowed': 'You unfollowed',
    'unfollower.youNowFollow': 'You now follow',
    'unfollower.none': 'No changes detected in this category.',

    'footer.analyzed': 'Analyzed {count} accounts — processed entirely in your browser.',

    'demo.banner': 'You are viewing sample data. Upload your own export to see real results.',
};

const id: Dict = {
    'nav.home': 'Beranda',
    'nav.instagram': 'Instagram',
    'nav.tiktok': 'TikTok',
    'nav.theme': 'Ganti tema',
    'nav.language': 'Ganti bahasa',
    'nav.openMenu': 'Buka menu',
    'nav.closeMenu': 'Tutup menu',

    'common.back': 'Kembali',
    'common.viewProfile': 'Lihat Profil',
    'common.loading': 'Memuat…',
    'common.processing': 'Memproses…',
    'common.cancel': 'Batal',
    'common.close': 'Tutup',
    'common.copy': 'Salin',
    'common.copied': 'Tersalin!',

    'home.title1': 'IARTY',
    'home.title2': 'Analytics',
    'home.tagline': 'Perangkat profesional untuk insight media sosial.',
    'home.noAccess': 'Tanpa perlu akses akun.',
    'home.analyzeAccount': 'Analisis Akun',
    'home.feature.privacy.title': 'Privasi Murni',
    'home.feature.privacy.desc':
        'Diproses di sisi klien. Data Anda tidak pernah keluar dari tab browser ini.',
    'home.feature.fast.title': 'Sangat Cepat',
    'home.feature.fast.desc':
        'Tanpa batas API. Pindai ribuan profil dalam hitungan detik, langsung di perangkat Anda.',
    'home.feature.insights.title': 'Insight yang Berguna',
    'home.feature.insights.desc':
        'Ketahui siapa yang berhenti mengikuti Anda dan siapa yang sebaiknya Anda ikuti kembali.',
    'home.ig.desc':
        'Analisis follower, following, dan temukan siapa yang tidak follback secara instan.',
    'home.tt.desc':
        'Telusuri koneksi TikTok Anda dan pantau pertumbuhan followers secara lokal.',
    'home.demo': 'Coba dengan data contoh',
    'home.offline': 'Bekerja sepenuhnya offline',
    'home.comingSoon': 'Segera hadir',
    'home.threads.desc':
        'Analisis koneksi Threads Anda dari export Instagram — segera hadir.',
    'home.x.desc': 'Bawa arsip X (Twitter) Anda untuk insight serupa — segera hadir.',

    'upload.ig.title': 'Unggah file ZIP Anda',
    'upload.ig.desc':
        'Tarik hasil export data Instagram ke sini, atau klik untuk memilih dari folder.',
    'upload.ig.button': 'Pilih file ZIP',
    'upload.tt.title': 'Unggah file TikTok Anda (.zip)',
    'upload.tt.desc':
        'Pastikan Anda sudah mengunduh data dari TikTok dalam format JSON.',
    'upload.tt.button': 'Pilih file sekarang',
    'upload.progress.reading': 'Membaca file…',
    'upload.progress.unzipping': 'Mengekstrak…',
    'upload.progress.parsing': 'Menganalisis koneksi…',
    'upload.preview': 'Terdeteksi',
    'upload.previewFollowers': 'follower',
    'upload.previewFollowing': 'following',

    'stat.followers': 'Follower',
    'stat.following': 'Following',
    'stat.notFollowingBack': 'Tidak Follback',
    'stat.youDontFollowBack': 'Belum Anda Follow',
    'stat.ratio': 'Rasio Follower',
    'stat.mutuals': 'Saling Follow',
    'stat.fans': 'Fans',
    'stat.avgFollowAge': 'Rata-rata Lama Follow',
    'stat.days': 'hari',

    'tab.notFollowingBack': 'Tidak Follback',
    'tab.youDontFollowBack': 'Belum Anda Follow',
    'tab.followers': 'Follower',
    'tab.following': 'Following',
    'tab.mutuals': 'Saling Follow',
    'tab.fans': 'Fans',

    'search.placeholder': 'Cari username…',
    'sort.label': 'Urutan',
    'sort.newest': 'Terbaru',
    'sort.oldest': 'Terlama',
    'results.empty': 'Tidak ada hasil.',
    'results.copyAll': 'Salin semua',
    'results.exportCsv': 'Export CSV',
    'results.exportAll': 'Unduh semua (ZIP)',
    'results.exportPng': 'Simpan sebagai gambar',
    'results.selectAll': 'Pilih semua',
    'results.selected': '{count} dipilih',
    'results.openSelected': 'Buka yang dipilih',
    'results.exportSummary': 'Export ringkasan',
    'results.popupBlocked': 'Izinkan pop-up untuk membuka banyak profil.',
    'a11y.resultCategory': 'Kategori hasil',
    'a11y.selectUser': 'Pilih {name}',

    'insights.title': 'Insight',
    'insights.growth': 'Pertumbuhan follower',
    'insights.growthEmpty': 'Data bertanggal belum cukup untuk menampilkan grafik.',
    'insights.mutual': 'Koneksi saling follow',
    'insights.fans': 'Fans (tidak Anda follow)',
    'insights.oldest': 'Follow terlama',

    'unfollower.title': 'Sejak analisis terakhir',
    'unfollower.subtitle': 'Dibandingkan dengan snapshot yang disimpan pada {date}.',
    'unfollower.unfollowedYou': 'Berhenti mengikuti Anda',
    'unfollower.newFollowers': 'Follower baru',
    'unfollower.youUnfollowed': 'Anda berhenti follow',
    'unfollower.youNowFollow': 'Anda kini follow',
    'unfollower.none': 'Tidak ada perubahan pada kategori ini.',

    'footer.analyzed':
        'Menganalisis {count} akun — diproses sepenuhnya di browser Anda.',

    'demo.banner':
        'Anda melihat data contoh. Unggah hasil export Anda untuk melihat hasil nyata.',
};

const DICTS: Record<Locale, Dict> = { en, id };

/** Look up a translation, interpolating `{name}` placeholders from `vars`. */
export function translate(
    locale: Locale,
    key: string,
    vars?: Record<string, string | number>,
): string {
    const template = DICTS[locale][key] ?? DICTS.en[key] ?? key;
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (_, name: string) =>
        name in vars ? String(vars[name]) : `{${name}}`,
    );
}

/** Best-effort locale detection from the browser, defaulting to English. */
export function detectLocale(): Locale {
    if (typeof navigator === 'undefined') return 'en';
    const lang = navigator.language?.toLowerCase() ?? '';
    if (lang.startsWith('id')) return 'id';
    return 'en';
}
