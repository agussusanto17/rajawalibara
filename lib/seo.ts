import { company, kantor } from "@/lib/site";

/**
 * Domain situs. Disimpan di env dan bukan ditanam di kode: saat domainnya
 * siap atau berganti, cukup ubah satu nilai di hPanel.
 *
 *   NEXT_PUBLIC_SITE_URL   https://rajawalibara.co.id
 *   NEXT_PUBLIC_SITE_LIVE  "true" hanya di produksi
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

/**
 * Situs baru boleh diindeks kalau dinyatakan live secara eksplisit. Default-nya
 * tertutup supaya deploy preview, staging, atau domain sementara tidak pernah
 * masuk indeks Google. Sekali terindeks, halaman staging bersaing dengan
 * halaman asli sebagai konten duplikat dan mengeluarkannya jauh lebih repot
 * daripada mencegahnya.
 */
export const isLive = process.env.NEXT_PUBLIC_SITE_LIVE === "true";

// Salah konfigurasi yang paling mahal: live tanpa domain, sehingga seluruh
// canonical menunjuk ke localhost. Lebih baik build gagal daripada terbit salah.
if (isLive && !rawSiteUrl) {
  throw new Error(
    "NEXT_PUBLIC_SITE_LIVE=true tetapi NEXT_PUBLIC_SITE_URL kosong. " +
      "Isi domainnya, atau matikan NEXT_PUBLIC_SITE_LIVE.",
  );
}

export const siteUrl = (rawSiteUrl ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

/** URL absolut untuk canonical, sitemap, dan Open Graph. */
export const absoluteUrl = (path = "/") =>
  `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Canonical menunjuk ke URL bersih tanpa parameter. Ini yang menjaga
 * /produk/gar-4200 dan /produk/gar-4200?utm_source=ig&fbclid=... tetap terbaca
 * sebagai satu halaman oleh Google, bukan dua yang saling melemahkan.
 * Wajib ada begitu traffic iklan mulai jalan.
 */
export const canonical = (path: string) => ({ alternates: { canonical: path } });

/**
 * Alamat resmi untuk penanda: kantor pusat, dari daftar statis di lib/site.ts.
 *
 * Sengaja TIDAK dibaca dari basis data. Penanda ini dipakai di layout root yang
 * dirender untuk setiap halaman, dan menambahkan satu kueri di sana berarti
 * setiap permintaan menunggu basis data hanya untuk mengisi kolom yang praktis
 * tidak pernah berubah.
 */
const pusat = kantor.find((k) => k.jenis === "PUSAT") ?? kantor[0];

const organization = {
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: company.legalName,
  alternateName: company.name,
  url: siteUrl,
  description: company.background,
  foundingDate: String(company.founded),
  email: company.email,
  telephone: company.phoneHref.replace("tel:", ""),
  address: {
    "@type": "PostalAddress",
    streetAddress: pusat.alamat,
    addressLocality: "Jakarta Selatan",
    addressRegion: "DKI Jakarta",
    postalCode: "12190",
    addressCountry: "ID",
  },
  areaServed: { "@type": "Country", name: "Indonesia" },
} as const;

export const organizationSchema = {
  "@context": "https://schema.org",
  ...organization,
  /**
   * Wajib raster: Google tidak membaca SVG untuk kolom ini, dan WebP beralpha
   * tidak bisa diandalkan. Yang dirujuk versi PNG yang latarnya sudah
   * diratakan ke arang — logonya beremas dan berperak, dan di atas kartu hasil
   * telusur yang berlatar putih, tulisan peraknya akan lenyap.
   */
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/logo/logo-rajawalibara.png"),
    width: 1200,
    height: 332,
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  url: siteUrl,
  name: `${company.name} | ${company.tagline}`,
  inLanguage: "id-ID",
  publisher: { "@id": absoluteUrl("/#organization") },
};

/**
 * Komoditas yang diperdagangkan.
 *
 * Sengaja tanpa `offers` dan `aggregateRating`. Harga batubara bergerak
 * mengikuti indeks dan disepakati per kontrak, jadi angka yang ditanam di
 * penanda akan salah dalam hitungan hari — dan penanda yang tidak cocok dengan
 * isi halaman berisiko manual action dari Google.
 *
 * `additionalProperty` mengangkat tabel spesifikasi ke dalam penanda. Inilah
 * yang membedakan halaman komoditas dari halaman pemasaran biasa di mata mesin
 * telusur: parameter dan nilainya terbaca sebagai data, bukan paragraf.
 */
export const productSchema = (p: {
  slug: string;
  name: string;
  full: string;
  summary: string;
  specs?: { parameter: string; nilai: string; satuan: string }[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  // Tidak ada lagi halaman detail per tingkatan. `@id` tetap membedakan
  // keempatnya sebagai entitas terpisah, sementara `url` menunjuk tempat
  // datanya benar-benar terlihat — tabel di halaman Layanan. Penanda yang
  // menunjuk halaman yang menjawab 404 lebih buruk daripada tidak ada.
  "@id": absoluteUrl(`/layanan#${p.slug}`),
  name: p.full,
  alternateName: p.name,
  description: p.summary,
  url: absoluteUrl("/layanan#spesifikasi"),
  category: "Coal",
  brand: { "@id": absoluteUrl("/#organization") },
  manufacturer: { "@id": absoluteUrl("/#organization") },
  ...(p.specs?.length
    ? {
        additionalProperty: p.specs.map((s) => ({
          "@type": "PropertyValue",
          name: s.parameter,
          value: s.satuan ? `${s.nilai} ${s.satuan}` : s.nilai,
        })),
      }
    : {}),
});


/**
 * FAQPage untuk halaman produk. Google memakainya sebagai kandidat rich
 * result, dan syaratnya jawabannya benar-benar terlihat di halaman, bukan
 * hanya ada di penanda. Di sini jawabannya tampil.
 */
export const faqSchema = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: { "@type": "Answer", text: it.a },
  })),
});

/** Remah roti terstruktur agar jalur navigasi ikut tampil di hasil pencarian. */
export const breadcrumbSchema = (
  trail: { name: string; path: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
