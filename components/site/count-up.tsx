"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Angka yang berputar dulu seperti undian, lalu mengunci di nilai aslinya.
 *
 * Nilai akhir sudah dirender di server, jadi tanpa JavaScript atau saat
 * pengguna memilih mengurangi gerak, angkanya langsung benar. Putarannya
 * hanya lapisan tambahan setelah komponen masuk layar.
 */
export function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    const SPIN = 700; // ms berputar acak
    const SETTLE = 900; // ms mengunci ke nilai akhir
    const digits = String(value).length;
    const ceiling = Math.pow(10, digits) - 1;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = now - start;

      if (t < SPIN) {
        // Fase undian: angka acak dengan jumlah digit yang sama.
        setDisplay(Math.floor(Math.random() * ceiling) + 1);
        raf = requestAnimationFrame(tick);
        return;
      }

      const p = Math.min(1, (t - SPIN) / SETTLE);
      // Melambat di ujung supaya berhentinya terasa mengunci, bukan terpotong.
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(eased * value));

      if (p < 1) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setDisplay(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    // tabular-nums menahan lebar tiap digit, kalau tidak angkanya bergoyang
    // kiri-kanan selama berputar.
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {display}
    </span>
  );
}
