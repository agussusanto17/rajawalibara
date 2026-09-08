import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { teks } from "@/lib/teks";
import type { Bahasa } from "@/lib/bahasa";

/**
 * Kerangka halaman publik: lompatan aksesibilitas, header, isi, footer.
 *
 * Berdiri sebagai komponen dan bukan langsung di layout karena bahasanya
 * ditentukan oleh cabang rute, sementara layout server tidak bisa membaca
 * jalur yang sedang dibuka. Dua layout tipis — satu untuk Indonesia, satu
 * untuk Inggris — memanggil kerangka yang sama dengan `bahasa` yang berbeda.
 * Alternatifnya menebak bahasa dari header permintaan, dan tebakan yang
 * meleset menyajikan halaman Inggris dengan menu Indonesia.
 */
export function KerangkaSitus({
  bahasa,
  children,
}: {
  bahasa: Bahasa;
  children: React.ReactNode;
}) {
  const t = teks(bahasa);
  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t.umum.lewatiKeKonten}
      </a>
      <SiteHeader bahasa={bahasa} />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <SiteFooter bahasa={bahasa} />
    </>
  );
}
