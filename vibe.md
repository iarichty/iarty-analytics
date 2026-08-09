# Role
Kamu adalah Expert Frontend Developer dan UI/UX Designer. Buatkan saya sebuah Landing Page yang responsif, modern, dan memiliki performa tinggi.

# Project Overview
Nama Brand: Ijjo Cafe
Tagline: "Kopi Tiada Henti" & "Cozy Corner for WFC"
Target Audiens: Gen-Z dan Milenial, pelajar, pekerja remote (WFC), komunitas.
Vibe/Estetika: Cozy, clean, modern, warm, dengan sentuhan alam/bumi (menggunakan warna hijau khas brand sebagai warna primer).

# Tech Stack
- Framework: React (dengan Vite)
- Styling: Tailwind CSS (untuk layouting dan styling yang cepat & konsisten)
- Icons: `react-icons` (khususnya dari set Fa/Fi/Md)
- Animasi (Opsional tapi disarankan): Framer Motion (untuk transisi halus)

# Color Palette & Typography
- Primary Color: Emerald/Forest Green (merujuk pada logo bulat Ijjo Cafe). Hex referensi: `#166534` atau `bg-green-800`.
- Secondary Color: Warm White / Cream (untuk background agar terasa cozy seperti kopi susu). Hex referensi: `#FAFAF9` atau `#F5F5F4`.
- Accent Color: Soft Brown / Wood.
- Typography: Gunakan font Sans-Serif yang modern dan mudah dibaca (misal: 'Inter', 'Poppins', atau 'Plus Jakarta Sans').

# Core Layout & Sections

1. **Navbar (Sticky & Glassmorphism)**
   - Kiri: Logo text "Ijjo Cafe" (font bold, warna hijau primer).
   - Tengah (Desktop): Link navigasi (Home, About, Menu, Gallery).
   - Kanan: Tombol CTA "Reservasi".
   - Mobile: Hamburger menu yang membuka *drawer* atau *dropdown*.

2. **Hero Section**
   - Headline: "Kopi Tiada Henti. Cozy Corner for WFC."
   - Sub-headline: "Tempat nongkrong asik dan ruang produktifmu di Surabaya. Buka setiap hari 11.00 - 23.00."
   - CTA Buttons: 
     - Primary: "Lihat Menu"
     - Secondary: "Promo Hari Ini" (Merujuk ke promo seperti Beli 2 Gratis 1 / Meeting Room 30k).
   - Background: Gunakan gambar placeholder estetik suasana cafe/kopi dengan overlay gradient gelap agar teks terbaca jelas.

3. **About Section**
   - Deskripsi singkat tentang Ijjo cafe sebagai tempat yang ramah untuk bekerja, kumpul komunitas, dan bersantai.
   - Cantumkan informasi jam operasional: 11.00 AM - 23.00 PM.

4. **Menu Section (Sesuai Request)**
   - Buat Grid layout untuk menampilkan kategori menu (contoh: Signature Coffee, Non-Coffee, Snack).
   - Gunakan Card UI yang clean. Setiap card menampilkan gambar (placeholder), nama menu, dan deskripsi singkat.
   - Tambahkan *badge* khusus untuk item promo (misal: "Promo Meeting Room 30k!").

5. **Instagram/Gallery Section**
   - Tampilkan masonry grid atau grid 3-kolom yang menyerupai *feed* Instagram.
   - Gunakan gambar placeholder yang mensimulasikan foto-foto kebersamaan pelanggan, kopi, dan interior cafe.

6. **Footer**
   - Informasi kontak, alamat lengkap (gunakan placeholder jalan, kota).
   - Social Media Links menggunakan `react-icons`:
     - Instagram (`FaInstagram`)
     - TikTok (`FaTiktok`)
     - WhatsApp (`FaWhatsapp`)
   - Copyright text.

# Special Features (Crucial)

**1. Floating Contact Button (WhatsApp)**
   - Buat tombol *floating action button* (FAB) di pojok kanan bawah layar (`fixed bottom-6 right-6`).
   - Tampilan: Bentuk lingkaran dengan shadow tebal, background warna hijau WhatsApp (`#25D366`), di tengahnya terdapat icon WhatsApp dari `react-icons` (`FaWhatsapp` warna putih).
   - Behavior: Tambahkan efek *pulse* atau *bounce* perlahan agar menarik perhatian.
   - Action: Ketika di-klik, harus men-direct user ke link: `https://wa.me/6281359178266`.

# Developer Instructions
1. Tolong buatkan struktur komponen modular (pisahkan komponen Navbar, Hero, Menu, Footer, FloatingContact).
2. Pastikan web responsif 100% (Mobile-first approach dengan Tailwind).
3. Jangan gunakan library eksternal selain yang disebutkan di Tech Stack.
4. Tulis kode dengan rapi, berikan komentar pada bagian-bagian penting.
5. Gunakan dummy data array untuk me-render daftar Menu agar kodenya bersih dan mudah saya ubah nantinya.