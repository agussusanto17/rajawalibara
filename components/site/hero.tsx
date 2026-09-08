import { ArrowRight } from "lucide-react";
import { isiBeranda, kantorPusat, profil, slideHero } from "@/lib/konten";
import { tautan, type Bahasa } from "@/lib/bahasa";
import { Sorotan } from "@/components/site/sorotan";
import { ButtonLink } from "@/components/site/button-link";
import { HeroSlider } from "@/components/site/hero-slider";

/** Jeda animasi masuk, mengikuti urutan baca dari atas ke bawah. */
const step = (ms: number) => ({ animationDelay: `${ms}ms` });

/**
 * Hero beranda: foto operasi berganti di belakang, copy diam di depan.
 *
 * Eyebrow-nya nomor NIB, bukan kata sambutan. Yang membuka halaman ini bagian
 * pengadaan yang sedang memeriksa apakah pemasoknya nyata, dan nomor yang bisa
 * dicek sendiri di oss.go.id menjawab pertanyaan itu di baris pertama — jauh
 * sebelum paragraf mana pun sempat dibaca.
 */
export async function Hero({ bahasa }: { bahasa: Bahasa }) {
  const [company, isi, pusat, slides] = await Promise.all([
    profil(bahasa),
    isiBeranda(bahasa),
    kantorPusat(bahasa),
    slideHero(bahasa),
  ]);

  return (
    <section className="relative isolate flex min-h-[min(92svh,52rem)] flex-col justify-end overflow-hidden border-b border-line">
      <HeroSlider slides={slides} />

      {/* Latar cadangan saat belum ada satu pun foto diunggah. Hero tetap
          berdiri; yang hilang cuma suasananya. */}
      {slides.length === 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_100%,rgba(212,175,79,0.12),transparent_60%)]"
        />
      )}

      <div className="shell relative z-[5] pb-28 pt-36 sm:pb-32 sm:pt-48">
        <p className="rise eyebrow" style={step(0)}>
          NIB 1294000602642
        </p>

        <h1
          // Lebar judul dijaga di paruh kiri layar, tempat scrim benar-benar
          // pekat. Pada 19ch judulnya melebar sampai 69% layar dan masuk ke
          // bagian yang sengaja dibiarkan terang — kontrasnya terukur 2,78:1
          // untuk putih dan 1,33:1 untuk emas, dua-duanya gagal.
          className="rise mt-7 max-w-[16ch] text-[2.6rem] uppercase leading-[0.96] text-white sm:text-[3.75rem] lg:text-[4.5rem]"
          style={step(80)}
        >
          <Sorotan teks={isi.judul} />
        </h1>

        <p
          className="rise mt-7 max-w-xl text-lg leading-relaxed text-white/70"
          style={step(160)}
        >
          {isi.intro}
        </p>

        <div
          className="rise mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          style={step(240)}
        >
          <ButtonLink
            href={tautan(bahasa, isi.ctaUtamaHref)}
            size="lg"
            className="w-full rounded-lg sm:w-auto"
          >
            <span className="hidden sm:inline">{isi.ctaUtamaLabel}</span>
            <span className="sm:hidden">{isi.ctaUtamaLabelPendek}</span>
            <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink
            href={tautan(bahasa, isi.ctaKeduaHref)}
            size="lg"
            variant="outline"
            className="w-full rounded-lg sm:w-auto"
          >
            <span className="hidden sm:inline">{isi.ctaKeduaLabel}</span>
            <span className="sm:hidden">{isi.ctaKeduaLabelPendek}</span>
          </ButtonLink>
        </div>

        <p
          className="rise mt-10 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/55"
          style={step(320)}
        >
          {pusat.alamatSingkat}
          <span className="mx-2.5 text-white/20">·</span>
          {company.phone}
        </p>
      </div>
    </section>
  );
}
