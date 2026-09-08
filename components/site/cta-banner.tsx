import { ArrowRight, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/site/button-link";
import { Glow } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { profil } from "@/lib/konten";
import { tautan, type Bahasa } from "@/lib/bahasa";
import { teks } from "@/lib/teks";

/**
 * Pita ajakan yang melebar penuh, dipakai bersama beranda dan halaman produk.
 *
 * Latarnya milik section supaya membentang dari tepi ke tepi, sementara `.shell`
 * tetap membungkus isinya: teks tidak melar sampai lebar layar, dan padding tepi
 * di ponsel tetap ada. Padding vertikalnya cukup satu, milik section ini.
 *
 * Tombol keduanya WhatsApp, bukan tautan ke halaman lain. Di titik penutup,
 * mengirim pembaca ke halaman lain berarti kehilangan dia; WhatsApp menawarkan
 * jalan dengan komitmen lebih rendah bagi yang enggan mengisi formulir.
 */
export async function CtaBanner({
  bahasa,
  tag,
  eyebrow,
  heading,
  body,
  aksiLabel,
  aksiHref = "/hubungi-kami",
}: {
  bahasa: Bahasa;
  tag: string;
  eyebrow: string;
  heading: string;
  body: string;
  aksiLabel?: string;
  aksiHref?: string;
}) {
  const t = teks(bahasa);
  const label = aksiLabel ?? t.umum.hubungiKami;
  const company = await profil(bahasa);
  return (
    <section className="relative overflow-hidden border-t border-line bg-surface py-20 text-center sm:py-28">
      <Glow className="-top-32 left-1/2 size-[30rem] -translate-x-1/2" />

      <div className="shell relative">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <span className="pill">
            <span className="pill-tag">{tag}</span>
            {eyebrow}
          </span>

          <h2 className="text-[2.25rem] leading-[1.1] text-white sm:text-5xl">
            {heading}
          </h2>

          <p className="lede">{body}</p>

          <div className="mt-3 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <ButtonLink
              href={tautan(bahasa, aksiHref)}
              size="lg"
              className="w-full rounded-lg px-6 sm:w-auto"
            >
              {label}
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
