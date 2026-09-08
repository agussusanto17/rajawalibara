import { ArrowRight, BadgeCheck, MessageCircle } from "lucide-react";
import { bilangan, fotoTentang, nav } from "@/lib/site";
import {
  alasanMemilih,
  anggotaTim,
  kantorPusat,
  misiPerusahaan,
  nilaiPerusahaan,
  profil,
  tonggak,
} from "@/lib/konten";
import { ButtonLink } from "@/components/site/button-link";
import Image from "next/image";
import { ClientLogos } from "@/components/site/client-logos";
import { KartuNilai } from "@/components/site/kartu-nilai";
import { ScrollRevealText } from "@/components/site/scroll-reveal-text";
import { CtaBanner } from "@/components/site/cta-banner";
import { KartuOrang } from "@/components/site/kartu-orang";
import { PerjalananWaktu } from "@/components/site/perjalanan-waktu";
import { Reveal } from "@/components/site/reveal";
import { PageHero } from "@/components/site/page-hero";
import { nav as navEn, bilangan as bilanganEn } from "@/lib/site.en";
import { isi as isiPola, teks } from "@/lib/teks";
import { tautan, type Bahasa } from "@/lib/bahasa";

/** Foto latar blok "kenapa bekerja dengan kami". Sama di kedua bahasa. */
const FOTO_ALASAN = "/foto/rantai-1-seleksi.webp";

/** Metadata halaman tentang kami, sama bentuknya di kedua bahasa. */
export async function metaTentangKami(bahasa: Bahasa) {
  const company = await profil(bahasa);
  return {
    judul: (bahasa === "en" ? navEn : nav)[1].label,
    deskripsi: company.history,
    jalur: tautan(bahasa, "/tentang-kami"),
  };
}

export async function TentangKami({ bahasa }: { bahasa: Bahasa }) {
  const t = teks(bahasa);
  const menu = bahasa === "en" ? navEn : nav;
  const angka = bahasa === "en" ? bilanganEn : bilangan;
  const [company, values, semuaAlasan, leadership, team, pusat, misi] =
    await Promise.all([
      profil(bahasa),
      nilaiPerusahaan(bahasa),
      alasanMemilih(bahasa),
      anggotaTim(bahasa, "PIMPINAN"),
      anggotaTim(bahasa, "TIM"),
      kantorPusat(bahasa),
      misiPerusahaan(bahasa),
    ]);
  const alasan = semuaAlasan.slice(0, 4);

  return (
    <>
      <PageHero
        bahasa={bahasa}
        eyebrow={isiPola(t.tentang.heroEyebrow, { tahun: company.founded })}
        title={t.tentang.heroJudul}
        description={t.tentang.heroIsi}
        breadcrumb={[{ label: menu[1].label }]}
        fakta={[
          {
              label: t.tentang.faktaBerdiri,
              nilai: String(company.founded),
              catatan: t.tentang.faktaBerdiriCatatan,
            },
          {
              label: t.tentang.faktaKantor,
              nilai: pusat.alamatSingkat,
              catatan: t.tentang.faktaKantorCatatan,
            },
          {
            label: t.tentang.faktaKlien,
            nilai: isiPola(t.tentang.jumlahPerusahaan, { jumlah: company.clientCount }),
            catatan: t.tentang.faktaKlienCatatan,
          },
        ]}
        aksi={
          <>
            <ButtonLink href={tautan(bahasa, "/layanan")} size="lg" className="w-full rounded-lg px-6 sm:w-auto">
              {t.tentang.lihatLayanan}
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink
              href={company.whatsappHref}
              size="lg"
              variant="outline"
              className="w-full rounded-lg border-line-strong px-6 text-white hover:bg-white/[0.06] sm:w-auto"
            >
              <MessageCircle className="size-4" />
              {t.tentang.tanyaWhatsapp}
            </ButtonLink>
          </>
        }
      />

      {/* 2 ------------------------------------------------------ Logo klien */}
      <ClientLogos bahasa={bahasa} terang />

      {/* 3 -------------------------------------------------- Tentang kami */}
      <section className="bg-white py-24 text-ink-strong sm:py-32">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-16">
            <Reveal>
              <p className="text-sm font-medium text-ink-strong/60">
                Tentang {company.name}
              </p>
            </Reveal>
            {/* Efek yang sama dengan Manifesto di beranda: kata menyala
                mengikuti gulir, bukan muncul sekaligus. */}
            <ScrollRevealText
              text={company.history}
              className="text-[1.6rem] font-semibold leading-[1.28] tracking-[-0.035em] sm:text-[2rem] lg:text-[2.4rem]"
            />
          </div>

          {/* Dua foto sejajar, tidak melebar penuh, mengikuti referensi. */}
          <Reveal
            delay={180}
            className="mt-16 grid max-w-4xl gap-5 sm:mt-20 sm:grid-cols-2"
          >
            {fotoTentang.map((f) => (
              <div
                key={f.url}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={f.url}
                  alt={f.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="object-cover grayscale"
                />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 3b ------------------------------------------------------ Visi & misi */}
      {/* Bagiannya ada karena footer menautkannya. Di project asal tautan
          #visi-misi menunjuk ke jangkar yang tidak pernah dibuat, sehingga
          kliknya hanya melompat ke puncak halaman. */}
      <section
        id="visi-misi"
        className="scroll-mt-24 bg-white pb-24 text-ink-strong sm:pb-32"
      >
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="text-[2rem] leading-[1.1] sm:text-[2.75rem]">Visi</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-strong/70">
              {company.vision}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="text-[2rem] leading-[1.1] sm:text-[2.75rem]">Misi</h2>
            <ol className="mt-6 space-y-5">
              {misi.map((m, i) => (
                <li key={m} className="flex gap-4">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-ink-strong/[0.06] text-sm font-semibold tabular-nums text-ink-strong/70">
                    {i + 1}
                  </span>
                  <p className="text-[0.95rem] leading-relaxed text-ink-strong/70">
                    {m}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* 4 ------------------------------------------------------------ Nilai */}
      {/* Sumbu X dijepit: kartu di dalamnya ber-transform, dan kalau suatu
          saat ada yang melampaui lebar layar, halaman tidak ikut bisa
          digeser ke samping. */}
      <section className="bg-white pb-24 text-ink-strong [overflow-x:clip] sm:pb-32">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1fr_262px] lg:items-end lg:gap-16">
            <Reveal>
              <h2 className="text-[2.5rem] leading-[1.05] sm:text-[3.5rem] lg:text-[4.25rem]">
                {isiPola(t.tentang.nilaiJudulBaris1, { bilangan: angka(values.length) })}
                <br />
                {t.tentang.nilaiJudulBaris2}
              </h2>
            </Reveal>
            <Reveal delay={120} className="lg:pb-4">
              <p className="text-base leading-relaxed text-ink-strong/65 sm:text-lg">
                {t.tentang.nilaiKeterangan}
              </p>
            </Reveal>
          </div>

          <KartuNilai items={values} />
        </div>
      </section>

      {/* 5 ------------------------------------------------- Perjalanan kami */}
      <PerjalananWaktu bahasa={bahasa} perjalanan={await tonggak(bahasa)} />

      {/* 6 ---------------------------------------------------------- Alasan */}
      <section
        id="keunggulan"
        className="scroll-mt-24 bg-white py-24 text-ink-strong sm:py-32"
      >
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1fr_262px] lg:items-end lg:gap-16">
            <Reveal>
              <h2 className="text-[2.5rem] leading-[1.05] sm:text-[3.5rem] lg:text-[4.25rem]">
                {t.tentang.alasanJudulBaris1}
                <br />
                {t.tentang.alasanJudulBaris2}
              </h2>
            </Reveal>
            <Reveal delay={120} className="flex flex-col items-start gap-6 lg:pb-4">
              <p className="text-base leading-relaxed text-ink-strong/65 sm:text-lg">
                {t.tentang.alasanKeterangan}
              </p>
              <ButtonLink href={tautan(bahasa, "/hubungi-kami")} size="lg" className="rounded-lg">
                {t.angka.mulaiDiskusi}
                <ArrowRight className="size-4" />
              </ButtonLink>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-5 sm:mt-20 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <div className="relative h-full min-h-[22rem] overflow-hidden rounded-2xl">
                <Image
                  src={FOTO_ALASAN}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <ul className="grid gap-5 sm:grid-cols-2">
              {alasan.map((a, i) => (
                <li key={a.title} className="flex">
                  <Reveal
                    delay={100 + i * 80}
                    // Dua di tengah berwarna, dua di ujung netral: pola
                    // selang-seling yang sama dengan referensi.
                    className={`flex h-full w-full flex-col rounded-2xl p-7 ${
                      i === 1 || i === 2
                        ? "bg-clay"
                        : "bg-ink-strong/[0.05]"
                    }`}
                  >
                    <span className="text-sm font-semibold tabular-nums text-gold-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-auto pt-10 text-[1.3rem] font-semibold leading-snug">
                      {a.title}
                    </h3>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-strong/65">
                      {a.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7 --------------------------------------------------------- Pimpinan */}
      <section
        id="tim"
        className="scroll-mt-24 bg-white pb-24 text-ink-strong sm:pb-32"
      >
        <div className="shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-ink-strong/[0.06] px-4 py-1.5 text-sm font-medium text-ink-strong/70">
              Pimpinan
            </span>
            <h2 className="mt-6 text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[3rem]">
              {isiPola(t.tentang.pimpinanJudul, { nama: company.name })}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-strong/60 sm:text-lg">
              {t.tentang.pimpinanKeterangan}
            </p>
          </Reveal>

          {/* Tiga orang, tiga kolom, potret tegak.
              Kartu mendatar dua kolom menyisakan satu kartu sendirian di baris
              kedua — susunan yang tanpa sengaja menempatkan orang ketiga di
              posisi berbeda dari dua lainnya. Jumlah orangnya memang tiga, dan
              tiga kolom yang menampungnya rata.

              Di ponsel tetap dua kolom, bukan satu. Satu kolom membuat tiap
              potret setinggi 419px, dan selama fotonya belum ada yang terisi
              hanyalah panel inisial — tiga layar penuh huruf. */}
          <ul className="mt-14 grid grid-cols-2 gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-3">
            {leadership.map((p, i) => (
              <li key={p.name} className="flex">
                <Reveal delay={i * 100} className="flex w-full">
                  <article className="flex w-full flex-col overflow-hidden rounded-2xl bg-ink-strong/[0.05]">
                    {/* Dijaga, bukan dipaksa dengan `!`: pimpinan tanpa foto
                        akan membuat <Image src={undefined}> dan merusak
                        halaman. Yang belum berfoto memakai panel inisial. */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      {p.photo ? (
                        <Image
                          src={p.photo}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                          className="object-cover"
                        />
                      ) : (
                        <KartuOrang orang={p} hanyaFoto />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4 sm:p-7">
                      <p className="flex items-start gap-1.5 text-xs font-medium leading-snug text-gold-ink sm:gap-2 sm:text-sm">
                        <BadgeCheck className="mt-px size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
                        {p.role}
                      </p>
                      <h3 className="mt-2 text-[1.05rem] font-semibold leading-snug sm:mt-3 sm:text-[1.25rem]">
                        {p.name}
                      </h3>
                      {p.bio && (
                        <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-strong/65">
                          {p.bio}
                        </p>
                      )}
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 -------------------------------------------------------------- Tim */}
      {/* Disembunyikan saat kosong. Judul beserta paragrafnya yang berdiri di
          atas kisi kosong terbaca sebagai halaman yang gagal memuat datanya,
          bukan sebagai tim yang memang belum diisi — dan company profile
          memang hanya memuat jajaran direksi. */}
      {team.length > 0 && (
      <section className="bg-white pb-24 text-ink-strong sm:pb-32">
        <div className="shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-[2.25rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[3rem]">
              {t.tentang.timJudul}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-strong/65 sm:text-lg">
              {t.tentang.timKeterangan}
            </p>
          </Reveal>

          <ul className="mt-14 grid grid-cols-2 gap-5 sm:mt-16 sm:grid-cols-3 lg:grid-cols-5">
            {team.map((p, i) => (
              <li key={p.name}>
                <Reveal delay={(i % 5) * 70}>
                  <KartuOrang orang={p} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      <CtaBanner
        bahasa={bahasa}
        tag={t.umum.tagKonsultasi}
        eyebrow={t.umum.tanpaBiaya}
        heading={t.tentang.ctaJudul}
        body={t.tentang.ctaIsi}
      />
    </>
  );
}
