import { Hero } from "@/components/site/hero";
import { PitaLegalitas } from "@/components/site/pita-legalitas";
import { Manifesto } from "@/components/site/manifesto";
import { ClientLogos } from "@/components/site/client-logos";
import { ServicesSection } from "@/components/site/services-section";
import { RantaiPasok } from "@/components/site/rantai-pasok";
import { NumbersSection } from "@/components/site/numbers-section";
import { kutipanKlien } from "@/lib/konten";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { CtaBanner } from "@/components/site/cta-banner";

/**
 * Dirender per permintaan, bukan disimpan sebagai HTML saat build.
 *
 * Alasannya bukan performa: `next build` di dalam container berjalan tanpa
 * DATABASE_URL, dan memang seharusnya begitu — proses build tidak layak
 * memegang kredensial produksi. Halaman yang membaca basis data karena itu
 * tidak bisa disiapkan saat build.
 *
 * Ongkosnya satu kueri per permintaan untuk delapan baris, dan imbalannya
 * suntingan dari CMS langsung terlihat tanpa menunggu masa kedaluwarsa.
 */
export const dynamic = "force-dynamic";

/**
 * Urutan beranda mengikuti urutan pertanyaan pembacanya, bukan urutan
 * kepentingan perusahaan:
 *
 *   1. siapa ini, dan apa yang dijual        → hero
 *   2. perusahaannya nyata atau bukan        → pita legalitas
 *   3. apa maksudnya, dengan kalimat sendiri → manifesto
 *   4. apa saja yang dikerjakan              → layanan
 *   5. bagaimana barangnya sampai            → rantai pasok
 *   6. siapa lagi yang sudah membeli         → klien, angka, testimoni
 *
 * Katalog spesifikasi TIDAK di sini. Seluruh tingkatannya masih draf sampai
 * angkanya dicocokkan dengan hasil uji laboratorium, dan section yang isinya
 * kosong di beranda lebih merugikan daripada section yang tidak ada.
 */
export default async function HomePage() {
  return (
    <>
      <Hero />

      <PitaLegalitas />

      <Manifesto />

      <ServicesSection />

      <RantaiPasok />

      <ClientLogos />

      <NumbersSection />

      <TestimonialsSection testimonials={await kutipanKlien()} />

      <CtaBanner
        tag="Penawaran"
        eyebrow="Tanpa biaya"
        heading="Sebutkan kebutuhan pasokan Anda"
        body="Kalori, tonase, jadwal, dan titik serah. Setiap pesan dibalas dalam 1×24 jam kerja."
        aksiLabel="Minta Penawaran"
      />
    </>
  );
}
