# IARTY Analytics

Analisis koneksi media sosial Anda (**Instagram** & **TikTok**) dengan aman, cepat, dan transparan — tanpa menyimpan data pribadi. Semua proses berjalan **100% di sisi klien (browser)**, file ZIP Anda tidak pernah dikirim ke server mana pun.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Fitur

- 📊 **Instagram Insights** — temukan siapa yang tidak follback & belum Anda follow.
- 🎵 **TikTok Insights** — analisis follower/following dalam hitungan detik.
- 🕵️ **Deteksi Unfollower** — snapshot otomatis dibandingkan tiap analisis: lihat siapa yang berhenti mengikuti, follower baru, dan perubahan follow Anda.
- 🧠 **Insight Lanjutan** — mutual, fans, follow terlama, rata-rata lama follow, dan **grafik pertumbuhan follower** (SVG native, tanpa library chart).
- 📤 **Export** — unduh per-tab sebagai **CSV**, bundel semua sebagai **ZIP**, atau simpan **ringkasan sebagai gambar PNG**.
- ✅ **Bulk Actions** — pilih banyak akun, salin semua username, atau buka profil terpilih sekaligus.
- 🎲 **Demo Mode** — coba seluruh alur tanpa upload, memakai data contoh yang deterministik.
- 🌐 **Dwibahasa (EN / ID)** — pengalih bahasa dengan deteksi otomatis dari browser.
- 📴 **PWA & Offline** — dapat di-install & bekerja offline (service worker + manifest).
- 🔎 **Filter urut Terbaru / Terlama** + pencarian username.
- 📈 **Progress nyata** saat memproses ZIP (tahap unzip → parsing).
- 🌓 **Dark / Light mode** dengan animasi _circle bloom_ saat berpindah tema.
- 🔢 **Animasi numbering** (count-up) saat data selesai diproses.
- 🔒 **Privasi terjaga** — pemrosesan ZIP sepenuhnya terjadi di browser (JSZip); snapshot hanya menyimpan username, bukan file ZIP.
- 📱 **Responsif** untuk mobile & desktop.

---

## 🚀 Cara Install (untuk clone dari GitHub)

### 1. Prasyarat

Pastikan sudah terpasang di komputer Anda:

| Tool    | Versi minimal | Cek dengan        |
| ------- | ------------- | ----------------- |
| Node.js | `>= 18`       | `node -v`         |
| npm     | `>= 9`        | `npm -v`          |
| Git     | terbaru       | `git --version`   |

> Disarankan memakai Node.js versi **LTS terbaru** (mis. v20 / v22).

### 2. Clone repository

```bash
git clone https://github.com/iarichty/iarty-analytics.git
cd iarty-analytics
```

### 3. Install dependency

```bash
npm install
```

> Jika ingin instalasi yang bersih & dapat direproduksi (sesuai `package-lock.json`):
>
> ```bash
> npm ci
> ```

### 4. Jalankan mode development

```bash
npm run dev
```

Buka browser pada alamat yang ditampilkan di terminal (biasanya **http://localhost:5173**).

### 5. Build untuk production

```bash
npm run build
```

Hasil build akan berada di folder `dist/`.

### 6. Preview hasil build (opsional)

```bash
npm run preview
```

---

## 📜 Daftar Script

| Perintah            | Fungsi                                              |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Menjalankan server development dengan HMR.          |
| `npm run build`     | Type-check (`tsc -b`) + build produksi ke `dist/`.  |
| `npm run typecheck` | Type-check saja, tanpa emit.                        |
| `npm test`          | Menjalankan unit test (Vitest) sekali jalan.        |
| `npm run test:watch`| Menjalankan test dalam mode watch.                  |
| `npm run preview`   | Menjalankan preview dari hasil build produksi.      |
| `npm run lint`      | Menjalankan ESLint ke seluruh proyek.               |

---

## 🗂️ Struktur Proyek

```
iarty-analytics/
├─ public/                 # Aset statis (ikon, gambar) + manifest PWA & sw.js
├─ src/
│  ├─ components/          # Komponen UI (Navbar, Footer, ErrorBoundary, dll.)
│  │  └─ analysis/         #   Komponen bersama halaman analisis
│  ├─ config/              # Konfigurasi aplikasi & metadata SEO
│  ├─ context/             # React Context (tema, i18n)
│  ├─ hooks/               # Custom hooks (useAnalysis)
│  ├─ layouts/             # Layout utama (MainLayout)
│  ├─ lib/                 # Utilitas murni (format, i18n, export, parser + Web Worker)
│  │  └─ analysis/         #   Parser, tipe, snapshot, demo, worker
│  ├─ pages/               # Routing berbasis file (vite-plugin-pages)
│  │  ├─ instagram/        #   → /instagram
│  │  ├─ tiktok/           #   → /tiktok
│  │  └─ [...all].tsx      #   → halaman 404
│  ├─ App.tsx
│  └─ main.tsx
├─ vite.config.ts
├─ tailwind (via @tailwindcss/vite)
└─ package.json
```

> Pemrosesan ZIP/JSON berjalan di **Web Worker** (`src/lib/analysis/analysis.worker.ts`) agar UI tetap responsif untuk file berukuran besar.

> Routing memakai **`vite-plugin-pages`** — setiap file di `src/pages` otomatis menjadi route.

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool) + **vite-plugin-pages** (file-based routing)
- **Tailwind CSS v4**
- **Framer Motion** (animasi)
- **React Router DOM v7**
- **JSZip** (pemrosesan file arsip di browser, dijalankan di Web Worker)
- **React Icons**
- **Zero-dependency extras** — grafik SVG native, i18n dictionary ringan, dan
  PWA manual (service worker + manifest), sehingga bundle tetap ramping.

---

## 🔐 Privasi & Penyimpanan Lokal

Semua analisis file ZIP (data Instagram/TikTok) diproses **sepenuhnya di browser**
menggunakan JSZip. Tidak ada data pribadi yang dikirim atau disimpan di server.

Fitur **Deteksi Unfollower** menyimpan *snapshot* ringan di `localStorage` —
hanya daftar **username + timestamp** (bukan file ZIP) — agar dapat membandingkan
perubahan antar sesi. Snapshot ini per-platform, hanya di perangkat Anda, dan
dapat dihapus dengan membersihkan data situs pada browser.

---

## ☁️ Deploy

Proyek ini sudah menyertakan `vercel.json` dengan rewrites SPA, sehingga paling mudah di-deploy ke **Vercel**:

1. Push repository ini ke GitHub.
2. Import project di [vercel.com](https://vercel.com).
3. Vercel otomatis mendeteksi Vite — gunakan pengaturan default:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy. Selesai! 🎉

> Untuk platform lain (Netlify, GitHub Pages, dll.), pastikan build output `dist/` dan terapkan SPA fallback ke `index.html`. **Penting:** kecualikan `/sw.js` dan `/manifest.webmanifest` dari SPA fallback agar PWA berfungsi (lihat `vercel.json` sebagai contoh).

---

## 🧩 Menambah Platform Baru

Arsitektur sudah disiapkan untuk platform tambahan:

1. Tambahkan entri di `src/lib/platforms.ts` (id, nama, ikon, gradient, rute).
2. Buat parser murni di `src/lib/analysis/parsers.ts` (worker-safe).
3. Daftarkan parser di `src/lib/analysis/analysis.worker.ts` (`parseXZip`).
4. Buat halaman `src/pages/<id>/index.tsx` dengan `AnalyzePageConfig`
   (mirip `src/pages/instagram/index.tsx`).
5. Tambahkan ikon di `public/img/`.

Platform yang direncanakan (Threads, X) sudah tampil sebagai kartu *coming soon*
di halaman utama — cukup ubah `comingSoon` menjadi `false` setelah selesai.

---

## 🌐 Internasionalisasi (i18n)

Teks UI terpusat di `src/lib/i18n.ts` (dua locale: `en` + `id`), diakses lewat
hook `useI18n()` → `t('key')`. Untuk menambah bahasa, tambahkan kamus di file itu
dan daftarkan pada `DICTS` + `LOCALES`.

---

## 🤝 Kontribusi

1. Fork repository ini.
2. Buat branch fitur: `git checkout -b fitur/nama-fitur`.
3. Commit perubahan: `git commit -m "feat: tambah fitur X"`.
4. Push: `git push origin fitur/nama-fitur`.
5. Buka Pull Request.

---

## 📄 Lisensi

Dirilis di bawah lisensi **MIT** — lihat file [LICENSE](./LICENSE).

© PT IARTY TEKNOLOGI DIGITAL

---

## 🔗 Tautan

- Website: [iarty.id](https://iarty.id)
- Developer: [fiqtor.com](https://fiqtor.com)
- GitHub: [github.com/iarichty](https://github.com/iarichty)
