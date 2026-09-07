import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";
import { canonical } from "@/lib/seo";

import { ButtonLink } from "@/components/site/button-link";
import { ContactForm } from "@/components/site/contact-form";
import { daftarKantor, kantorPusat, produkTerbit, profil, type Profil } from "@/lib/konten";
import { Reveal } from "@/components/site/reveal";
import { PetaKantor } from "@/components/site/peta-kantor";
import { PageHero } from "@/components/site/page-hero";

export async function generateMetadata(): Promise<Metadata> {
  const [company, pusat] = await Promise.all([profil(), kantorPusat()]);
  return {
  title: "Hubungi Kami",
  description: `Hubungi ${company.legalName} di ${company.email} atau ${company.phone}. Kantor pusat di ${pusat.alamatSingkat}.`,
  // Menimpa canonical "/" yang diwarisi dari layout root.
  ...canonical("/hubungi-kami"),
  openGraph: { type: "website", url: "/hubungi-kami", title: "Hubungi Kami" },
  };
}

const daftarKanal = (company: Profil, alamatSingkat: string) => [
  {
    icon: MessageCircle,
    title: "Bicara langsung",
    body: `Cara tercepat. Kirim pesan ke ${company.phone}, atau telepon di jam kerja.`,
    aksi: "Buka WhatsApp",
    href: company.whatsappHref,
  },
  {
    icon: Mail,
    title: "Kirim email",
    body: `Cocok untuk kebutuhan yang perlu dijelaskan panjang atau disertai lampiran.`,
    aksi: company.email,
    href: `mailto:${company.email}`,
  },
  {
    icon: MapPin,
    title: "Datang ke kantor",
    body: alamatSingkat + ". Sebaiknya buat janji dulu agar tim yang tepat siap menemui Anda.",
    aksi: "Lihat di peta",
    href: "#peta",
  },
];

export const dynamic = "force-dynamic";

export default async function HubungiKamiPage() {
  const [company, kantor, produk] = await Promise.all([
    profil(),
    daftarKantor(),
    produkTerbit(),
  ]);
  const pusat = kantor.find((k) => k.jenis === "PUSAT") ?? kantor[0];
  const kanal = daftarKanal(company, pusat.alamatSingkat);
  return (
    <>
      <PageHero
        eyebrow="Dibalas 1×24 jam kerja"
        title="Mulai dari kebutuhan, bukan brosur"
        description="Sebutkan kebutuhan kalori, tonase, jadwal, dan titik serahnya. Penawaran dikirim beserta hasil uji laboratorium kargo yang dimaksud."
        breadcrumb={[{ label: "Hubungi Kami" }]}
        fakta={[
          { label: "Telepon / WhatsApp", nilai: company.phone, href: company.whatsappHref },
          { label: "Email", nilai: company.email, href: `mailto:${company.email}` },
          { label: "Kantor", nilai: `${kantor.length} lokasi`, catatan: kantor.map((k) => k.alamatSingkat).join(" · ") },
        ]}
        aksi={
          <>
            <ButtonLink href="#formulir" size="lg" className="w-full rounded-lg px-6 sm:w-auto">
              Kirim Pesan
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink
              href={company.whatsappHref}
              size="lg"
              variant="outline"
              className="w-full rounded-lg border-line-strong px-6 text-white hover:bg-white/[0.06] sm:w-auto"
            >
              <MessageCircle className="size-4" />
              Tanya lewat WhatsApp
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
              Formulir
            </span>

            <h2 className="mx-auto mt-6 max-w-2xl text-[2.25rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[3.25rem]">
              Kebutuhan pasokan apa yang bisa kami bantu?
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-strong/65 sm:text-lg">
              Semakin jelas spesifikasi, tonase, dan jadwalnya, semakin tepat
              penawaran yang bisa kami siapkan.
            </p>
          </Reveal>

          <Reveal delay={140} className="mx-auto mt-14 max-w-2xl">
            <ContactForm produk={produk} whatsappHref={company.whatsappHref} />
          </Reveal>
        </div>
      </section>

      <PetaKantor />
    </>
  );
}
