"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Icon } from "@/components/site/icon-map";

/**
 * Memilih ikon dari daftar tertutup, dengan bentuknya terlihat.
 *
 * Menggantikan dropdown berisi nama seperti "ChartNoAxesCombined" — nama itu
 * tidak memberi tahu apa pun tentang bentuknya, jadi memilih lewat daftar teks
 * berarti menebak lalu menyimpan lalu melihat hasilnya di halaman publik.
 *
 * Dialognya memakai <dialog> bawaan: jebakan fokus, tutup dengan Esc, dan
 * latar inert datang gratis.
 */
export function PemilihIkon({
  ikon,
  nilai,
  onPilih,
  label,
  ringkas = false,
}: {
  ikon: string[];
  nilai: string;
  onPilih: (n: string) => void;
  label: string;
  ringkas?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [terbuka, setTerbuka] = useState(false);
  const [cari, setCari] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (terbuka && !d.open) d.showModal();
    if (!terbuka && d.open) d.close();
  }, [terbuka]);

  // Pencarian tidak peka huruf besar-kecil, dan mengabaikan batas kata: orang
  // mengetik "grafik" atau "chart" tanpa tahu ejaan resminya di Lucide.
  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    if (!q) return ikon;
    return ikon.filter((n) => n.toLowerCase().includes(q));
  }, [ikon, cari]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCari("");
          setTerbuka(true);
        }}
        aria-label={label}
        className={[
          "flex w-full items-center gap-2.5 rounded-lg border border-line-strong bg-surface text-left transition-colors",
          "hover:border-brand/40 focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          ringkas ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2.5 text-[0.95rem]",
        ].join(" ")}
      >
        <span
          className={[
            "grid shrink-0 place-items-center rounded-md bg-white/[0.06] text-brand",
            ringkas ? "size-6" : "size-8",
          ].join(" ")}
        >
          {nilai ? (
            <Icon name={nilai} className={ringkas ? "size-3.5" : "size-4"} />
          ) : (
            <span className="text-muted-fg">?</span>
          )}
        </span>

        <span className={nilai ? "truncate text-white" : "truncate text-muted-fg"}>
          {nilai || "Pilih ikon…"}
        </span>

        <ChevronDown className="ml-auto size-4 shrink-0 text-muted-fg" />
      </button>

      <dialog
        ref={ref}
        onCancel={(e) => {
          e.preventDefault();
          setTerbuka(false);
        }}
        onClick={(e) => {
          if (e.target === ref.current) setTerbuka(false);
        }}
        className="m-auto w-[min(44rem,calc(100vw-2.5rem))] rounded-2xl border border-line-strong bg-surface p-0 text-white backdrop:bg-background/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[70vh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line p-5">
            <h2 className="text-lg font-semibold">Pilih ikon</h2>
            <button
              type="button"
              onClick={() => setTerbuka(false)}
              aria-label="Tutup"
              className="grid size-9 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="border-b border-line px-5 py-4">
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-fg"
              />
              <input
                autoFocus
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari nama ikon…"
                aria-label="Cari ikon"
                className="w-full rounded-lg border border-line-strong bg-background py-2.5 pl-10 pr-3.5 text-sm outline-none placeholder:text-muted-fg/50 focus-visible:border-brand"
              />
            </div>
            <p className="mt-2 text-xs text-muted-fg">
              {hasil.length} dari {ikon.length} ikon.
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {hasil.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-fg">
                Tidak ada ikon yang cocok dengan “{cari}”.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                {hasil.map((n) => (
                  <button
                    key={n}
                    type="button"
                    title={n}
                    aria-pressed={n === nilai}
                    onClick={() => {
                      onPilih(n);
                      setTerbuka(false);
                    }}
                    className={[
                      "flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border p-1.5 transition-colors",
                      n === nilai
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-line text-muted-fg hover:border-line-strong hover:bg-white/[0.04] hover:text-white",
                    ].join(" ")}
                  >
                    <Icon name={n} className="size-5" />
                    <span className="w-full truncate text-center text-[0.6rem] leading-tight">
                      {n}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
