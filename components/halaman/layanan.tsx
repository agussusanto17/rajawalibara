import Image from "next/image";
import { ArrowRight, Check, Plus } from "lucide-react";
import { faqSchema, productSchema } from "@/lib/seo";
import { fotoLayanan } from "@/lib/site";
import { fotoLayanan as fotoLayananEn, nav as navEn } from "@/lib/site.en";
import { nav } from "@/lib/site";
import { isi as isiPola, teks } from "@/lib/teks";
import { tautan, type Bahasa } from "@/lib/bahasa";
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

/** Metadata halaman layanan, sama bentuknya di kedua bahasa. */
export async function metaLayanan(bahasa: Bahasa) {
  const grup = await kelompokLayanan(bahasa);
  const judul = (bahasa === "en" ? navEn : nav)[2].label;
  return {
    judul,
    deskripsi:
      bahasa === "en"
        ? `Domestic and export coal trading, logistics and shipping management, and industrial energy supply. ${grup.length} service lines with specifications adjustable on request.`
        : `Perdagangan batubara domestik dan ekspor, manajemen logistik dan pengapalan, serta pemenuhan kebutuhan energi industri. ${grup.length} lini layanan dengan spesifikasi yang dapat disesuaikan permintaan.`,
    jalur: tautan(bahasa, "/layanan"),
  };
}

export async function Layanan({ bahasa }: { bahasa: Bahasa }) {
  const t = teks(bahasa);
  const foto = bahasa === "en" ? fotoLayananEn : fotoLayanan;
  const menu = bahasa === "en" ? navEn : nav;
  const [grup, kbli, tingkatan, alur, tanya, company] = await Promise.all([
    kelompokLayanan(bahasa),
    bidangUsaha(bahasa),
    produkTerbit(bahasa),
    langkah(bahasa),
    faq(bahasa),
    profil(bahasa),
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
        eyebrow={t.layanan.heroEyebrow}
        title={menu[2].label}
        description={t.layanan.heroIsi}
        breadcrumb={[{ label: "Layanan" }]}
      />

      {/* 1 -------------------------------------------------- Kelompok layanan */}
      {/* Blok besar berselang-seling, bukan kartu berjajar: ketiganya punya
          cakupan yang perlu dibaca, dan kartu sempit memaksa daftarnya
          dipotong. */}
      <Section>
        <ol className="flex flex-col gap-20 sm:gap-28">
          {grup.map((g, i) => {
            const gambar = foto[g.title];
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
                        src={gambar.url}
                        alt={gambar.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 560px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-surface text-sm text-muted-fg">
                        {t.layanan.fotoBelum}
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
              {t.layanan.spesifikasiJudulBaris1}
              <br />
              {t.layanan.spesifikasiJudulBaris2}
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:pb-3">
            <p className="text-base leading-relaxed text-muted-fg">
              {t.layanan.spesifikasiKeterangan}
            </p>
          </Reveal>
        </div>

        {tingkatan.length > 0 ? (
          <>
            <Reveal className="mt-12">
              <TabelSpesifikasi tingkatan={tingkatan} />
            </Reveal>

            <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-muted-fg">
              {t.layanan.spesifikasiCatatan}
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
                  {t.layanan.spesifikasiKosongJudul}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted-fg">
                  {t.layanan.spesifikasiKosongIsi}
                </p>
              </div>
              <ButtonLink
                href="/hubungi-kami"
                size="lg"
                className="shrink-0 rounded-lg"
              >
                {t.umum.mintaPenawaran}
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
            <p className="eyebrow">
                {isiPola(t.layanan.alurLangkah, { jumlah: alur.length })}
              </p>
            <h2 className="mt-6 text-[2.25rem] uppercase text-white sm:text-[3rem]">
              {t.layanan.alurJudulBaris1}
                <br />
                {t.layanan.alurJudulBaris2}
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
              <p className="eyebrow">{t.layanan.legalitasJudul}</p>
              <h2 className="mt-6 text-[2rem] uppercase leading-[1.08] text-white sm:text-[2.5rem]">
                {t.layanan.bidangUsahaBaris1}
                  <br />
                  {t.layanan.bidangUsahaBaris2}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-fg">
                {isiPola(t.layanan.lampiranIsi, { nib: company.nib })}
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
              <p className="eyebrow">{t.layanan.faqEyebrow}</p>
              <h2 className="mt-6 text-[2rem] uppercase leading-[1.08] text-white sm:text-[2.5rem]">
                {t.layanan.faqJudulBaris1}
                  <br />
                  {t.layanan.faqJudulBaris2}
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
        bahasa={bahasa}
        tag={t.umum.tagPenawaran}
        eyebrow={t.umum.tanpaBiaya}
        heading={t.layanan.ctaJudul}
        body={t.layanan.ctaIsi}
        aksiLabel={t.umum.mintaPenawaran}
      />
    </>
  );
}
