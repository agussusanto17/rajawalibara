import { ArrowRight } from "lucide-react";
import { profil, type Profil } from "@/lib/konten";
import { tautan, type Bahasa } from "@/lib/bahasa";
import { teks } from "@/lib/teks";
import { produkTerbit } from "@/lib/konten";
import { ButtonLink } from "@/components/site/button-link";
import { CountUp } from "@/components/site/count-up";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";
import { cn } from "@/lib/utils";

const YEAR_NOW = 2026;

/**
 * Tiga angka yang bisa dipertanggungjawabkan, bukan proyeksi.
 *
 * Jumlah produk masuk sebagai parameter, bukan dibaca saat modul dimuat:
 * angkanya kini datang dari basis data, dan konstanta tingkat modul akan
 * membekukan nilainya pada saat berkas ini pertama diimpor.
 */
const statistik = (jumlahProduk: number, company: Profil) => [
  {
    value: company.clientCount,
    unit: "+",
    body: "Perusahaan di sektor industri, energi, dan manufaktur yang kami layani.",
    tone: "brand" as const,
  },
  {
    value: jumlahProduk,
    unit: "",
    body: "Tingkatan batubara yang tersedia, spesifikasinya dapat disesuaikan.",
    tone: "light" as const,
  },
  {
    value: YEAR_NOW - company.founded,
    unit: "thn",
    body: `Berdagang batubara dari Kalimantan Timur. Berdiri ${company.founded}.`,
    tone: "dark" as const,
  },
];

export async function NumbersSection({ bahasa }: { bahasa: Bahasa }) {
  const t = teks(bahasa);
  const [products, company] = await Promise.all([
    produkTerbit(bahasa),
    profil(bahasa),
  ]);
  const STATS = statistik(products.length, company);
  return (
    <Section id="angka" className="relative overflow-hidden">
      {/* Dua sumber cahaya di dasar section, sejalan dengan dasar hero:
          emas pekat di pojok kiri, lalu pita terang melintang ke kanan.
          Nilainya ditulis sebagai rgba, bukan token, karena radial-gradient
          butuh alpha per titik henti — dan justru karena itu ia tidak ikut
          berubah saat palet diganti. Cocokkan manual dengan --brand-gold
          (212,175,79) dan --brand-gold-bright (236,211,131) bila warnanya
          digeser lagi.
          Pusatnya ditaruh di bawah tepi section supaya yang masuk ke layar
          hanya bagian atas pancarannya, bukan bulatan penuh. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem] bg-[radial-gradient(55%_78%_at_62%_116%,rgba(247,239,219,0.50),rgba(212,175,79,0.16)_45%,transparent_72%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-[26rem] w-[44rem] bg-[radial-gradient(58%_80%_at_20%_108%,rgba(236,211,131,0.58),rgba(212,175,79,0.24)_38%,transparent_74%)]"
      />

      <div className="relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_262px] lg:items-end lg:gap-16">
          <Reveal>
            <h2 className="text-[2.5rem] uppercase text-white sm:text-[3.5rem] lg:text-[4rem]">
              {t.angka.judulBaris1}
                <br />
                {t.angka.judulBaris2}
            </h2>
          </Reveal>

          <Reveal
            delay={120}
            className="flex flex-col items-start gap-6 lg:pb-4"
          >
            <p className="text-base leading-relaxed text-muted-fg sm:text-lg">
              {t.angka.keterangan}
            </p>
            <ButtonLink href={tautan(bahasa, "/hubungi-kami")} size="lg" className="rounded-lg">
              {t.angka.mulaiDiskusi}
              <ArrowRight className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>

        {/* Kartu pertama sengaja lebih lebar: angka klien adalah bukti utama. */}
        <div className="mt-16 grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr]">
          {STATS.map((s, i) => (
            <Reveal key={s.body} delay={i * 90} className="flex">
              <article
                className={cn(
                  "flex min-h-[21rem] w-full flex-col rounded-2xl p-8",
                  s.tone === "brand" && "bg-brand text-background",
                  s.tone === "light" && "bg-white text-background",
                  s.tone === "dark" &&
                    "border border-line bg-surface text-white",
                )}
              >
                <p className="flex items-start font-semibold tracking-[-0.05em]">
                  <CountUp
                    value={s.value}
                    className="text-[5.5rem] leading-[0.85] sm:text-[7rem] lg:text-[8rem]"
                  />
                  {s.unit && (
                    <span className="mt-2 text-3xl leading-none sm:mt-3 sm:text-4xl">
                      {s.unit}
                    </span>
                  )}
                </p>

                <p
                  className={cn(
                    "mt-auto pt-12 text-base leading-relaxed",
                    s.tone === "dark" ? "text-muted-fg" : "text-background/70",
                  )}
                >
                  {s.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
