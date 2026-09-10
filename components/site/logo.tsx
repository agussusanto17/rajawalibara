import { cn } from "@/lib/utils";

/**
 * Dua lockup dari marka yang sama.
 *
 * `utama` — emblem elang bertumpuk di atas wordmark. Ini marka utamanya, dan
 * dipakai di mana pun ada ruang vertikal: footer, halaman masuk CMS, gambar
 * bagikan, dan penanda Organization.
 *
 * `baris` — emblem dan wordmark berdampingan, untuk bilah sempit.
 *
 * Pemisahan ini bukan selera, melainkan geometri yang diukur. Pada lockup
 * bertumpuk, wordmark menempati 26% bagian bawah. Di header setinggi 36px
 * itu menyisakan 9px untuk tiga baris teks — "RAJAWALI", "BARA YUDHA
 * PERKASA", dan "TRADING MINERAL & BATUBARA" — yang jatuh jadi noda, bukan
 * tulisan. Baru terbaca mulai 64px dan utuh di 96px, dan header setinggi itu
 * memaksa seluruh halaman turun.
 *
 * Lockup berbaris terbaca jelas di 36px karena wordmark-nya duduk di samping
 * emblem, bukan di bawahnya. Itu sebabnya header memakainya.
 */
const LOCKUP = {
  utama: { src: "/logo/logo-square.webp", lebar: 393, tinggi: 400 },
  baris: { src: "/logo/logo-rajawalibara.webp", lebar: 900, tinggi: 249 },
} as const;

/** Tinggi render per lockup. */
const TINGGI = {
  utama: { biasa: "h-20 sm:h-24", ringkas: "h-14 sm:h-16" },
  baris: { biasa: "h-14 sm:h-16", ringkas: "h-9 sm:h-10" },
} as const;

export function Logo({
  className,
  varian = "utama",
  compact = false,
  alt = "PT Rajawali Bara Yudha Perkasa",
}: {
  className?: string;
  varian?: keyof typeof LOCKUP;
  compact?: boolean;
  /** Kosongkan kalau elemen pembungkusnya sudah punya label sendiri. */
  alt?: string;
}) {
  const l = LOCKUP[varian];
  const tinggi = TINGGI[varian][compact ? "ringkas" : "biasa"];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={l.src}
      width={l.lebar}
      height={l.tinggi}
      alt={alt}
      draggable={false}
      className={cn("w-auto shrink-0", tinggi, className)}
    />
  );
}
