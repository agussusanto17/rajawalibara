# Font untuk gambar Open Graph

Dua berkas ini **tidak dikirim ke peramban**. Ia hanya dibaca saat build oleh
`app/opengraph-image.tsx`, karena Satori (mesin di balik `next/og`) tidak bisa
memakai woff2 yang dihasilkan `next/font/google`, dan nama berkas keluaran
`next/font` di-hash ulang setiap build sehingga tidak bisa dirujuk dari kode.

Inter v4.1, dari https://github.com/rsms/inter — lisensi SIL Open Font License 1.1.

Font yang dipakai halaman tetap datang dari `next/font/google` di `app/layout.tsx`.
