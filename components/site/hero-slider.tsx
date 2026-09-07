"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export type SlideHero = {
  foto: string;
  alt: string;
  keterangan: string | null;
};

/** Jeda antar slide. Cukup lama untuk sempat dilihat, cukup pendek supaya
 *  ketiganya terlihat sebelum pengunjung menggulir turun. */
const JEDA_MS = 6000;

/**
 * Slider foto latar hero.
 *
 * Yang berganti HANYA fotonya. Judul, paragraf, dan tombol berdiri diam di
 * atasnya, dan itu keputusan sadar: judul yang berganti tiap enam detik tidak
 * sempat dibaca sampai habis, dan pengunjung yang baru mulai membaca kalimat
 * kedua kehilangan kalimat pertamanya.
 *
 * Fotonya diperlakukan sebagai suasana, bukan informasi — alt-nya kosong dan
 * keterangannya ditulis sebagai teks yang benar-benar terlihat di bawah. Foto
 * latar yang beralt panjang dibacakan berulang tiap slide berganti dan hanya
 * mengganggu.
 *
 * WCAG 2.2.2: pergantian otomatis yang berjalan lebih dari lima detik wajib
 * bisa dihentikan. Tombol jedanya nyata, bukan hanya berhenti saat disorot
 * kursor — yang memakai papan tik tidak punya kursor untuk menyorot.
 */
export function HeroSlider({ slides }: { slides: SlideHero[] }) {
  const [aktif, setAktif] = useState(0);
  const [jalan, setJalan] = useState(true);
  const [hematGerak, setHematGerak] = useState(false);
  const wadah = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setHematGerak(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Berputar sendiri hanya kalau ada lebih dari satu foto, tidak sedang
  // dijeda, dan pengunjung tidak meminta gerak seminimal mungkin.
  const berputar = slides.length > 1 && jalan && !hematGerak;

  useEffect(() => {
    if (!berputar) return;
    const t = setInterval(
      () => setAktif((i) => (i + 1) % slides.length),
      JEDA_MS,
    );
    return () => clearInterval(t);
  }, [berputar, slides.length]);

  // Berhenti saat tab tidak terlihat: interval yang terus jalan di latar
  // membuat slide melompat beberapa langkah begitu tabnya dibuka lagi.
  useEffect(() => {
    const cek = () => setJalan(!document.hidden);
    document.addEventListener("visibilitychange", cek);
    return () => document.removeEventListener("visibilitychange", cek);
  }, []);

  const ke = useCallback((i: number) => {
    setAktif(i);
    // Memilih slide sendiri berarti mengambil alih. Melanjutkan putaran
    // otomatis sesudahnya menarik foto itu pergi sebelum sempat dilihat.
    setJalan(false);
  }, []);

  if (slides.length === 0) return null;

  return (
    <>
      {/* Lapisan foto. aria-hidden: ini suasana, dan keterangannya sudah
          ditulis sebagai teks di bawah. */}
      <div ref={wadah} aria-hidden="true" className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={s.foto}
            className="absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none"
            style={{ opacity: i === aktif ? 1 : 0 }}
          >
            <Image
              src={s.foto}
              alt=""
              fill
              // Foto pertama ikut LCP: ia yang terlihat sebelum apa pun
              // sempat digulir, jadi tidak boleh menunggu antrean.
              priority={i === 0}
              sizes="100vw"
              // Titik jangkar di sepertiga atas, bukan tengah. Hero-nya jauh
              // lebih pendek daripada rasio fotonya, jadi object-cover memotong
              // tinggi habis-habisan; dijangkarkan di tengah, yang tersisa
              // hanya tanah dan bodi alat berat, dan foto terang pun terbaca
              // gelap.
              className="object-cover object-[50%_35%]"
            />
          </div>
        ))}

        {/* Penutupnya berbeda antara layar sempit dan lebar, dan itu keharusan
            bukan pilihan gaya.

            Di layar LEBAR teks berdiri di paruh kiri, jadi penutupnya mendatar:
            pekat di kiri, lepas cepat ke kanan supaya fotonya benar-benar
            terlihat. Titik hentinya ditulis sendiri — gradien merata memaksa
            memilih antara teks terbaca ATAU foto terlihat.

            Di layar SEMPIT judulnya melebar 95% layar, jadi penutup mendatar
            yang sama menaruh separuh judul di bagian yang sengaja dibiarkan
            terang. Terukur: kontras jatuh ke 1,4–2,6:1 untuk putih dan 1,0–1,2:1
            untuk emas. Karena itu di sana penutupnya vertikal dan tebal, dan
            fotonya memang tinggal jadi tekstur — di lebar 375px tidak ada
            susunan yang memberi keduanya sekaligus.

            Angkanya tidak disetel per foto: slidernya berganti, dan penutup
            yang pas untuk satu foto akan meleset di foto lain. */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(11,11,12,0.96) 0%, rgba(11,11,12,0.90) 58%, rgba(11,11,12,0.58) 86%, rgba(11,11,12,0.35) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--dark-bg) 0%, rgba(11,11,12,0.94) 42%, rgba(11,11,12,0.55) 62%, rgba(11,11,12,0.12) 84%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-background via-transparent to-background/45 lg:block" />
      </div>

      {/* Bilah kendali di tepi bawah hero. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="shell flex items-end justify-end gap-6 pb-6 sm:justify-between">
          {/* Disembunyikan di layar sempit. Di sana keterangannya membungkus
              jadi tiga baris dan menabrak baris alamat tepat di atasnya,
              sementara isinya cuma suasana — kendali slidernya yang penting. */}
          <p className="hidden max-w-xs font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.14em] text-white/55 sm:block">
            {slides[aktif]?.keterangan ?? ""}
          </p>

          {slides.length > 1 && (
            <div className="pointer-events-auto flex shrink-0 items-center gap-4">
              <span className="angka text-[0.7rem] tracking-[0.14em] text-white/60">
                {String(aktif + 1).padStart(2, "0")}
                <span className="text-white/45"> / </span>
                {String(slides.length).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.foto}
                    type="button"
                    onClick={() => ke(i)}
                    aria-label={`Tampilkan foto ${i + 1} dari ${slides.length}`}
                    aria-current={i === aktif ? "true" : undefined}
                    // Tinggi dan padding menjadikan area sentuhnya 44px,
                    // sementara yang terlihat tetap garis setipis semula.
                    // Sebelumnya 20×24px: lolos ambang WCAG 2.5.8 pada
                    // tingginya saja, dan meleset terus saat ditekan ibu jari.
                    className="group grid h-11 place-items-center px-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <span
                      className={[
                        "block h-px transition-all duration-500",
                        i === aktif
                          ? "w-9 bg-brand"
                          : "w-4 bg-white/45 group-hover:bg-white/75",
                      ].join(" ")}
                    />
                  </button>
                ))}
              </div>

              {/* Tombolnya 44px, lingkarannya tetap 28px.
                  Memperbesar lingkarannya sampai 44px membuatnya jadi elemen
                  paling menonjol di bilah bawah hero — padahal ini kendali
                  cadangan, bukan ajakan utama. Yang perlu diperbesar area
                  sentuhnya, bukan gambarnya. */}
              <button
                type="button"
                onClick={() => setJalan((v) => !v)}
                aria-label={
                  jalan ? "Hentikan pergantian foto" : "Jalankan pergantian foto"
                }
                className="group grid size-11 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="grid size-7 place-items-center rounded-full border border-white/35 text-white/70 transition-colors group-hover:border-brand/60 group-hover:text-brand">
                  {jalan && !hematGerak ? (
                    <Pause className="size-3" aria-hidden="true" />
                  ) : (
                    <Play className="size-3" aria-hidden="true" />
                  )}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Garis emas menutup hero, sekaligus batas ke pita legalitas. */}
        <span aria-hidden="true" className="block h-px w-full bg-brand/30" />
      </div>
    </>
  );
}
