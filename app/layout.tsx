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
import { JsonLd } from "@/components/site/json-ld";

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

export async function generateMetadata(): Promise<Metadata> {
  const company = await profil();
  return {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
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
    locale: "id_ID",
    siteName: company.legalName,
    title: `${company.name} | ${company.tagline}`,
    description: company.intro,
  },
  robots: isLive
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
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
