import { cn } from "@/lib/utils";

/**
 * Logo perusahaan.
 *
 * Lockup resminya dirujuk sebagai berkas, bukan ditanam sebagai markup: kalau
 * logonya diekspor ulang, tidak ada satu baris kode pun yang perlu ikut
 * diubah. Lebar dan tinggi aslinya dicantumkan supaya peramban memesan
 * ruangnya sebelum gambarnya sampai, jadi header tidak melompat saat logo
 * selesai dimuat.
 *
 * WebP beralpha, jadi ia duduk langsung di atas latar gelap header dan footer
 * tanpa kotak putih. Versi PNG-nya hanya untuk penanda Organization dan
 * pratinjau tautan, tempat WebP beralpha tidak bisa diandalkan.
 *
 * Dipakai lewat <img>, bukan next/image: ukurannya sudah pasti dan kecil, dan
 * logo di header ikut LCP — melewatkan pengoptimalnya menghilangkan satu
 * lompatan yang tidak memberi keuntungan pada berkas 86 KB.
 */
const LOCKUP = {
  src: "/logo/logo-rajawalibara.webp",
  lebar: 900,
  tinggi: 249,
};

export function Logo({
  className,
  compact = false,
  alt = "PT Rajawali Bara Yudha Perkasa",
}: {
  className?: string;
  compact?: boolean;
  /** Kosongkan kalau elemen pembungkusnya sudah punya label sendiri. */
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOCKUP.src}
      width={LOCKUP.lebar}
      height={LOCKUP.tinggi}
      alt={alt}
      draggable={false}
      className={cn(
        "w-auto shrink-0",
        // Di header lockup-nya tetap utuh, hanya mengecil. Barisan
        // "TRADING MINERAL & BATUBARA" memang jadi terlalu kecil untuk dibaca
        // di ukuran itu, dan itu wajar — di header ia bagian dari markanya,
        // bukan kalimat yang perlu terbaca.
        compact ? "h-9 sm:h-10" : "h-14 sm:h-16",
        className,
      )}
    />
  );
}
