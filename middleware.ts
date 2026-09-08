import { NextResponse, type NextRequest } from "next/server";

/**
 * Nama host resmi, diambil dari NEXT_PUBLIC_SITE_URL.
 *
 * Dibaca sekali saat modul dimuat, bukan tiap permintaan: nilainya berasal
 * dari lingkungan proses dan tidak pernah berubah selama proses hidup.
 */
const HOST_UTAMA = (() => {
  const mentah = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!mentah) return null;
  try {
    return new URL(mentah).host.toLowerCase();
  } catch {
    return null;
  }
})();

/**
 * Host yang harus dialihkan ke host resmi, dipisah koma.
 *
 * Sengaja daftar eksplisit, bukan "alihkan apa pun yang bukan host resmi".
 * Aturan menyapu itu ikut menangkap alamat pratinjau, pemeriksa kesehatan
 * penyedia hosting, dan localhost — dan yang paling merepotkan justru saat
 * alat diagnosis ikut dialihkan sehingga masalahnya tidak bisa dilihat.
 *
 * Contoh: DOMAIN_ALIAS="rajawalibara.co.id,www.rajawalibara.co.id"
 */
const ALIAS = new Set(
  (process.env.DOMAIN_ALIAS ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean),
);

/**
 * Meneruskan jalur permintaan sebagai header, sekaligus menyatukan domain.
 *
 * JALUR — layout akar memegang elemen <html> dan atribut `lang`-nya harus
 * mengikuti bahasa halaman. Layout server tidak bisa membaca jalur yang
 * sedang dibuka, dan menebak dari Accept-Language menyajikan penanda bahasa
 * yang salah kepada pembaca yang justru sedang membuka /en. Header ini
 * jembatannya; nilainya dari Next, bukan dari pengunjung.
 *
 * DOMAIN — kalau domain kedua diarahkan langsung ke aplikasi ini, seluruh
 * halaman akan tersaji di dua alamat sekaligus. Mesin telusur membacanya
 * sebagai konten duplikat lalu memilih salah satu, dan yang dipilihnya belum
 * tentu yang canonical-nya kita tulis. Pengalihan 301 di sini menutup itu di
 * dalam kode, terlepas dari bagaimana panel hosting dikonfigurasi.
 *
 * Pengalihan domain diutamakan di tingkat panel hosting: 301 dari sana tidak
 * membangunkan proses Node sama sekali dan tetap bekerja saat aplikasinya
 * mati. Yang di sini adalah lapis kedua, bukan penggantinya.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";

  if (HOST_UTAMA && host && host !== HOST_UTAMA && ALIAS.has(host)) {
    const tujuan = new URL(request.nextUrl);
    tujuan.host = HOST_UTAMA;
    tujuan.protocol = "https:";
    tujuan.port = "";
    // 308, bukan 301: 301 membolehkan peramban mengubah POST menjadi GET, dan
    // formulir kontak yang dikirim ke domain alias akan kehilangan isinya
    // tanpa pesan apa pun. 308 mempertahankan metode dan body.
    return NextResponse.redirect(tujuan, 308);
  }

  const header = new Headers(request.headers);
  header.set("x-jalur", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: header } });
}

export const config = {
  /* Aset statis dan berkas unggahan dilewati: keduanya tidak pernah dirender
     sebagai halaman, dan melewatkannya menghemat satu lintasan middleware
     pada setiap gambar. */
  matcher: ["/((?!_next/static|_next/image|media/|favicon.ico).*)"],
};
