import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";

/**
 * Autentikasi untuk CMS.
 *
 * Dibuat saat pertama dipakai, dengan alasan yang sama seperti koneksi
 * database: `next build` mengimpor setiap route, dan di dalam container tidak
 * ada DATABASE_URL. Kalau instance ini dibangun di tingkat modul, build gagal
 * padahal tidak ada satu pun kueri yang dijalankan.
 *
 * PENDAFTARAN MANDIRI DIMATIKAN. Ini panel admin, bukan layanan publik: kalau
 * `signUp` terbuka, siapa pun yang menemukan /admin bisa membuat akun untuk
 * dirinya sendiri. Akun dibuat lewat skrip `npm run cms:akun`.
 */
function buat() {
  const rahasia = process.env.BETTER_AUTH_SECRET;
  if (!rahasia) {
    throw new Error(
      "BETTER_AUTH_SECRET belum diisi. Tanpa ini sesi tidak bisa ditandatangani. " +
        "Buat nilai acak: openssl rand -base64 32",
    );
  }

  return betterAuth({
    database: prismaAdapter(db(), { provider: "postgresql" }),
    secret: rahasia,
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    emailAndPassword: {
      enabled: true,
      // Tidak ada alur "lupa sandi" lewat surel: belum ada layanan
      // pengiriman surel, dan tombol yang tidak mengirim apa pun adalah
      // kontrol mati. Sandi disetel ulang lewat skrip yang sama.
      disableSignUp: true,
      minPasswordLength: 12,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  });
}

// Tipenya diturunkan dari fungsi pembuatnya, bukan ditulis sebagai
// ReturnType<typeof betterAuth>: yang terakhir itu bentuk generiknya, dan
// instance sebenarnya bertipe lebih sempit sehingga keduanya tidak cocok.
type Auth = ReturnType<typeof buat>;

const g = globalThis as unknown as { __auth?: Auth };

export function auth(): Auth {
  return (g.__auth ??= buat());
}
