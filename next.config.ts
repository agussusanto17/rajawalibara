import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `output: "standalone"` SENGAJA tidak dipakai.
  //
  // Mode itu ada di project asal khusus untuk image Docker. Keluarannya perlu
  // `public/` dan `.next/static` disalin manual ke sebelah `server.js`, dan
  // penjalan aplikasi Node.js di Hostinger tidak melakukan itu — hasilnya
  // situs tayang tanpa satu pun CSS, gambar, atau berkas JS.
  //
  // Pin root: ada package-lock.json lain di home dir yang bikin Next salah
  // menebak workspace root.
  turbopack: { root: __dirname },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      // Foto sementara dari Unsplash, dipakai data awal sebelum foto asli
      // perusahaan diunggah. Boleh dihapus begitu tidak ada lagi yang memakai.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // Gambar unggahan CMS disajikan dari origin yang sama lewat /media/...,
    // jadi tidak perlu pola remote sama sekali untuknya.
  },
};

export default nextConfig;
