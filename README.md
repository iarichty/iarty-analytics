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
- 🌓 **Dark / Light mode** dengan animasi _circle bloom_ saat berpindah tema.
- 🧭 **Navbar** dengan indikator menu aktif yang meluncur halus (smooth sliding pill).
- 🔎 **Filter urut Terbaru / Terlama** + pencarian username.
- 🔢 **Animasi numbering** (count-up) saat data selesai diproses.
- 🔒 **Privasi terjaga** — pemrosesan ZIP sepenuhnya terjadi di browser (JSZip).
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

| Perintah          | Fungsi                                              |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Menjalankan server development dengan HMR.          |
| `npm run build`   | Type-check (`tsc -b`) + build produksi ke `dist/`.  |
| `npm run preview` | Menjalankan preview dari hasil build produksi.      |
| `npm run lint`    | Menjalankan ESLint ke seluruh proyek.               |

---

## 🗂️ Struktur Proyek

```
iarty-analytics/
├─ public/                 # Aset statis (ikon, gambar)
├─ src/
│  ├─ components/          # Komponen UI (Navbar, Footer, dll.)
│  ├─ config/              # Konfigurasi aplikasi
│  ├─ context/             # React Context (ThemeContext)
│  ├─ layouts/             # Layout utama (MainLayout)
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

> Routing memakai **`vite-plugin-pages`** — setiap file di `src/pages` otomatis menjadi route.

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool) + **vite-plugin-pages** (file-based routing)
- **Tailwind CSS v4**
- **Framer Motion** (animasi)
- **React Router DOM v7**
- **JSZip** (pemrosesan file arsip di browser)
- **React Icons**
- **Redux Toolkit**, **Recharts**, **Chart.js**, **GSAP**, **Three.js** (siap pakai)

---

## ☁️ Deploy

Proyek ini sudah menyertakan `vercel.json` dengan rewrites SPA, sehingga paling mudah di-deploy ke **Vercel**:

1. Push repository ini ke GitHub.
2. Import project di [vercel.com](https://vercel.com).
3. Vercel otomatis mendeteksi Vite — gunakan pengaturan default:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy. Selesai! 🎉

> Untuk platform lain (Netlify, GitHub Pages, dll.), pastikan build output `dist/` dan terapkan SPA fallback ke `index.html`.

---

## 🔐 Privasi

Semua analisis file ZIP (data Instagram/TikTok) diproses **sepenuhnya di browser** menggunakan JSZip. Tidak ada data pribadi yang dikirim atau disimpan di server.

---

## 🤝 Kontribusi

1. Fork repository ini.
2. Buat branch fitur: `git checkout -b fitur/nama-fitur`.
3. Commit perubahan: `git commit -m "feat: tambah fitur X"`.
4. Push: `git push origin fitur/nama-fitur`.
5. Buka Pull Request.

---

## 📄 Lisensi

© IARTY GROUP. No rights reserved.

---

## 🔗 Tautan

- Website: [iarty.id](https://iarty.id)
- Developer: [fiqtor.com](https://fiqtor.com)
- GitHub: [github.com/iarichty](https://github.com/iarichty)
