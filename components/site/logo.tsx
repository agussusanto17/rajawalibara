import { cn } from "@/lib/utils";

const MARKA = {
  src: "/logo/logo-square.webp",
  lebar: 393,
  tinggi: 400,
};

/**
 * Dua ukuran, dan angkanya hasil ukur bukan selera.
 *
 * Pada marka ini wordmark menempati 26% bagian bawah, jadi tinggi render yang
 * menentukan apakah ia terbaca:
 *
 *   96px  seluruh wordmark terbaca, termasuk baris "TRADING MINERAL &
 *         BATUBARA" — dipakai footer, sidebar CMS, dan halaman masuk;
 *   48px  dua baris atas masih terbaca, baris ketiga jadi ornamen —
 *         dipakai header situs;
 *   36px  seluruh wordmark jadi noda. Jangan turun ke sini.
 *
 * Header memakai ukuran ringkas karena pilnya melayang di atas hero:
 * memperbesarnya menaikkan tinggi pil dan mendorong seluruh halaman turun.
 */
const TINGGI = {
  biasa: "h-20 sm:h-24",
  ringkas: "h-11 sm:h-12",
} as const;

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
      src={MARKA.src}
      width={MARKA.lebar}
      height={MARKA.tinggi}
      alt={alt}
      draggable={false}
      className={cn(
        "w-auto shrink-0",
        TINGGI[compact ? "ringkas" : "biasa"],
        className,
      )}
    />
  );
}
