"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/site/button-link";
import { Logo } from "@/components/site/logo";

/**
 * Header melayang dengan empat item.
 *
 * Tidak ada menu turun. Empat tujuan muat berjajar tanpa perlu disembunyikan
 * di balik satu klik lagi, dan panel yang muncul saat kursor lewat menambah
 * gerakan yang tidak diminta siapa pun. Halaman Layanan sendiri yang memuat
 * daftar lengkapnya.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  /**
   * Header menyingkir selama halaman digulir, ke arah mana pun, lalu kembali
   * dua detik setelah gulir berhenti. Tujuannya memberi layar penuh saat
   * membaca tanpa menghilangkan navigasi permanen.
   *
   * Dikecualikan saat menu mobile terbuka atau ada elemen di dalam header
   * yang sedang fokus, supaya pengguna papan tik tidak kehilangan targetnya.
   */
  useEffect(() => {
    if (open) return;

    let idle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const header = document.getElementById("site-header");
      if (header?.contains(document.activeElement)) return;
      setHidden(window.scrollY > 64);
      clearTimeout(idle);
      idle = setTimeout(() => setHidden(false), 2000);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  // Kunci scroll body saat menu mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      id="site-header"
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 pt-4 transition-transform duration-500 sm:pt-5",
        hidden ? "-translate-y-[130%]" : "translate-y-0",
      )}
    >
      <div className="shell">
        <div className="relative lg:mx-auto lg:max-w-[880px]">
          {/* Navbar pill melayang. Berlatar di semua lebar layar: header ini
              melintas di atas section terang saat digulir, dan tanpa latarnya
              sendiri logo serta tombol menu lenyap begitu melewati blok
              putih. */}
          <div
            className={cn(
              "drop pointer-events-auto flex items-center justify-between gap-4",
              "rounded-full border border-line-strong bg-surface/80 py-1.5 pl-4 pr-1.5 backdrop-blur-xl",
              "lg:py-2.5 lg:pl-5 lg:pr-2.5",
            )}
          >
            <Link
              href="/"
              aria-label="Rajawali Bara, beranda"
              className="-my-2 shrink-0 py-2"
            >
              <Logo compact alt="" />
            </Link>

            <nav
              aria-label="Navigasi utama"
              className="hidden items-center gap-1 lg:flex"
            >
              {/* Butir terakhir dilewati: "Hubungi Kami" sudah berdiri sebagai
                  tombol di sebelah kanan, dan menampilkannya dua kali membuat
                  dua target berbeda untuk tujuan yang sama. */}
              {nav.slice(0, -1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-white/[0.07] text-white"
                      : "text-muted-fg hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ButtonLink
                href="/hubungi-kami"
                className="hidden rounded-lg bg-white px-5 font-semibold text-background hover:bg-white/85 lg:inline-flex"
              >
                Hubungi Kami
              </ButtonLink>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="menu-mobile"
                aria-label={open ? "Tutup menu" : "Buka menu"}
                className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-white lg:size-10 lg:hidden"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {open && (
          <div
            id="menu-mobile"
            className="pointer-events-auto mt-2 rounded-2xl border border-line-strong bg-surface/95 p-2 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Navigasi mobile" className="flex flex-col">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-white/[0.07] text-white"
                      : "text-muted-fg hover:bg-white/[0.04] hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
