import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * Peta situs.
 *
 * Empat halaman, dan seluruhnya statis — tidak ada lagi halaman yang lahir
 * dari basis data sejak /produk dan /artikel dibuang. Karena itu berkas ini
 * tidak lagi menyentuh basis data sama sekali, dan tidak bisa gagal saat
 * build berjalan tanpa DATABASE_URL.
 *
 * Prioritas menurun sesuai kedekatan halaman dengan keputusan pembelian:
 * beranda dan layanan paling atas, profil di bawahnya.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { path: "/", priority: 1 },
    { path: "/layanan", priority: 0.9 },
    { path: "/hubungi-kami", priority: 0.8 },
    { path: "/tentang-kami", priority: 0.7 },
  ].map(({ path, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority,
  }));
}
