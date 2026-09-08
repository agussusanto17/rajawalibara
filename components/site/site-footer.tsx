import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { footerLinks } from "@/lib/site";
import { footerLinks as footerLinksEn } from "@/lib/site.en";
import { tautan, type Bahasa } from "@/lib/bahasa";
import { teks } from "@/lib/teks";
import { profil, type Profil } from "@/lib/konten";
import { kantorPusat } from "@/lib/konten";
import { Logo } from "@/components/site/logo";

/**
 * Kolom tautan footer.
 *
 * Tidak ada kolom media sosial: belum ada akun yang bisa ditautkan, dan
 * menaruh ikon yang mengarah ke mana-mana adalah tautan mati.
 *
 * Alamat yang tampil adalah kantor pusat saja. Footer muncul di setiap halaman
 * dan ruangnya sempit; daftar lengkap kantornya ada di halaman kontak.
 */
const kontak = (company: Profil, alamatSingkat: string) => [
  { icon: MapPin, label: alamatSingkat, href: null },
  { icon: Phone, label: company.phone, href: company.phoneHref },
  { icon: MessageCircle, label: "WhatsApp", href: company.whatsappHref },
  { icon: Mail, label: company.email, href: `mailto:${company.email}` },
];

export async function SiteFooter({ bahasa }: { bahasa: Bahasa }) {
  const t = teks(bahasa);
  const tautanKaki = bahasa === "en" ? footerLinksEn : footerLinks;
  const [company, pusat] = await Promise.all([
    profil(bahasa),
    kantorPusat(bahasa),
  ]);
  const CONTACT = kontak(company, pusat.alamatSingkat);
  return (
    <footer className="relative overflow-hidden bg-background">
      <div className="shell relative">
        <div className="grid gap-14 py-20 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
          {/* Blok kiri: ajakan menghubungi, bukan formulir berlangganan.
              Belum ada sistem newsletter, dan tombol daftar yang tidak
              mengirim ke mana pun adalah kontrol mati. */}
          <div className="max-w-md">
            <Logo />
            <h2 className="mt-8 text-3xl leading-[1.15] text-white sm:text-[2.5rem]">
              {t.footer.judulSebutkanBaris1}
              <br />
              {t.footer.judulSebutkanBaris2}
            </h2>
            <Link
              href={tautan(bahasa, "/hubungi-kami")}
              className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-base font-bold text-background transition-colors hover:bg-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {t.umum.hubungiKami}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <p className="mt-5 text-base text-muted-fg">
              {t.footer.dibalas}
            </p>
          </div>

          <FooterColumn
            title={t.footer.judulLayanan}
            links={tautanKaki.layanan.map((l) => ({
              ...l,
              href: tautan(bahasa, l.href),
            }))}
          />
          <FooterColumn
            title={t.footer.judulPerusahaan}
            links={tautanKaki.perusahaan.map((l) => ({
              ...l,
              href: tautan(bahasa, l.href),
            }))}
          />

          <div>
            <h3 className="text-lg font-semibold text-white">{t.footer.judulKontak}</h3>
            <ul className="mt-5 space-y-1 text-base text-muted-fg">
              {CONTACT.map((c) => (
                <li key={c.label}>
                  {c.href ? (
                    <a
                      href={c.href}
                      {...(c.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="inline-flex items-center gap-2.5 py-2.5 transition-colors hover:text-white"
                    >
                      <c.icon className="size-[18px] shrink-0 text-brand" />
                      {c.label}
                    </a>
                  ) : (
                    <span className="inline-flex items-start gap-2.5 py-1.5">
                      <c.icon className="mt-0.5 size-[18px] shrink-0 text-brand" />
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-8 text-sm text-muted-fg sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. {t.footer.hakCipta}
          </p>
          {/* Tautan jangkar, bukan tombol ber-JavaScript: `#konten` sudah ada
              di <main>, dan `scroll-behavior: smooth` global yang mengurus
              gerakannya. Tetap berfungsi walau skrip gagal dimuat. */}
          <a
            href="#konten"
            className="group -my-1.5 inline-flex items-center gap-2 self-start py-1.5 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:self-auto"
          >
            {t.footer.kembaliKeAtas}
            <span className="inline-flex size-8 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-background">
              <ArrowUp className="size-4" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <ul className="mt-5 text-base text-muted-fg">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              // py-2.5 membuat tinggi sentuhnya 44px. Sebelumnya 36px —
              // lolos ambang WCAG 2.5.8 (24px) tetapi masih meleset saat
              // ditekan ibu jari di daftar tautan yang berdempetan.
              className="inline-block py-2.5 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
