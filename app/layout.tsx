import type { Metadata } from "next";
import { profil } from "@/lib/konten";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import {
  isLive,
  organizationSchema,
  siteUrl,
  websiteSchema,
} from "@/lib/seo";
import { headers } from "next/headers";
import { JsonLd } from "@/components/site/json-ld";
import {
  bahasaDariJalur,
  KODE_BAHASA,
  OG_LOCALE,
  type Bahasa,
} from "@/lib/bahasa";

/**
 * Tiga peran, tiga huruf.
 *
 * Archivo untuk judul: grotesk industri yang lebar dan berbobot, mengikuti
 * lockup logo yang juga lebar dan bertracking longgar.
 *
 * IBM Plex Sans untuk naskah. Dirancang untuk dokumen teknis, dan itu persis
 * nada yang dibutuhkan halaman yang dibaca bagian pengadaan.
 *
 * IBM Plex Mono untuk ANGKA, bukan hiasan: nomor NIB, kode KBLI, nilai kalor,
 * koordinat. Angka yang dibaca untuk dicocokkan harus berjajar rapi kolomnya,
 * dan huruf proporsional tidak melakukan itu.
 */
const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-data",
  display: "swap",
});

/** Bahasa halaman, dibaca dari jalur yang diteruskan middleware. */
async function bahasaHalaman(): Promise<Bahasa> {
  return bahasaDariJalur((await headers()).get("x-jalur") ?? "/");
}

export async function generateMetadata(): Promise<Metadata> {
  const bahasa = await bahasaHalaman();
  const company = await profil(bahasa);
  return {
  metadataBase: new URL(siteUrl),
  /* hreflang untuk kedua bahasa plus x-default. Tanpa ini mesin telusur
     memperlakukan /en sebagai halaman terpisah yang isinya menyerupai versi
     Indonesia — dan yang dihukum sebagai duplikat justru halaman yang
     sengaja diterjemahkan. */
  alternates: {
    canonical: "/",
    languages: { "id-ID": "/", en: "/en", "x-default": "/" },
  },
  title: {
    default: `${company.name} | ${company.tagline}`,
    template: `%s | ${company.name}`,
  },
  description: company.intro,
  keywords: [
    "PT Rajawali Bara Yudha Perkasa",
    "trading batubara",
    "coal trading Indonesia",
    "supplier batubara Kalimantan Timur",
    "batubara GAR",
    "pemasok batubara PLTU",
    "batubara industri semen",
  ],
  openGraph: {
    type: "website",
    url: "/",
    locale: OG_LOCALE[bahasa],
    siteName: company.legalName,
    title: `${company.name} | ${company.tagline}`,
    description: company.intro,
  },
  robots: isLive
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const bahasa = await bahasaHalaman();
  return (
    <html
      lang={KODE_BAHASA[bahasa]}
      className={cn("h-full", display.variable, body.variable, mono.variable)}
    >
      <body className="flex min-h-full flex-col antialiased">
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        {/* Header dan footer situs pindah ke app/(situs)/layout.tsx. Panel
            /admin berbagi kerangka dokumen ini, tetapi bukan kerangka
            situsnya: navigasi publik di dalam CMS itu dua aplikasi yang
            saling tertukar. */}
        {children}
      </body>
    </html>
  );
}
