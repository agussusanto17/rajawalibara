import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/site/button-link";
import { ScrollRevealText } from "@/components/site/scroll-reveal-text";
import { isiBeranda } from "@/lib/konten";

export async function Manifesto() {
  const teks = await isiBeranda();
  const STATEMENT = teks.manifesto;
  // Slot yang fotonya belum dipilih dilewati, bukan dirender kosong: bingkai
  // abu-abu tanpa gambar terbaca sebagai gambar gagal muat.
  const PHOTOS = [teks.fotoSatu, teks.fotoDua].filter((f) => f !== null);
  return (
    /* Section terang: melanjutkan cahaya di dasar hero sebelum halaman
       berangsur gelap lagi di section berikutnya. */
    <section className="bg-white py-24 text-ink-strong sm:py-32">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-16">
          <p className="text-sm font-medium text-ink-strong/60">Tentang kami</p>

          <ScrollRevealText
            text={STATEMENT}
            className="text-[1.6rem] font-semibold leading-[1.28] tracking-[-0.035em] sm:text-[2rem] lg:text-[2.5rem]"
          />
        </div>

        <div className="mt-16 grid gap-5 sm:mt-20 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_minmax(0,15rem)] lg:items-end">
          {PHOTOS.map((photo) => (
            <div
              key={photo.url}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-strong/5"
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover grayscale"
                loading="lazy"
              />
            </div>
          ))}

          <div className="flex flex-col items-start gap-5 sm:col-span-2 lg:col-span-1 lg:pb-4">
            <p className="text-lg font-semibold leading-snug tracking-[-0.02em]">
              Tim yang menjaga
              <br />
              rantai pasoknya
            </p>
            <ButtonLink
              href="/tentang-kami"
              size="lg"
              className="rounded-lg px-5"
            >
              Kenali Tim Kami
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
