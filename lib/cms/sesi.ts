import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Sesi yang sedang berjalan, atau null.
 *
 * Diperiksa di server pada setiap permintaan, bukan lewat middleware. Alasannya
 * bukan gaya: CVE-2025-29927 menunjukkan proteksi yang hanya bersandar pada
 * middleware Next.js bisa dilewati lewat header yang dibuat sendiri. Penjaga
 * yang mengambil keputusan harus berada di tempat datanya dibaca.
 */
export async function sesi() {
  return auth().api.getSession({ headers: await headers() });
}

/**
 * Sesi wajib. Mengalihkan ke halaman masuk bila tidak ada.
 *
 * Dipanggil di layout DAN di setiap aksi tulis. Memanggilnya hanya di layout
 * tidak cukup: aksi server bisa dipanggil langsung tanpa pernah merender
 * layout itu.
 */
export async function wajibMasuk() {
  const s = await sesi();
  if (!s) redirect("/admin/masuk");
  return s;
}
