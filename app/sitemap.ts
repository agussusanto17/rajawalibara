import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { BAHASA, tautan } from "@/lib/bahasa";

/**
 * Peta situs, empat halaman kali dua bahasa.
 *
 * Seluruhnya statis — tidak ada lagi halaman yang lahir dari basis data sejak
 * /produk dan /artikel dibuang. Karena itu berkas ini tidak menyentuh basis
 * data sama sekali, dan tidak bisa gagal saat build berjalan tanpa
 * DATABASE_URL.
 *
 * Tiap entri membawa `alternates.languages`. Tanpa itu mesin telusur
 * menemukan dua halaman berisi hal yang sama tanpa tahu keduanya terjemahan,
 * lalu memilih salah satu dan membuang yang lain — dan yang dibuang biasanya
 * justru halaman Inggris yang baru, karena tautan masuknya belum ada.
 *
 * Prioritas menurun sesuai kedekatan halaman dengan keputusan pembelian:
 * beranda dan layanan paling atas, profil di bawahnya.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const halaman = [
    { path: "/", priority: 1 },
    { path: "/layanan", priority: 0.9 },
    { path: "/hubungi-kami", priority: 0.8 },
    { path: "/tentang-kami", priority: 0.7 },
  ];

  return halaman.flatMap(({ path, priority }) =>
    BAHASA.map((bahasa) => ({
      url: absoluteUrl(tautan(bahasa, path)),
      changeFrequency: "monthly" as const,
      /* Versi Inggris diberi prioritas sedikit di bawah versi Indonesia:
         pasar utamanya domestik, dan prioritas yang sama membuat keduanya
         bersaing untuk kata kunci yang sama. */
      priority: bahasa === "en" ? Number((priority - 0.1).toFixed(1)) : priority,
      alternates: {
        languages: {
          "id-ID": absoluteUrl(tautan("id", path)),
          en: absoluteUrl(tautan("en", path)),
        },
      },
    })),
  );
}
