# Step Clean - Website Jasa Cuci Sepatu (UTS Pemrograman Web)

Nikmal Maulina Arba'ani - Kelas 2025C - D-4 Manajemen Informatika, Universitas Negeri Surabaya

Website ini dibuat berdasarkan proposal "Perancangan Sistem Website Cuci Sepatu". Menggunakan tema warna: biru-putih.

## Item dan Isi
| Item | Isi | 
|------|-----|
| 2a | Homepage / layout utama (`index.html`) | 
| 2b | Halaman Layanan, filter paket, kalkulator estimasi harga (`pages/layanan.html`) | 
| 2c | Form booking + validasi jQuery (`pages/booking.html`) | 

## Fitur
- **2a Layout utama:** responsive (Bootstrap 5 + CSS sendiri), menu navbar yang memuat halaman 2b dan 2c dengan **Ajax** (`$.load`) tanpa reload, memakai gambar SVG (`assets/img`).
- **2b Layanan:** daftar 6 paket dari data `SERVICES`, filter kategori (Reguler / Perawatan Khusus / Premium), pencarian nama, pengurutan harga/waktu, dan **kalkulator estimasi harga** (jumlah sepatu, diskon 10% untuk 3 sepatu atau lebih, express +20%, biaya jemput/antar, tanggal estimasi selesai). Tombol "Pesan dengan pilihan ini" membawa pilihan ke form booking.
- **2c Booking:** form sesuai tabel `customers`, `shoes`, `orders`, `pickup_delivery`. Validasi jQuery (nama, WhatsApp, jumlah, jenis sepatu, foto JPG/PNG maks 2 MB, alamat, tanggal/jam jemput) sebelum dikirim ke `proses_booking.php` lewat HTTP POST. Server memvalidasi ulang dan menyimpan ke MySQL, lalu mengembalikan nomor pesanan.

## Struktur folder
```
index.html            layout utama (2a)
css/style.css         gaya biru-putih
js/app.js             data layanan, router Ajax
js/layanan.js         logika halaman 2b
js/booking.js         validasi dan submit form 2c
pages/layanan.html    halaman 2b (dimuat Ajax)
pages/booking.html    halaman 2c (dimuat Ajax)
proses_booking.php    penerima form (PHP + PDO)
database.sql          struktur tabel + data layanan
assets/img/           gambar
uploads/              foto sepatu dari pelanggan
```

## Cara menjalankan
1. Membuat folder stepclean yang berisi `database.sql`, `index.html`, `booking.js`,`layanan.js`, `app.js`, `style.css`, asset/image, dan uploads.
2. Salin folder ke `htdocs` (XAMPP), mis. `C:\xampp\htdocs\stepclean`.
3. Aktifkan Apache dan MySQL, lalu impor `database.sql` lewat phpMyAdmin.
4. Buka `http://localhost/stepclean/`. (lebih dirasankan dibuka lewat ini)

Halaman harus dibuka lewat web server. Jika `index.html` dibuka langsung (`file://`), Ajax diblokir browser.
Koneksi database di `proses_booking.php`: user `root`, password kosong (default XAMPP).

## Catatan
- Harga, biaya antar-jemput, dan diskon adalah data contoh (placeholder) sesuai batasan masalah di proposal.
- Pembayaran online dan notifikasi WhatsApp belum termasuk cakupan dalam versi ini.
