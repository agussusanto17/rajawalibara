import { GoogleTagManager } from "@next/third-parties/google";
import { isLive } from "@/lib/seo";

/**
 * Container Google Tag Manager. Tag GA4 dan Meta Pixel dijalankan dari dalam
 * GTM, bukan ditanam di sini — memasang keduanya berdampingan dengan GTM
 * membuat setiap kunjungan terhitung dua kali.
 */
const GTM = "GTM-K8NPKS2M";

/**
 * Kerangka situs publik.
 *
 * Dipisahkan dari layout root supaya /admin tidak ikut membawa header dan
 * footer situs. Route group tidak mengubah URL: halaman di dalamnya tetap
 * berada di /, /layanan, /tentang-kami, dan seterusnya.
 */
/**
 * Seluruh halaman publik dirender per permintaan.
 *
 * Bukan pilihan gaya: footer di bawah ini menampilkan daftar produk dari basis
 * data, dan footer muncul di setiap halaman. Artinya tidak ada satu pun
 * halaman publik yang bisa disiapkan saat build tanpa DATABASE_URL — dan build
 * di dalam container memang berjalan tanpa itu, karena proses build tidak
 * layak memegang kredensial produksi.
 *
 * Ditaruh di sini, bukan diulang di tiap halaman: footer inilah sumber
 * ketergantungannya.
 */
export const dynamic = "force-dynamic";

export default async function SitusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hanya di produksi. Tanpa penjaga ini, kunjungan kita sendiri saat
          menguji di staging ikut masuk laporan dan angkanya tidak lagi
          menggambarkan pengunjung sungguhan. Penjaganya sama dengan yang
          menahan staging dari indeks Google, jadi keduanya tidak bisa
          berselisih. */}
      {isLive && <GoogleTagManager gtmId={GTM} />}

      {/* Header, footer, dan lompatan aksesibilitas tinggal di layout bahasa
          satu tingkat di bawah ini — ketiganya perlu tahu bahasa halaman,
          sementara layout ini membungkus kedua bahasa sekaligus. */}
      {children}
    </>
  );
}
