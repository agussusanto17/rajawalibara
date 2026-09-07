"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
/**
 * Ikon nilai, diunduh ke `public/ikon` bukan ditarik dari CDN pihak ketiga:
 * aset yang dimuat dari domain lain bisa hilang kapan saja dan menambah satu
 * permintaan lintas domain di jalur render.
 *
 * Berkas 01 dan 03 berwarna gelap untuk latar berwarna, 02 putih untuk kartu
 * berfoto. Urutannya mengikuti urutan nilai.
 */
const IKON = ["/ikon/nilai-01.svg", "/ikon/nilai-02.svg", "/ikon/nilai-03.svg"];

type Nilai = { readonly title: string; readonly body: string; readonly icon: string };

/** Foto untuk kartu tengah. Lihat catatan pada blok FOTO di lib/site.ts. */
const FOTO_TENGAH = "/foto/hero-3-jalan-angkut.webp";

const jepit = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Tiga kartu nilai yang mulai bertumpuk lalu menyebar ke tempatnya masing
 * masing saat bagiannya mendekati tengah layar.
 *
 * Kartu tetap berada di dalam grid; yang berubah hanya transform-nya. Kalau
 * posisinya diatur absolut, tinggi barisnya ikut runtuh saat menumpuk dan
 * seluruh halaman di bawahnya melompat.
 *
 * Kondisi awalnya sengaja "sudah menyebar", bukan menumpuk: itu yang dirender
 * di server, jadi tanpa JavaScript kartunya tetap terbaca di posisi benar.
 */
export function KartuNilai({ items }: { items: readonly Nilai[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [maju, setMaju] = useState(1);
  const [tigaKolom, setTigaKolom] = useState(false);

  /**
   * Tumpukannya hanya masuk akal saat kisinya benar-benar tiga kolom.
   * Di bawah `lg` kartunya berderet ke bawah, dan menggesernya mendatar
   * sejauh 104% lebar kartu justru melemparnya ke luar layar sehingga
   * seluruh halaman bisa digeser ke kanan.
   */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const samakan = () => setTigaKolom(mq.matches);
    samakan();
    mq.addEventListener("change", samakan);
    return () => mq.removeEventListener("change", samakan);
  }, []);

  useEffect(() => {
    if (!tigaKolom) return;
    const el = ref.current;
    if (!el) return;

    const kurangiGerak = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (kurangiGerak) return;

    let raf = 0;
    const hitung = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 saat baru muncul dari bawah, 1 saat pusat kartu mencapai tengah layar.
      const pusat = r.top + r.height / 2;
      setMaju(jepit((vh - pusat) / (vh * 0.42)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(hitung);
    };

    hitung();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [tigaKolom]);

  // Melambat di ujung supaya berhentinya tidak mendadak.
  const t = 1 - Math.pow(1 - maju, 2.2);
  // Nol di luar tiga kolom, sehingga geser, putar, dan skala semuanya netral.
  const sisa = tigaKolom ? 1 - t : 0;

  return (
    <ul
      ref={ref}
      className="mt-14 grid gap-5 sm:mt-20 lg:grid-cols-3"
      style={{ perspective: "1400px" }}
    >
      {items.map((v, i) => {
        const tengah = i === 1;
        // Kartu tepi bergerak ke arah kartu tengah saat masih menumpuk.
        const geser = i === 0 ? sisa * 104 : i === 2 ? sisa * -104 : 0;
        const putar = i === 0 ? sisa * -5 : i === 2 ? sisa * 5 : 0;
        const skala = 1 - sisa * (tengah ? 0 : 0.06);

        return (
          <li
            key={v.title}
            className="flex"
            style={{
              transform: `translateX(${geser}%) rotate(${putar}deg) scale(${skala})`,
              // Kartu tengah di atas saat menumpuk, supaya tumpukannya terbaca.
              zIndex: tengah ? 2 : 1,
              transition: "transform 120ms linear",
              willChange: "transform",
            }}
          >
            {tengah ? (
              <article className="relative flex min-h-[26rem] w-full flex-col justify-end overflow-hidden rounded-2xl p-8">
                <Image
                  src={FOTO_TENGAH}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                />
                {/* Lapisan gelap dari bawah: teksnya putih dan harus tetap
                    terbaca berapa pun terangnya foto di baliknya. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,12,0.88)_0%,rgba(11,11,12,0.35)_55%,rgba(11,11,12,0.15)_100%)]"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IKON[i] ?? IKON[0]}
                  alt=""
                  aria-hidden="true"
                  className="relative size-14"
                />
                <h3 className="relative mt-auto pt-14 text-[1.75rem] leading-[1.15] text-white">
                  {v.title}
                </h3>
                <p className="relative mt-3 text-[0.95rem] leading-relaxed text-white/75">
                  {v.body}
                </p>
              </article>
            ) : (
              <article
                className={`flex min-h-[26rem] w-full flex-col rounded-2xl p-8 ${
                  i === 0 ? "bg-sand" : "bg-clay"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IKON[i] ?? IKON[0]}
                  alt=""
                  aria-hidden="true"
                  className="size-14"
                />
                <h3 className="mt-auto pt-14 text-[1.75rem] leading-[1.15] text-ink-strong">
                  {v.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-strong/70">
                  {v.body}
                </p>
              </article>
            )}
          </li>
        );
      })}
    </ul>
  );
}
