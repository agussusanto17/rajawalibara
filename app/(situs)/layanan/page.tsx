import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check, Plus } from "lucide-react";
import { canonical, faqSchema, productSchema } from "@/lib/seo";
import { fotoLayanan } from "@/lib/site";
import {
  bidangUsaha,
  faq,
  kelompokLayanan,
  langkah,
  produkTerbit,
  profil,
} from "@/lib/konten";
import { PageHero } from "@/components/site/page-hero";
import { TabelSpesifikasi } from "@/components/site/tabel-spesifikasi";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { ButtonLink } from "@/components/site/button-link";
import { CtaBanner } from "@/components/site/cta-banner";
import { Icon } from "@/components/site/icon-map";
import { JsonLd } from "@/components/site/json-ld";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const grup = await kelompokLayanan();
  return {
    title: "Layanan",
    description: `Perdagangan batubara domestik dan ekspor, manajemen logistik dan pengapalan, serta pemenuhan kebutuhan energi industri. ${grup.length} lini layanan dengan spesifikasi yang dapat disesuaikan permintaan.`,
    ...canonical("/layanan"),
    openGraph: { type: "website", url: "/layanan", title: "Layanan" },
  };
}

export default async function LayananPage() {
  const [grup, kbli, tingkatan, alur, tanya, company] = await Promise.all([
    kelompokLayanan(),
    bidangUsaha(),
    produkTerbit(),
    langkah(),
    faq(),
    profil(),
  ]);

  return (
    <>
      <JsonLd data={faqSchema(tanya)} />
      {/* Satu penanda Product per tingkatan. Tabel spesifikasi di bawah adalah
          satu-satunya tempat angka-angka itu tayang, jadi di sinilah
          penandanya tinggal — bukan di halaman detail yang sudah dibuang. */}
      {tingkatan.map((t) => (
        <JsonLd
          key={t.slug}
          data={productSchema({
            slug: t.slug,
            name: t.name,
            full: t.full,
            summary: t.summary,
            specs: t.specs,
          })}
        />
      ))}

      <PageHero
        eyebrow="KBLI 46710 · 46610"
        title="Layanan"
        description="Batubara dari sumber tambang terseleksi, diantar sampai titik serah yang Anda tentukan — dengan spesifikasi dan dokumen yang bisa diperiksa."
        breadcrumb={[{ label: "Layanan" }]}
      />

      {/* 1 -------------------------------------------------- Kelompok layanan */}
      {/* Blok besar berselang-seling, bukan kartu berjajar: ketiganya punya
          cakupan yang perlu dibaca, dan kartu sempit memaksa daftarnya
          dipotong. */}
      <Section>
        <ol className="flex flex-col gap-20 sm:gap-28">
          {grup.map((g, i) => {
            const foto = fotoLayanan[g.title];
            const balik = i % 2 === 1;
            return (
              <li
                key={g.title}
                id={`layanan-${i + 1}`}
                className="scroll-mt-28 grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal className={balik ? "lg:order-2" : undefined}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                    {foto ? (
                      <Image
                        src={foto.url}
                        alt={foto.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 560px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-surface text-sm text-muted-fg">
                        Foto belum diunggah
                      </div>
                    )}
                  </div>
                </Reveal>

                <Reveal delay={120} className={balik ? "lg:order-1" : undefined}>
                  <div className="flex items-center gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-line bg-surface text-brand">
                      <Icon name={g.icon} className="size-5" strokeWidth={1.5} />
                    </span>
                    <span className="angka text-sm font-medium text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="h-px flex-1 bg-line" />
                  </div>

                  <h2 className="mt-6 text-[1.9rem] leading-[1.12] text-white sm:text-[2.5rem]">
                    {g.title}
                  </h2>

                  <p className="mt-5 text-base leading-relaxed text-muted-fg sm:text-lg">
                    {g.body}
                  </p>

                  {g.covers.length > 0 && (
                    <ul className="mt-8 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                      {g.covers.map((c) => (
                        <li
                          key={c}
                          className="flex items-start gap-2.5 text-[0.95rem] leading-snug text-white/85"
                        >
                          <Check
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-brand"
                            strokeWidth={2.5}
                          />
                          {c.includes(" — ") ? c.split(" — ")[1] : c}
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* 2 ------------------------------------------------ Spesifikasi kargo */}
      <Section bordered id="spesifikasi" className="scroll-mt-24 bg-surface/30">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow">GAR 4.200 – 5.800 kcal/kg</p>
            <h2 className="mt-6 text-[2.25rem] uppercase text-white sm:text-[3rem]">
              Spesifikasi
              <br />
              yang kami pasok
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:pb-3">
            <p className="text-base leading-relaxed text-muted-fg">
              Parameter dapat digeser mengikuti kebutuhan boiler Anda, lalu
              dituangkan sebagai parameter kontrak beserta toleransinya.
            </p>
          </Reveal>
        </div>

        {tingkatan.length > 0 ? (
          <>
            <Reveal className="mt-12">
              <TabelSpesifikasi tingkatan={tingkatan} />
            </Reveal>

            <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-muted-fg">
              Nilai di atas kisaran tipikal. Hasil uji laboratorium kargo yang
              bersangkutan diserahkan bersama penawaran — bukan menyusul
              setelah kargo berangkat.
            </p>
          </>
        ) : (
          /* Kosong bukan kegagalan: katalognya memang belum diterbitkan sampai
             angkanya dicocokkan dengan hasil uji laboratorium. Yang ditawarkan
             di sini jalan keluarnya, bukan permintaan maaf. */
          <Reveal className="mt-12">
            <div className="flex flex-col items-start gap-6 rounded-2xl border border-dashed border-line-strong p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <div className="max-w-xl">
                <h3 className="text-xl text-white">
                  Tabel spesifikasi sedang disiapkan
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted-fg">
                  Sementara ini, sebutkan kebutuhan kalori, tonase, jadwal, dan
                  titik serah Anda. Penawaran dikirim beserta hasil uji
                  laboratorium kargo yang dimaksud, bukan spesifikasi umum.
                </p>
              </div>
              <ButtonLink
                href="/hubungi-kami"
                size="lg"
                className="shrink-0 rounded-lg"
              >
                Minta Penawaran
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </Reveal>
        )}
      </Section>

      {/* 3 ----------------------------------------------------- Alur pesanan */}
      {alur.length > 0 && (
        <Section bordered>
          <div className="max-w-2xl">
            <p className="eyebrow">{alur.length} langkah</p>
            <h2 className="mt-6 text-[2.25rem] uppercase text-white sm:text-[3rem]">
              Dari permintaan
              <br />
              sampai serah terima
            </h2>
          </div>

          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {alur.map((l, i) => (
              <li key={l.title} className="flex">
                <Reveal
                  delay={(i % 3) * 80}
                  className="flex h-full w-full flex-col gap-4 rounded-2xl border border-line bg-background p-7 sm:p-8"
                >
                  <span className="angka text-4xl font-semibold leading-none text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg leading-snug text-white">{l.title}</h3>
                  <p className="text-base leading-relaxed text-muted-fg">
                    {l.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* 4 ----------------------------------------------------- Bidang usaha */}
      {kbli.length > 0 && (
        <Section bordered className="bg-surface/30">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <p className="eyebrow">Lampiran NIB</p>
              <h2 className="mt-6 text-[2rem] uppercase leading-[1.08] text-white sm:text-[2.5rem]">
                Bidang usaha
                <br />
                resmi
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-fg">
                Teks apa adanya dari lampiran NIB {company.nib}. Perizinan
                berusaha hanya berlaku untuk kode dan ruang lingkup yang
                tercantum di sana.
              </p>
            </div>

            <ul className="divide-y divide-line border-y border-line">
              {kbli.map((n) => {
                const kode = n.match(/\b(\d{5})\b/)?.[1];
                const judul = n.includes(" — ") ? n.split(" — ")[1] : n;
                return (
                  <li key={n} className="flex gap-6 py-5">
                    <span className="angka shrink-0 text-base font-medium text-brand">
                      {kode ?? "—"}
                    </span>
                    <span className="text-base leading-relaxed text-white/85">
                      {judul}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Section>
      )}

      {/* 5 ------------------------------------------------------------- FAQ */}
      {tanya.length > 0 && (
        <Section bordered>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <div>
              <p className="eyebrow">Pertanyaan umum</p>
              <h2 className="mt-6 text-[2rem] uppercase leading-[1.08] text-white sm:text-[2.5rem]">
                Yang sering
                <br />
                ditanyakan
              </h2>
            </div>

            {/* <details> bawaan peramban, bukan accordion buatan sendiri:
                membuka dan menutup tetap bekerja tanpa JavaScript, sudah
                aksesibel dari sananya, dan seluruh jawabannya berada di DOM
                untuk mesin telusur. */}
            <div className="divide-y divide-line border-y border-line">
              {tanya.map((f) => (
                <details key={f.q} className="group">
                  {/* Padding di summary, bukan di details: dengan begitu
                      seluruh baris pertanyaan jadi area klik setinggi 64px,
                      bukan satu baris teks setinggi 24px yang harus dibidik. */}
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-base font-medium text-white marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                    {f.q}
                    <Plus
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-brand transition-transform duration-200 group-open:rotate-45"
                    />
                  </summary>
                  <p className="max-w-2xl pb-5 pr-10 text-base leading-relaxed text-muted-fg">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      <CtaBanner
        tag="Penawaran"
        eyebrow="Tanpa biaya"
        heading="Sebutkan spesifikasi yang Anda cari"
        body="Kalori, tonase, jadwal, dan titik serah. Setiap pesan dibalas dalam 1×24 jam kerja."
        aksiLabel="Minta Penawaran"
      />
    </>
  );
}
