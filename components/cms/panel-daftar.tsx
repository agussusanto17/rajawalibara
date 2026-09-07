"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import type { HasilAksi } from "@/lib/cms/aksi-artikel";
import { DialogKonfirmasi } from "@/components/cms/dialog-konfirmasi";
import { PemilihIkon } from "@/components/cms/pemilih-ikon";
import { PemilihSampul } from "@/components/cms/pemilih-sampul";
import { Pilihan } from "@/components/cms/pilihan";

/**
 * Penyunting satu daftar berurut.
 *
 * Enam bagian isi halaman punya bentuk yang sama: sederet butir dengan
 * beberapa isian dan sebuah urutan. Ditulis sekali di sini, bukan enam kali,
 * karena enam salinan pasti melenceng satu sama lain — dan yang melenceng
 * pertama biasanya perilaku hapus dan penanganan galatnya, justru bagian yang
 * paling jarang diuji tangan.
 *
 * Berbentuk kartu, bukan tabel: isi seperti jawaban FAQ panjangnya beberapa
 * kalimat, dan sel tabel memaksanya jadi satu baris sempit.
 */
export type Bidang =
  | { k: string; label: string; jenis: "teks"; petunjuk?: string; lebar?: "penuh" | "sempit" }
  | { k: string; label: string; jenis: "panjang"; baris?: number; petunjuk?: string }
  | { k: string; label: string; jenis: "ikon" }
  | { k: string; label: string; jenis: "daftar"; petunjuk?: string }
  | { k: string; label: string; jenis: "media" }
  | { k: string; label: string; jenis: "saklar"; petunjuk?: string }
  | { k: string; label: string; jenis: "pilihan"; opsi: readonly string[]; petunjuk?: string };

export type BarisDaftar = {
  id: string;
  urutan: number;
  [k: string]: unknown;
};

const ISIAN =
  "w-full rounded-lg border border-line-strong bg-background px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-muted-fg/50 focus-visible:border-brand";
const LABEL = "text-[0.95rem] font-medium text-white";

const teksDari = (v: unknown) => (typeof v === "string" ? v : "");

export function PanelDaftar({
  judul,
  keterangan,
  labelBaru,
  bidang,
  awal,
  ikon,
  simpan: aksiSimpan,
  hapus: aksiHapus,
  kunciJudul,
  kunciIsi,
  kosong,
}: {
  judul: string;
  keterangan: string;
  labelBaru: string;
  bidang: Bidang[];
  awal: BarisDaftar[];
  /** Daftar nama ikon yang boleh dipilih. Kosong bila tidak ada bidang ikon. */
  ikon?: string[];
  simpan: (id: string | null, draf: Record<string, unknown>) => Promise<HasilAksi>;
  hapus: (id: string) => Promise<HasilAksi>;
  /** Bidang yang dipakai sebagai judul baris di daftar. */
  kunciJudul: string;
  /** Bidang yang ditampilkan sebagai baris kedua, bila ada. */
  kunciIsi?: string;
  kosong: string;
}) {
  const router = useRouter();
  const [menyunting, setMenyunting] = useState<string | null>(null);
  const [menambah, setMenambah] = useState(false);
  const [draf, setDraf] = useState<Record<string, unknown>>({});
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [jalan, mulai] = useTransition();
  const [tanyaHapus, setTanyaHapus] = useState<BarisDaftar | null>(null);
  const [menghapus, setMenghapus] = useState(false);

  const tutup = () => {
    setMenyunting(null);
    setMenambah(false);
    setGalat({});
  };

  const kosongkan = (): Record<string, unknown> => {
    const d: Record<string, unknown> = { urutan: awal.length };
    for (const b of bidang) {
      d[b.k] =
        b.jenis === "daftar"
          ? []
          : b.jenis === "media"
            ? null
            : b.jenis === "saklar"
              ? false
              : b.jenis === "pilihan"
                ? (b.opsi[0] ?? "")
                : "";
    }
    return d;
  };

  const simpan = (id: string | null) =>
    mulai(async () => {
      setGalat({});
      setPesan(null);
      const h = await aksiSimpan(id, draf);
      if (!h.ok) {
        setPesan(h.pesan);
        setGalat(h.galat ?? {});
        return;
      }
      tutup();
      router.refresh();
    });

  const u = (k: string, v: unknown) => setDraf((d) => ({ ...d, [k]: v }));

  const Form = (
    <div className="flex flex-col gap-5 rounded-xl border border-brand/40 bg-surface/60 p-5">
      {bidang.map((b) => (
        <div key={b.k}>
          {b.jenis === "ikon" ? (
            <PemilihIkon
              ikon={ikon ?? []}
              nilai={teksDari(draf[b.k])}
              onPilih={(n) => u(b.k, n)}
              label={b.label}
            />
          ) : b.jenis === "media" ? (
            <PemilihSampul
              judul={b.label}
              sampulId={(draf[`${b.k}Id`] as string | null) ?? null}
              sampulUrl={(draf[`${b.k}Url`] as string | null) ?? null}
              sampulAlt={(draf[`${b.k}Alt`] as string | null) ?? null}
              onPilih={(m) =>
                setDraf((d) => ({
                  ...d,
                  [`${b.k}Id`]: m?.id ?? null,
                  [`${b.k}Url`]: m?.url ?? null,
                  [`${b.k}Alt`]: m?.alt ?? null,
                }))
              }
            />
          ) : b.jenis === "saklar" ? (
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={draf[b.k] === true}
                onChange={(e) => u(b.k, e.target.checked)}
                className="mt-0.5 size-4 accent-brand"
              />
              <span>
                <span className={LABEL}>{b.label}</span>
                {b.petunjuk && (
                  <span className="mt-1 block text-xs leading-relaxed text-muted-fg">
                    {b.petunjuk}
                  </span>
                )}
              </span>
            </label>
          ) : (
            <>
              <label htmlFor={`f-${b.k}`} className={LABEL}>
                {b.label}
              </label>
              {b.jenis === "pilihan" ? (
                <Pilihan
                  id={`f-${b.k}`}
                  value={teksDari(draf[b.k])}
                  onChange={(e) => u(b.k, e.target.value)}
                  className="mt-1.5"
                >
                  {/* Nilai yang sudah tersimpan tetapi tidak ada di daftar
                      pilihan ikut ditampilkan. Tanpa ini, membuka baris lama
                      lalu menyimpannya akan diam-diam mengubah nilainya
                      menjadi pilihan pertama. */}
                  {!b.opsi.includes(teksDari(draf[b.k])) && teksDari(draf[b.k]) && (
                    <option value={teksDari(draf[b.k])}>
                      {teksDari(draf[b.k])}
                    </option>
                  )}
                  {b.opsi.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Pilihan>
              ) : b.jenis === "panjang" ? (
                <textarea
                  id={`f-${b.k}`}
                  rows={b.baris ?? 3}
                  value={teksDari(draf[b.k])}
                  onChange={(e) => u(b.k, e.target.value)}
                  className={`${ISIAN} mt-1.5 resize-y`}
                />
              ) : b.jenis === "daftar" ? (
                <textarea
                  id={`f-${b.k}`}
                  rows={3}
                  value={(Array.isArray(draf[b.k]) ? (draf[b.k] as string[]) : []).join("\n")}
                  onChange={(e) =>
                    u(
                      b.k,
                      e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                    )
                  }
                  className={`${ISIAN} mt-1.5 resize-y font-mono text-xs`}
                />
              ) : (
                <input
                  id={`f-${b.k}`}
                  value={teksDari(draf[b.k])}
                  onChange={(e) => u(b.k, e.target.value)}
                  className={`${ISIAN} mt-1.5 ${b.lebar === "sempit" ? "sm:max-w-40" : ""}`}
                />
              )}
              {"petunjuk" in b && b.petunjuk && (
                <p className="mt-1 text-xs leading-relaxed text-muted-fg">{b.petunjuk}</p>
              )}
            </>
          )}
          {galat[b.k] && <p className="mt-1 text-xs text-red-300">{galat[b.k]}</p>}
        </div>
      ))}

      <div>
        <label htmlFor="f-urutan" className={LABEL}>
          Urutan
        </label>
        <input
          id="f-urutan"
          type="number"
          min={0}
          value={typeof draf.urutan === "number" ? draf.urutan : 0}
          onChange={(e) => u("urutan", Number(e.target.value))}
          className={`${ISIAN} mt-1.5 w-24`}
        />
        <p className="mt-1 text-xs text-muted-fg">
          Angka kecil tampil lebih dulu.
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={tutup}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong px-4 text-sm text-muted-fg transition-colors hover:text-white"
        >
          <X className="size-4" />
          Batal
        </button>
        <button
          type="button"
          onClick={() => simpan(menambah ? null : menyunting)}
          disabled={jalan}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright disabled:opacity-60"
        >
          {jalan ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          Simpan
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">{judul}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-fg">
            {keterangan}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMenambah(true);
            setMenyunting(null);
            setGalat({});
            setDraf(kosongkan());
          }}
          disabled={menambah}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright disabled:opacity-50"
        >
          <Plus className="size-4" />
          {labelBaru}
        </button>
      </div>

      {pesan && (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {pesan}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {menambah && Form}

        {awal.map((r) =>
          menyunting === r.id ? (
            <div key={r.id}>{Form}</div>
          ) : (
            <div
              key={r.id}
              className="flex items-start gap-4 rounded-xl border border-line bg-surface/40 p-4 transition-colors hover:border-line-strong"
            >
              <span className="mt-0.5 w-6 shrink-0 text-sm tabular-nums text-muted-fg">
                {r.urutan}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{teksDari(r[kunciJudul])}</p>
                {kunciIsi && teksDari(r[kunciIsi]) && (
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-fg">
                    {teksDari(r[kunciIsi])}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenambah(false);
                    setMenyunting(r.id);
                    setGalat({});
                    setDraf({ ...r });
                  }}
                  aria-label={`Sunting ${teksDari(r[kunciJudul])}`}
                  className="grid size-9 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPesan(null);
                    setTanyaHapus(r);
                  }}
                  aria-label={`Hapus ${teksDari(r[kunciJudul])}`}
                  className="grid size-9 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ),
        )}

        {awal.length === 0 && !menambah && (
          <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted-fg">
            {kosong}
          </p>
        )}
      </div>

      <DialogKonfirmasi
        terbuka={tanyaHapus !== null}
        judul={`Hapus “${teksDari(tanyaHapus?.[kunciJudul])}”?`}
        keterangan="Butir ini hilang dari halaman publik. Barisnya tidak dibuang dari basis data, jadi salah klik masih bisa dipulihkan."
        labelYa="Hapus"
        sedangProses={menghapus}
        onBatal={() => setTanyaHapus(null)}
        onYa={async () => {
          if (!tanyaHapus) return;
          setMenghapus(true);
          const h = await aksiHapus(tanyaHapus.id);
          setMenghapus(false);
          setTanyaHapus(null);
          if (!h.ok) setPesan(h.pesan);
          else router.refresh();
        }}
      />
    </>
  );
}
