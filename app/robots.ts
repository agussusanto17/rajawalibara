import type { MetadataRoute } from "next";
import { absoluteUrl, isLive } from "@/lib/seo";

/**
 * Selama NEXT_PUBLIC_SITE_LIVE belum "true", seluruh perayapan ditolak.
 * Ini pengaman untuk deploy preview dan staging: begitu versi sementara
 * terindeks, ia bersaing sebagai konten duplikat dengan halaman asli.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isLive) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
