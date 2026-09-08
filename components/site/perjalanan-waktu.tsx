"use client";

import { useEffect, useRef, useState } from "react";
import { Glow } from "@/components/site/section";
import { teks } from "@/lib/teks";
import type { Bahasa } from "@/lib/bahasa";


const jepit = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Tonggak perjalanan perusahaan. Garisnya lurus ke bawah dan terisi warna mengikuti
 * gulir.
 *
 * Tanpa SVG: garis lurus cukup dua lapis div, satu abu setinggi penuh dan satu
 * emas yang tingginya mengikuti kemajuan. Versi berkeloknya dulu memerlukan
 * `getTotalLength` dan `stroke-dashoffset`, dan posisi titiknya harus dihitung
 * cocok dengan puncak busur, yang gampang meleset saat jumlah tonggak berubah.
 */
export type Tonggak = { tahun: string; judul: string; body: string };

/** Datanya datang sebagai props: komponen ini memakai state gulir, jadi ia
 *  harus berjalan di peramban dan tidak bisa membaca basis data sendiri. */
export function PerjalananWaktu({
  bahasa,
  perjalanan,
}: {
  bahasa: Bahasa;
  perjalanan: Tonggak[];
}) {
  const t = teks(bahasa);
  const ref = useRef<HTMLDivElement>(null);
  const [maju, setMaju] = useState(0);
  const n = perjalanan.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const kurangiGerak = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    const hitung = () => {
      if (kurangiGerak) {
        setMaju(1);
        return;
      }
      const r = el.getBoundingClientRect();
      // 0 saat bagian atas garis menyentuh tengah layar, 1 saat bagian
      // bawahnya lewat. Rentangnya tinggi elemen itu sendiri, jadi kecepatan
      // isian mengikuti panjang daftarnya.
      setMaju(jepit((window.innerHeight * 0.62 - r.top) / r.height));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(hitung);
    };

    // Lewat rAF, bukan dipanggil langsung: setState sinkron di badan effect
    // memicu render berantai.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      {/* Dua cahaya kabur di sudut atas, sebagian keluar bingkai. Section ini
          memakai overflow-hidden, jadi yang melewati tepi terpotong rapi dan
          hanya pendarnya yang masuk. */}
      <Glow className="-left-52 -top-52 size-[40rem] bg-brand/[0.14]" />
      <Glow className="-right-52 -top-52 size-[40rem] bg-brand/[0.14]" />

      <div className="shell relative">
        {/* Label dengan garis pendek yang menjulur ke bawah, menyambung ke
            garis waktu di bawahnya. */}
        <div className="flex flex-col items-center text-center">
          <span aria-hidden="true" className="size-3 rounded-sm bg-brand" />
          <p className="mt-4 text-sm font-semibold leading-snug text-white">
            {t.tentang.perjalananBaris1}
            <br />
            {t.tentang.perjalananBaris2}
          </p>
          <span aria-hidden="true" className="mt-6 h-16 w-px bg-brand/60" />
        </div>

        <h2 className="mx-auto mt-8 max-w-4xl text-center text-[2.5rem] leading-[1.05] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
          {t.tentang.perjalananJudul}
        </h2>

        <div ref={ref} className="relative mt-20 sm:mt-24">
          {/* Garis dasar, setinggi penuh. Di ponsel menempel ke kiri karena
              tonggaknya tidak lagi berselang dua sisi. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[9px] w-px bg-line sm:left-1/2 sm:-translate-x-1/2"
          />
          {/* Bagian yang sudah dilewati. Tingginya diatur, bukan digambar
              ulang, jadi tidak ada perhitungan jalur yang bisa meleset. */}
          <span
            aria-hidden="true"
            className="absolute top-0 left-[9px] w-px bg-brand sm:left-1/2 sm:-translate-x-1/2"
            style={{ height: `${maju * 100}%` }}
          />

          <ol className="relative">
            {perjalanan.map((t, i) => {
              // Tonggak dianggap tercapai saat garis melewati titik tengahnya.
              const nyala = maju >= (i + 0.55) / n;
              const kanan = i % 2 === 0;

              return (
                <li
                  key={t.tahun}
                  className="relative flex min-h-[13rem] items-center sm:min-h-[16rem]"
                >
                  <div
                    className={`w-full pl-10 sm:w-1/2 sm:pl-0 ${
                      kanan ? "sm:ml-auto sm:pl-14" : "sm:pr-14 sm:text-right"
                    }`}
                  >
                    {/* Nomor urut tidak diredupkan: pada 14px, alpha serendah
                        apa pun yang terlihat "belum dilewati" jatuh di bawah
                        ambang keterbacaan. Perubahan abu ke emas sudah cukup
                        menandai keadaannya. */}
                    <span
                      className={`block text-sm italic tabular-nums transition-colors duration-500 ${
                        nyala ? "text-brand" : "text-muted-fg"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <p
                      className={`mt-2 text-[3.5rem] font-semibold leading-none tabular-nums tracking-[-0.04em] transition-colors duration-500 sm:text-[5rem] ${
                        nyala ? "text-white" : "text-white/35"
                      }`}
                    >
                      {t.tahun}
                    </p>

                    <h3
                      className={`mt-4 text-[1.15rem] font-semibold transition-colors duration-500 ${
                        nyala ? "text-white" : "text-white/50"
                      }`}
                    >
                      {t.judul}
                    </h3>
                    <p
                      className={`mt-2.5 max-w-sm text-[0.95rem] leading-relaxed text-muted-fg ${
                        kanan ? "" : "sm:ml-auto"
                      }`}
                    >
                      {t.body}
                    </p>
                  </div>

                  {/* Titik pada garis, tepat di tengah barisnya. */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-[3px] top-1/2 size-3.5 -translate-y-1/2 rounded-full transition-colors duration-500 sm:left-1/2 sm:-translate-x-1/2 ${
                      nyala ? "bg-brand" : "bg-line-strong"
                    }`}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
