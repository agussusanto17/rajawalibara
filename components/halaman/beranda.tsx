import { Hero } from "@/components/site/hero";
import { PitaLegalitas } from "@/components/site/pita-legalitas";
import { Manifesto } from "@/components/site/manifesto";
import { ClientLogos } from "@/components/site/client-logos";
import { ServicesSection } from "@/components/site/services-section";
import { RantaiPasok } from "@/components/site/rantai-pasok";
import { NumbersSection } from "@/components/site/numbers-section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { CtaBanner } from "@/components/site/cta-banner";
import { kutipanKlien } from "@/lib/konten";
import { teks } from "@/lib/teks";
import type { Bahasa } from "@/lib/bahasa";

/**
 * Isi beranda, dipakai dua rute.
 *
 * Badan halaman tinggal di sini dan bukan di berkas rutenya supaya versi
 * Indonesia dan Inggris tidak pernah berisi susunan section yang berbeda.
 * Menyalinnya ke dua berkas rute berarti setiap penambahan section harus
 * diingat dua kali, dan yang terlupa adalah section yang hilang di satu
 * bahasa tanpa ada yang menyadarinya.
 */
export async function Beranda({ bahasa }: { bahasa: Bahasa }) {
  const t = teks(bahasa);
  return (
    <>
      <Hero bahasa={bahasa} />

      <PitaLegalitas bahasa={bahasa} />

      <Manifesto bahasa={bahasa} />

      <ServicesSection bahasa={bahasa} />

      <RantaiPasok bahasa={bahasa} />

      <ClientLogos bahasa={bahasa} />

      <NumbersSection bahasa={bahasa} />

      <TestimonialsSection
        bahasa={bahasa}
        testimonials={await kutipanKlien(bahasa)}
      />

      <CtaBanner
        bahasa={bahasa}
        tag={t.umum.tagPenawaran}
        eyebrow={t.ctaBeranda.eyebrow}
        heading={t.ctaBeranda.judul}
        body={t.ctaBeranda.isi}
        aksiLabel={t.umum.mintaPenawaran}
      />
    </>
  );
}
