import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/lib/generated/prisma";

/**
 * Koneksi database, dibuat saat pertama kali dipakai.
 *
 * Sengaja TIDAK dibuat saat modul diimpor. `next build` mengumpulkan data
 * halaman dengan mengimpor setiap route, dan saat build berjalan di Hostinger
 * variabel lingkungannya belum tentu ada: kalau koneksinya dibangun di tingkat
 * modul, build gagal padahal tidak ada satu pun kueri yang dijalankan.
 *
 * Penjaganya tetap ada, hanya berpindah ke saat pemakaian. Gagal keras di situ
 * masih benar: formulir yang tampak berhasil padahal tidak menyimpan apa pun
 * persis masalah yang tabel pesan dibuat untuk menyelesaikannya.
 *
 * Prisma 7 tidak lagi menerima URL dari berkas skema. Ia masuk lewat driver
 * adapter di sini, sementara CLI dan Migrate membacanya dari prisma.config.ts.
 */

/**
 * Mengurai DATABASE_URL menjadi konfigurasi pool.
 *
 * URL-nya TIDAK diteruskan apa adanya ke adapter. Driver mariadb hanya
 * menerima skema `mariadb://` dan menolak `mysql://` dengan galat penguraian,
 * sementara Prisma CLI dan Migrate justru mewajibkan `mysql://`. Satu URL
 * harus melayani keduanya, jadi yang disimpan di lingkungan adalah bentuk
 * `mysql://` milik Prisma, dan di sini ia dibongkar jadi field-nya sendiri.
 *
 * Menguraikannya juga membuat ukuran pool bisa disetel. Basis datanya di
 * shared hosting, tempat batas koneksi serentak dihitung per akun, bukan per
 * aplikasi: pool bawaan yang terlalu besar membuat aplikasi lain milik akun
 * yang sama ikut ditolak.
 */
function konfigurasi(url: string) {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    throw new Error(
      "DATABASE_URL bukan URL yang sah. Bentuknya: mysql://pengguna:sandi@host:3306/nama_basis_data",
    );
  }

  const basisData = decodeURIComponent(u.pathname.replace(/^\//, ""));
  if (!basisData) {
    throw new Error(
      "DATABASE_URL tidak menyebut nama basis data. Bentuknya: mysql://pengguna:sandi@host:3306/nama_basis_data",
    );
  }

  const q = u.searchParams;

  return {
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    // Sandi di URL boleh mengandung karakter yang dipersenkan. Diserahkan
    // mentah, sandi bertanda "@" atau ":" akan ditolak sebagai salah kredensial
    // — galat yang membuat orang mengganti sandi yang sebenarnya sudah benar.
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: basisData,
    // Nama parameternya disamakan dengan milik Prisma supaya satu URL bisa
    // dibaca CLI dan aplikasi tanpa ditulis dua versi.
    connectionLimit: Number(q.get("connection_limit") ?? 5),
    // Gagal cepat lebih baik daripada permintaan yang menggantung sampai
    // peramban menyerah tanpa pesan apa pun.
    acquireTimeout: 10_000,
    ...(q.get("ssl") === "true" ? { ssl: true as const } : {}),
  };
}

// Next.js membuat modul ini berkali-kali saat pengembangan. Tanpa disimpan di
// globalThis, setiap perubahan berkas membuka pool baru sampai MySQL menolak.
const g = globalThis as unknown as { __db?: PrismaClient };

export function db(): PrismaClient {
  if (g.__db) return g.__db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL belum diisi. Salin .env.example menjadi .env.local lalu isi.",
    );
  }

  const klien = new PrismaClient({
    adapter: new PrismaMariaDb(konfigurasi(url)),
  });

  // Di produksi pun disimpan: satu instance per proses, bukan per permintaan.
  g.__db = klien;
  return klien;
}
