import { cn } from "@/lib/utils";

/**
 * Marka Rajawali Bara, versi tinta terang.
 *
 * Seluruh permukaan yang memakai komponen ini berlatar gelap — header,
 * footer, sidebar dan halaman masuk CMS — jadi yang dimuat versi tinta terang.
 * Versi tinta gelap (`/logo/logo-latar-terang.png`) hanya dipakai penanda
 * Organization, yang ditampilkan mesin telusur di atas latar putih.
 */
const MARKA = {
  src: "/logo/logo.webp",
  lebar: 328,
  tinggi: 400,
};

/**
 * Dua ukuran, dan angkanya hasil ukur bukan selera.
 *
 * Wordmark menempati 25% bagian bawah marka; baris "RAJAWALI BARA" sendiri
 * 12% dari tingginya. Hurufnya tebal dan padat, jadi bertahan dikecilkan jauh
 * lebih baik daripada marka sebelumnya yang bergradien emas tipis:
 *
 *   96px  seluruh wordmark terbaca — footer, sidebar CMS, halaman masuk;
 *   48px  "RAJAWALI BARA" jelas, "YUDHA PERKASA" kecil tapi ada — header;
 *   40px  masih terbaca, tapi sudah di tepinya. Jangan turun di bawah ini.
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
