import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { fotoLayanan } from "@/lib/site";
import { kelompokLayanan } from "@/lib/konten";
import { ButtonLink } from "@/components/site/button-link";
import { Icon } from "@/components/site/icon-map";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";

/**
 * Tiga kelompok layanan, bernomor.
 *
 * Nomornya bukan hiasan: company profile sendiri menomori ketiganya 01–03, dan
 * urutan itu memang berarti — perdagangan lebih dulu ada, logistik menyusul
 * untuk mengantarkannya, pemenuhan kebutuhan industri adalah hasil akhirnya.
 *
 * `covers` dirender sebagai butir, bukan disembunyikan. Di kelompok ketiga
 * butir itulah isinya yang paling dicari: pembaca ingin tahu apakah sektornya
 * sendiri ada di daftar.
 */
export async function ServicesSection() {
  const serviceGroups = await kelompokLayanan();
  if (serviceGroups.length === 0) return null;

  return (
    <Section id="layanan">
      <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end lg:gap-16">
        <Reveal>
          <p className="eyebrow">KBLI 46710</p>
          <h2 className="mt-6 text-[2.5rem] uppercase text-white sm:text-[3.5rem] lg:text-[4rem]">
            Layanan
            <br />
            yang kami jalankan
          </h2>
        </Reveal>

        <Reveal delay={120} className="flex flex-col items-start gap-6 lg:pb-4">
          <p className="text-base leading-relaxed text-muted-fg sm:text-lg">
            Dari pemilihan tambang sampai kargo diterima di lokasi Anda.
          </p>
          <ButtonLink href="/layanan" size="lg" className="rounded-lg">
            Rincian Layanan
            <ArrowRight className="size-4" />
          </ButtonLink>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-5 lg:grid-cols-3">
        {serviceGroups.map((s, i) => {
          const foto = fotoLayanan[s.title];
          return (
            <Reveal key={s.title} delay={i * 90} className="flex">
              <article className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-brand/40">
                {foto && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={foto.url}
                      alt={foto.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-surface via-surface/25 to-transparent"
                    />
                    <span className="angka absolute left-5 top-5 text-sm font-medium text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <span className="text-brand">
                    <Icon name={s.icon} className="size-7" strokeWidth={1.5} />
                  </span>

                  <h3 className="mt-5 text-[1.4rem] leading-[1.2] text-white">
                    {s.title}
                  </h3>

                  <p className="mt-3 text-base leading-relaxed text-muted-fg">
                    {s.body}
                  </p>

                  {s.covers.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-5">
                      {s.covers.map((c) => (
                        <li
                          key={c}
                          className="rounded-md bg-white/[0.05] px-3 py-1.5 text-[0.8rem] text-muted-fg"
                        >
                          {/* Kode KBLI di depan nama panjangnya tidak berarti
                              apa-apa di dalam chip sesempit ini; yang dipakai
                              cukup bagian setelah tanda pisah. */}
                          {c.includes(" — ") ? c.split(" — ")[1] : c}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
