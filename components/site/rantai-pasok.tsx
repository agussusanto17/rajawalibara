import Image from "next/image";
import { rantaiPasok } from "@/lib/site";
import { rantaiPasok as rantaiPasokEn } from "@/lib/site.en";
import type { Bahasa } from "@/lib/bahasa";
import { teks } from "@/lib/teks";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";

/**
 * Rantai pasok, enam tahap dari tambang sampai boiler pembeli.
 *
 * Bagian ini menggantikan "Proyek Kami" di company profile. Sepuluh foto di
 * dokumen itu tidak punya satu pun keterangan lokasi, tahun, atau klien, dan
 * menuliskannya sendiri berarti mengarang riwayat pekerjaan.
 *
 * Yang bisa dijelaskan dengan jujur adalah alurnya — dan justru itu yang
 * paling berguna. Pembeli baru sering tidak tahu apa persisnya yang dikerjakan
 * seorang trader di antara mulut tambang dan boiler mereka; menjawabnya
 * sekaligus menjelaskan kenapa perantara ini ada.
 *
 * Nomornya berarti: ini urutan yang benar-benar terjadi satu demi satu, bukan
 * daftar yang kebetulan dinomori.
 */
export function RantaiPasok({ bahasa }: { bahasa: Bahasa }) {
  const t = teks(bahasa).rantaiPasok;
  const tahapan = bahasa === "en" ? rantaiPasokEn : rantaiPasok;
  return (
    <Section bordered className="bg-surface/30">
      <div className="max-w-2xl">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 className="mt-6 text-[2.5rem] uppercase text-white sm:text-[3.5rem] lg:text-[4rem]">
          {t.judulBaris1}
          <br />
          {t.judulBaris2}
        </h2>
        <p className="mt-6 text-base leading-relaxed text-muted-fg sm:text-lg">
          {t.keterangan}
        </p>
      </div>

      <ol className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tahapan.map((tahap, i) => (
          <li key={tahap.tahap} className="flex">
            <Reveal delay={(i % 3) * 90} className="flex w-full">
              <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-background">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={tahap.foto}
                    alt={tahap.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                    className="object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em]">
                    <span className="text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
                    <span className="text-muted-fg">{tahap.tahap}</span>
                  </p>

                  <h3 className="mt-4 text-xl leading-snug text-white">
                    {tahap.judul}
                  </h3>

                  <p className="mt-2.5 text-base leading-relaxed text-muted-fg">
                    {tahap.isi}
                  </p>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
