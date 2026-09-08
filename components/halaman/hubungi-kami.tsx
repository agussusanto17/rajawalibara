import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/site/button-link";
import { ContactForm } from "@/components/site/contact-form";
import { PageHero } from "@/components/site/page-hero";
import { PetaKantor } from "@/components/site/peta-kantor";
import { Reveal } from "@/components/site/reveal";
import { daftarKantor, produkTerbit, profil, type Profil } from "@/lib/konten";
import { isi as isiPola, teks } from "@/lib/teks";
import { tautan, type Bahasa } from "@/lib/bahasa";
import { nav } from "@/lib/site";
import { nav as navEn } from "@/lib/site.en";

/**
 * Tiga kanal kontak, disusun dari naskah dan profil perusahaan.
 *
 * Nomor telepon dan alamat disisipkan lewat penanda {telepon} dan {alamat},
 * bukan disambung dengan `+`. Urutan kata kalimatnya berbeda antara bahasa
 * Indonesia dan Inggris, dan penyambungan memaksa keduanya memakai urutan
 * yang sama.
 */
const daftarKanal = (
  bahasa: Bahasa,
  company: Profil,
  alamatSingkat: string,
) => {
  const t = teks(bahasa).kontak;
  return [
    {
      icon: MessageCircle,
      title: t.kanalBicaraJudul,
      body: isiPola(t.kanalBicaraIsi, { telepon: company.phone }),
      aksi: teks(bahasa).umum.bukaWhatsapp,
      href: company.whatsappHref,
    },
    {
      icon: Mail,
      title: t.kanalEmailJudul,
      body: t.kanalEmailIsi,
      aksi: company.email,
      href: `mailto:${company.email}`,
    },
    {
      icon: MapPin,
      title: t.kanalKantorJudul,
      body: isiPola(t.kanalKantorIsi, { alamat: alamatSingkat }),
      aksi: t.lihatDiPeta,
      href: "#peta",
    },
  ];
};

export async function HubungiKami({ bahasa }: { bahasa: Bahasa }) {
  const t = teks(bahasa);
  const menu = bahasa === "en" ? navEn : nav;
  const [company, kantor, produk] = await Promise.all([
    profil(bahasa),
    daftarKantor(bahasa),
    produkTerbit(bahasa),
  ]);
  const pusat = kantor.find((k) => k.jenis === "PUSAT") ?? kantor[0];
  const kanal = daftarKanal(bahasa, company, pusat.alamatSingkat);

  return (
    <>
      <PageHero
        bahasa={bahasa}
        eyebrow={t.kontak.heroEyebrow}
        title={t.kontak.heroJudul}
        description={t.kontak.heroIsi}
        breadcrumb={[{ label: menu[3].label }]}
        fakta={[
          {
            label: t.kontak.faktaTelepon,
            nilai: company.phone,
            href: company.whatsappHref,
          },
          {
            label: t.kontak.faktaEmail,
            nilai: company.email,
            href: `mailto:${company.email}`,
          },
          {
            label: t.kontak.faktaKantor,
            nilai: isiPola(t.kontak.jumlahLokasi, { jumlah: kantor.length }),
            catatan: kantor.map((k) => k.alamatSingkat).join(" · "),
          },
        ]}
        aksi={
          <>
            <ButtonLink
              href="#formulir"
              size="lg"
              className="w-full rounded-lg px-6 sm:w-auto"
            >
              {t.umum.kirimPesan}
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink
              href={company.whatsappHref}
              size="lg"
              variant="outline"
              className="w-full rounded-lg border-line-strong px-6 text-white hover:bg-white/[0.06] sm:w-auto"
            >
              <MessageCircle className="size-4" />
              {t.kontak.tanyaWhatsapp}
            </ButtonLink>
          </>
        }
      />

      {/* Tiga kartu kanal, tepat di bawah hero. */}
      <section className="border-b border-line py-16 sm:py-20">
        <div className="shell">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kanal.map((k, i) => (
              <li key={k.title} className="flex">
                <Reveal
                  delay={i * 90}
                  className="flex w-full flex-col rounded-2xl border border-line bg-surface p-7"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl border border-line-strong bg-white/[0.04] text-brand">
                    <k.icon className="size-5" aria-hidden="true" />
                  </span>

                  <h2 className="mt-6 text-[1.15rem] font-semibold text-white">
                    {k.title}
                  </h2>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-fg">
                    {k.body}
                  </p>

                  <Link
                    href={k.href}
                    {...(k.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg border border-line-strong px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-brand/50 hover:bg-white/[0.06]"
                  >
                    {k.aksi}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Formulir di blok terang, mengikuti ritme beranda. */}
      <section
        id="formulir"
        className="scroll-mt-24 bg-white py-24 text-ink-strong sm:py-32"
      >
        <div className="shell">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-strong/15 bg-ink-strong/[0.04] px-4 py-1.5 text-sm font-medium text-ink-strong/70">
              {t.kontak.pilFormulir}
            </span>

            <h2 className="mx-auto mt-6 max-w-2xl text-[2.25rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[3.25rem]">
              {t.kontak.formulirJudul}
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-strong/65 sm:text-lg">
              {t.kontak.formulirIsi}
            </p>
          </Reveal>

          <Reveal delay={140} className="mx-auto mt-14 max-w-2xl">
            <ContactForm
              bahasa={bahasa}
              produk={produk}
              whatsappHref={company.whatsappHref}
            />
          </Reveal>
        </div>
      </section>

      <PetaKantor bahasa={bahasa} />
    </>
  );
}

/** Metadata halaman kontak, sama bentuknya di kedua bahasa. */
export async function metaHubungiKami(bahasa: Bahasa) {
  const [company, kantor] = await Promise.all([
    profil(bahasa),
    daftarKantor(bahasa),
  ]);
  const pusat = kantor.find((k) => k.jenis === "PUSAT") ?? kantor[0];
  const judul = (bahasa === "en" ? navEn : nav)[3].label;
  const jalur = tautan(bahasa, "/hubungi-kami");
  return {
    judul,
    deskripsi:
      bahasa === "en"
        ? `Contact ${company.legalName} at ${company.email} or ${company.phone}. Head office in ${pusat.alamatSingkat}.`
        : `Hubungi ${company.legalName} di ${company.email} atau ${company.phone}. Kantor pusat di ${pusat.alamatSingkat}.`,
    jalur,
  };
}
