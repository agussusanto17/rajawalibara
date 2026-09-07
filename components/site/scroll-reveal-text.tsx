"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Paragraf yang meredup ke terang mengikuti posisi scroll.
 *
 * Tujuannya menahan mata di kalimat pembuka: pembaca menyelesaikan paragraf
 * karena teksnya menyala seiring gulir, bukan karena dipaksa berhenti.
 * Kata dinyalakan satu per satu, jadi titik potongnya bisa jatuh di tengah kata
 * seperti pada referensi.
 *
 * Saat `prefers-reduced-motion` aktif atau JavaScript belum jalan, seluruh
 * teks langsung tampil penuh.
 */
export function ScrollRevealText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Nilai awal sudah 1 (teks penuh), jadi mode ini cukup berhenti di sini.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Mulai menyala saat paragraf masuk 85% tinggi layar,
      // selesai saat bagian atasnya mencapai 25% tinggi layar.
      const start = vh * 0.85;
      const end = vh * 0.25;
      const raw = (start - r.top) / (start - end);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    const onScroll = () => {
      if (document.hidden) {
        update();
        return;
      }
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Pengukuran pertama lewat timeout, bukan rAF: browser membekukan rAF
    // saat tab tersembunyi, sehingga state awal tidak akan pernah terhitung.
    const initial = setTimeout(update, 0);
    // rAF tetap dipakai untuk meredam scroll, karena di situ tab pasti terlihat.
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Hitung ulang saat tab kembali terlihat, menutup jeda saat rAF beku.
    document.addEventListener("visibilitychange", onScroll);
    return () => {
      clearTimeout(initial);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
    };
  }, []);

  const words = text.split(" ");
  // Sedikit lebih panjang dari jumlah kata supaya kata terakhir sempat penuh.
  const lit = progress * (words.length + 6);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="transition-colors duration-300"
          style={{ color: i < lit ? "var(--ink-strong)" : "var(--ink-faded)" }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
