"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Memunculkan isinya saat pertama kali masuk layar, sekali saja.
 *
 * Dipakai untuk kepala section, judul, dan baris kartu, supaya halaman
 * terbaca sebagai urutan, bukan sekaligus jadi.
 *
 * Kalau JavaScript tidak jalan, aturan <noscript> di globals.css memaksa
 * seluruh elemen ini tetap tampil. Kalau pengguna memilih mengurangi gerak,
 * elemen langsung tampil penuh tanpa animasi.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      // Menunggu elemen masuk sedikit ke dalam layar, bukan tepat di tepinya,
      // supaya gerakannya tidak terjadi di luar pandangan.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", shown && "reveal-in", className)}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
