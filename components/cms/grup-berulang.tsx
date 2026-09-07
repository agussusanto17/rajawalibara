"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

/**
 * Daftar isian yang bisa ditambah, dihapus, dan diurutkan.
 *
 * Formulir produk punya lima kelompok seperti ini. Menyalin logika naik-turun
 * dan hapusnya lima kali berarti lima tempat yang harus diperbaiki setiap ada
 * satu kesalahan, dan biasanya ada satu yang terlewat.
 */
export function GrupBerulang<T>({
  label,
  keterangan,
  butir,
  kosong,
  onUbah,
  minimal = 0,
  render,
}: {
  label: string;
  keterangan?: string;
  butir: T[];
  kosong: () => T;
  onUbah: (b: T[]) => void;
  minimal?: number;
  render: (item: T, set: (v: T) => void, i: number) => React.ReactNode;
}) {
  const ganti = (i: number, v: T) =>
    onUbah(butir.map((x, j) => (j === i ? v : x)));

  const geser = (i: number, arah: -1 | 1) => {
    const j = i + arah;
    if (j < 0 || j >= butir.length) return;
    const b = [...butir];
    [b[i], b[j]] = [b[j], b[i]];
    onUbah(b);
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-[0.95rem] font-medium text-white">{label}</h3>
        {keterangan && (
          <p className="mt-1 text-xs leading-relaxed text-muted-fg">
            {keterangan}
          </p>
        )}
      </div>

      {butir.length === 0 && (
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-6 text-center text-sm text-muted-fg">
          Belum ada isi.
        </p>
      )}

      {butir.map((item, i) => (
        <div key={i} className="rounded-xl border border-line bg-surface p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-fg">
              {label} {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => geser(i, -1)}
                disabled={i === 0}
                aria-label={`Naikkan ${label} ${i + 1}`}
                className="grid size-8 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => geser(i, 1)}
                disabled={i === butir.length - 1}
                aria-label={`Turunkan ${label} ${i + 1}`}
                className="grid size-8 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
              >
                <ArrowDown className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onUbah(butir.filter((_, j) => j !== i))}
                disabled={butir.length <= minimal}
                aria-label={`Hapus ${label} ${i + 1}`}
                className="grid size-8 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-30"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>

          {render(item, (v) => ganti(i, v), i)}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onUbah([...butir, kosong()])}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-line-strong px-3 py-2 text-xs text-muted-fg transition-colors hover:border-brand/40 hover:text-white"
      >
        <Plus className="size-3.5" />
        Tambah {label.toLowerCase()}
      </button>
    </div>
  );
}
