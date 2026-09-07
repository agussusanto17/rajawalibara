# Website PT Rajawali Bara Yudha Perkasa

Situs perusahaan beserta CMS-nya. Next.js 16 (App Router), Prisma 7 di atas
MySQL, Better Auth, Tailwind v4.

Basisnya diambil dari project `btu-web` — CMS, autentikasi, dan mekanisme
seed-nya dipakai ulang; desain, model konten, dan seluruh datanya ditulis ulang
untuk perdagangan batubara.

---

## Struktur folder

```
Rajawalibara/
├── web/              ← aplikasi Next.js. INI yang jadi repo git.
├── media/            ← folder unggahan lokal (MEDIA_DIR). Di luar repo.
└── dokumen-klien/    ← NIB, company profile, KTP. JANGAN masuk git.
```

Folder unggahan sengaja berada DI LUAR direktori aplikasi. Deploy berbasis Git
menyetel ulang isi direktori kerja: berkas unggahan yang ada di dalamnya akan
hilang pada deploy berikutnya, tanpa galat, dan baru ketahuan saat gambar di
situs berubah jadi kotak kosong. Aplikasi menolak jalan bila `MEDIA_DIR`
ternyata mengarah ke dalam direktori aplikasi.

---

## Menjalankan di lokal

Butuh Node.js 20.12+ dan MySQL 8 (atau MariaDB 10.6+).

```bash
# 1. basis data
mysql -u root -e "CREATE DATABASE rajawalibara CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. konfigurasi
cd web
cp .env.example .env.local     # lalu isi DATABASE_URL dan MEDIA_DIR
mkdir -p ../media

# 3. dependensi + Prisma Client
npm install                    # postinstall menjalankan `prisma generate`

# 4. skema + data awal
npm run db:deploy              # prisma migrate deploy
npm run cms:benih              # data awal dari lib/site.ts (idempoten)
npm run cms:akun               # akun CMS pertama

# 5. jalan
npm run dev
```

Situs di `http://localhost:3000`, CMS di `/admin`.

### Perintah

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` / `npm start` | Build dan jalankan produksi |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:deploy` | Terapkan migrasi |
| `npm run db:status` | Status migrasi |
| `npm run cms:benih` | Tanam data awal (aman diulang) |
| `npm run cms:akun` | Buat akun CMS / setel ulang sandi |

---

## Deploy ke Hostinger

Paket Node.js, deploy lewat koneksi GitHub. Repo git berakar di `web/`,
sehingga `package.json` berada di akar repo — itu yang dicari penjalan
aplikasi Hostinger.

**1. `output: "standalone"` tidak dipakai.** Mode itu ada di project asal
khusus untuk image Docker; keluarannya menuntut `public/` dan `.next/static`
disalin manual ke sebelah `server.js`, dan penjalan Hostinger tidak melakukan
itu. Hasilnya situs tayang tanpa satu pun CSS atau gambar. `next start` biasa
yang dipakai.

**2. Variabel lingkungan diisi di hPanel**, bukan lewat berkas `.env` di repo —
deploy menyetel ulang direktori kerja, jadi berkasnya akan hilang.
`NEXT_PUBLIC_*` dibaca **saat proses mulai** dan ikut terbundel ke peramban:
setiap perubahannya menuntut restart aplikasi, dan tanpa restart nilainya
terbaca kosong tanpa galat apa pun.

**3. Migrasi tidak berjalan sendiri.** Tidak ada pipeline. Jalankan
`npx prisma migrate deploy` lewat perintah build/post-deploy di hPanel atau
lewat SSH, dan **pastikan selesai SEBELUM aplikasi menerima trafik**. Di
project asal urutan yang terbalik menimbulkan jendela galat 500 tiap kali ada
migrasi baru.

**4. `MEDIA_DIR` mengarah ke luar direktori aplikasi**, misalnya
`/home/u123456/unggahan-rajawalibara`. Buat foldernya sekali, lalu jangan
sentuh lagi — isinya bertahan lintas deploy.

### Urutan deploy yang benar

```
push ke GitHub → build → prisma migrate deploy → restart aplikasi
```

---

## Struktur halaman

Empat halaman, sesuai lingkup yang disepakati:

| Jalur | Isi |
| --- | --- |
| `/` | Hero slider foto, pita legalitas, tentang singkat, layanan, rantai pasok, klien, angka, testimoni |
| `/tentang-kami` | Profil, visi & misi, nilai, perjalanan, keunggulan, struktur organisasi |
| `/layanan` | Tiga lini layanan, tabel spesifikasi, alur pemesanan, bidang usaha (KBLI), FAQ |
| `/hubungi-kami` | Kanal kontak, formulir, peta, dua alamat kantor |

Empat, dan hanya empat. `/produk` dan `/artikel` sudah DIHAPUS dari situs
publik:

- **Spesifikasi** kini hidup sepenuhnya di `/layanan` sebagai satu tabel
  perbandingan — parameter jadi baris, tingkatan jadi kolom. Yang dikerjakan
  bagian pengadaan saat memilih batubara adalah membandingkan, dan empat
  halaman terpisah memaksa perbandingan itu disalin ke spreadsheet sendiri.
- **Artikel** belum punya satu pun tulisan, dan halaman kosong yang bisa
  terindeks Google lebih merugikan daripada tidak ada halamannya.

CMS keduanya tetap utuh di `/admin`. Model `Produk` masih menyimpan deskripsi,
keunggulan, asal tambang, galeri, dan langkah — kolom itu menunggu halaman
detail per tingkatan bila suatu saat dihidupkan lagi. Panel adminnya
mengatakan sendiri mana yang tayang dan mana yang belum, supaya editor tidak
mengisi kolom lalu mencarinya di situs.

### Slider hero

Yang berganti hanya fotonya; judul dan tombol berdiri diam. Judul yang berubah
tiap enam detik tidak sempat dibaca sampai habis. Fotonya disunting di
`/admin/pengaturan` → **Slider hero**, copy-nya di bagian **Beranda**.

Pergantian otomatis berhenti saat pengunjung menekan tombol jeda, memilih
slide sendiri, membuka tab lain, atau menyalakan "kurangi gerak" di sistem
operasinya.

---

## Yang perlu diperiksa sebelum situs tayang

Data awal berisi beberapa hal yang **sengaja ditandai dan belum dikonfirmasi**.
Semuanya bisa disunting lewat `/admin`, tidak perlu ubah kode.

- **Spesifikasi batubara.** Empat tingkatan (GAR 4200/4600/5000/5800) ditanam
  berstatus **DRAF**, jadi tabel di `/layanan` menampilkan keadaan kosong
  sampai ada yang menerbitkannya. Angkanya rentang rujukan pasar, bukan
  katalog yang dikonfirmasi perusahaan. Spesifikasi batubara adalah janji
  kontraktual — cocokkan dengan hasil uji laboratorium tambang pemasok, baru
  terbitkan dari `/admin/produk`.
- **Logo klien.** Enam nama klien dari company profile sudah ditanam, logonya
  belum. Selama kosong, strip klien menampilkan nama sebagai teks — bukan logo
  karangan. Unggah di `/admin/media`, sambungkan di `/admin/mitra`.
- **Foto.** Dua sumber, sengaja dicampur:
  - **10 gambar buatan** di `public/foto` (WebP, dari PNG HD di
    `../gambar-sumber`). Seluruhnya adegan darat — pit, pemuatan, hauling,
    stockpile — dan dipakai di slider hero, rantai pasok tahap darat, blok foto
    beranda, serta halaman tentang kami.
  - **6 foto Unsplash** untuk tahap yang tidak ada di set buatan: tekstur
    batubara, contoh uji laboratorium, tongkang/kapal, dan pembangkit sebagai
    pengguna akhir. Menggantinya dengan adegan pit lagi akan membuat rantai
    pasok kehilangan separuh ceritanya.

  Keduanya tetap bukan dokumentasi operasi yang sebenarnya, jadi keterangan
  foto menyebut TAHAP dan bukan lokasi. Prompt untuk menambah gambar buatan ada
  di `../PROMPT-GAMBAR.md`.
- **Foto pimpinan.** Tiga nama ditanam tanpa foto; kartunya tampil dengan
  inisial. Potret stok TIDAK dipasang pada nama orang sungguhan.
- **Testimoni — PALING PENTING.** Lima kutipan **dummy** yang kini tampil
  seperti testimoni biasa: nama orang, jabatan, dan nama perusahaannya
  KARANGAN, dan tidak ada satu pun penanda visual yang memberitahu pembaca.
  Berbeda dari foto stok yang paling buruk hanya terlihat generik, testimoni
  bernama adalah klaim yang bisa dicek — dan yang membaca halaman ini justru
  bagian pengadaan yang bisa mengangkat telepon.

  Sebelum `NEXT_PUBLIC_SITE_LIVE=true`, lakukan salah satu:
  - ganti dengan kutipan yang benar-benar diberikan beserta izin tertulis
    untuk menampilkan nama dan jabatannya, **atau**
  - kosongkan tabel testimoni di `/admin/mitra → Testimoni`. Bagiannya
    hilang sendiri dari beranda saat tabelnya kosong.

  Penanda `contoh` masih ada di CMS: menyalakannya membuat kartu itu tampil
  bergaris putus-putus dan berlabel, kalau ingin jujur tanpa menghapusnya.
- **Logo & favicon.** Situs memakai wordmark, bukan logo elang: logo resminya
  raster berlatar putih dengan bagian arang gelap, dan di header gelap bagian
  itu lenyap. Kirim versi SVG satu warna (putih) untuk menggantikannya.
- **Alur pemesanan dan FAQ** ditandai `PERIKSA` di `lib/site.ts` — rangkaian
  yang lazim di perdagangan batubara, belum tentu cara kerja tim yang
  sebenarnya.
- **CID Google Maps.** Kosong, jadi peta memakai pencarian alamat. Isi CID-nya
  di `/admin/pengaturan → Kantor` begitu entri tempatnya terdaftar.
- **`NEXT_PUBLIC_SITE_LIVE`** biarkan `false` sampai benar-benar tayang.
  Selama `false`, robots.txt menolak semua perayap dan tiap halaman mengirim
  `noindex`.

---

## Pelajaran yang jangan diulang

- **Setelah `prisma generate` atau `prisma migrate`, restart dev server.**
  Client lama tertahan di memori dan setiap halaman menjawab 500 tanpa sebab
  yang jelas.
- **Jangan `npm run build` selagi dev server hidup.** Keduanya menulis `.next`.
- **Migrasi harus selesai sebelum rollout,** bukan berbarengan.
- **`mode: "insensitive"` tidak dipakai.** Konektor MySQL Prisma menolaknya,
  dan memang tidak perlu — collation `utf8mb4_unicode_ci` sudah abai huruf
  besar-kecil.
- **`String` di MySQL memetakan ke `VARCHAR(191)`,** bukan `TEXT` seperti di
  PostgreSQL. Kolom yang isinya bisa lebih panjang WAJIB diberi `@db.Text`
  atau `@db.VarChar(n)` — termasuk kolom token Better Auth.
- **`DATABASE_URL` memakai skema `mysql://`,** yang diminta Prisma CLI. Driver
  mariadb hanya menerima `mariadb://`, jadi URL-nya dibongkar jadi field
  sendiri di `lib/db/index.ts`. Jangan diteruskan apa adanya ke adapter.
- **Nilai rahasia tidak pernah masuk berkas terlacak.** `.env.example` hanya
  placeholder kosong.
