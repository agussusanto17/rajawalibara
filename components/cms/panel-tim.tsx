"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2, TriangleAlert, UserRound, X } from "lucide-react";
import { hapusAnggota, simpanAnggota } from "@/lib/cms/aksi-tim";
import { DialogKonfirmasi } from "@/components/cms/dialog-konfirmasi";
import { PemilihSampul } from "@/components/cms/pemilih-sampul";
import { Pilihan } from "@/components/cms/pilihan";

export type BarisAnggota = {
  id: string;
  nama: string;
  jabatan: string;
  jabatanEn: string | null;
  bioEn: string | null;
  kelompok: "PIMPINAN" | "TIM";
  bio: string | null;
  urutan: number;
  fotoId: string | null;
  fotoUrl: string | null;
  fotoAlt: string | null;
};

type Draf = Omit<BarisAnggota, "id">;

const KOSONG: Draf = {
  nama: "",
  jabatan: "",
  jabatanEn: null,
  bioEn: null,
  kelompok: "TIM",
  bio: null,
  urutan: 0,
  fotoId: null,
  fotoUrl: null,
  fotoAlt: null,
};

const ISIAN =
  "w-full rounded-lg border border-line-strong bg-background px-3 py-2 text-sm text-white outline-none placeholder:text-muted-fg/50 focus-visible:border-brand";
const LABEL = "text-sm font-medium text-white";

export function PanelTim({ awal }: { awal: BarisAnggota[] }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sunting, setSunting] = useState<string | null>(null);
  const [terbuka, setTerbuka] = useState(false);
  const [draf, setDraf] = useState<Draf>(KOSONG);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [simpanJalan, mulai] = useTransition();
  const [tanyaHapus, setTanyaHapus] = useState<BarisAnggota | null>(null);
  const [menghapus, setMenghapus] = useState(false);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (terbuka && !d.open) d.showModal();
    if (!terbuka && d.open) d.close();
  }, [terbuka]);

  const buka = (a?: BarisAnggota) => {
    setGalat({});
    setPesan(null);
    setSunting(a?.id ?? null);
    setDraf(a ? { ...a } : { ...KOSONG, urutan: awal.length });
    setTerbuka(true);
  };

  const simpan = () =>
    mulai(async () => {
      setGalat({});
      const h = await simpanAnggota(sunting, {
        ...draf,
        bio: draf.bio?.trim() ? draf.bio : null,
        jabatanEn: draf.jabatanEn?.trim() ? draf.jabatanEn : null,
        bioEn: draf.bioEn?.trim() ? draf.bioEn : null,
      });
      if (!h.ok) {
        setPesan(h.pesan);
        setGalat(h.galat ?? {});
        return;
      }
      setTerbuka(false);
      router.refresh();
    });

  const kelompokBerlabel = (k: string) => (k === "PIMPINAN" ? "Pimpinan" : "Tim");

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Tim</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-fg">
            {awal.length} orang tersimpan. Bio hanya ditampilkan pada kartu
            pimpinan; anggota tim tampil dengan nama dan jabatan saja.
          </p>
        </div>

        <button
          type="button"
          onClick={() => buka()}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright"
        >
          <Plus className="size-4" />
          Anggota baru
        </button>
      </div>

      {pesan && !terbuka && (
        <p role="alert" className="mt-6 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {pesan}
        </p>
      )}

      {(["PIMPINAN", "TIM"] as const).map((k) => {
        const orang = awal.filter((a) => a.kelompok === k);
        if (orang.length === 0) return null;

        return (
          <section key={k} className="mt-8">
            <h2 className="text-sm font-medium text-muted-fg">
              {kelompokBerlabel(k)} · {orang.length}
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {orang.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface"
                >
                  <div className="relative aspect-[4/5] bg-white/[0.03]">
                    {a.fotoUrl ? (
                      <Image
                        src={a.fotoUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover grayscale"
                      />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-muted-fg/40">
                        <UserRound className="size-8" />
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3.5">
                    <p className="text-xs text-muted-fg">#{a.urutan}</p>
                    <p className="mt-1 text-[0.95rem] font-medium leading-snug text-white">
                      {a.nama}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-fg">
                      {a.jabatan}
                    </p>

                    <div className="mt-auto flex gap-1 pt-3">
                      <button
                        type="button"
                        onClick={() => buka(a)}
                        aria-label={`Sunting ${a.nama}`}
                        className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line-strong text-xs text-muted-fg transition-colors hover:text-white"
                      >
                        <Pencil className="size-3.5" />
                        Sunting
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPesan(null);
                          setTanyaHapus(a);
                        }}
                        aria-label={`Hapus ${a.nama}`}
                        className="grid size-8 place-items-center rounded-lg border border-line-strong text-muted-fg transition-colors hover:border-red-500/40 hover:text-red-300"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          if (!simpanJalan) setTerbuka(false);
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current && !simpanJalan) setTerbuka(false);
        }}
        className="m-auto w-[min(36rem,calc(100vw-2.5rem))] rounded-2xl border border-line-strong bg-surface p-0 text-white backdrop:bg-background/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line p-5">
            <h2 className="text-lg font-semibold">
              {sunting ? "Sunting anggota" : "Anggota baru"}
            </h2>
            <button
              type="button"
              onClick={() => setTerbuka(false)}
              aria-label="Tutup"
              className="grid size-9 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {pesan && terbuka && (
              <p role="alert" className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                {pesan}
              </p>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="t-nama" className={LABEL}>Nama</label>
                <input
                  id="t-nama"
                  value={draf.nama}
                  onChange={(e) => setDraf((d) => ({ ...d, nama: e.target.value }))}
                  className={`${ISIAN} mt-2`}
                />
                {galat.nama && <p className="mt-1 text-xs text-red-300">{galat.nama}</p>}
              </div>

              <div>
                <label htmlFor="t-jabatan" className={LABEL}>Jabatan</label>
                <input
                  id="t-jabatan"
                  value={draf.jabatan}
                  onChange={(e) => setDraf((d) => ({ ...d, jabatan: e.target.value }))}
                  className={`${ISIAN} mt-2`}
                />
                {galat.jabatan && <p className="mt-1 text-xs text-red-300">{galat.jabatan}</p>}
              </div>

              {/* Nama orang tidak diterjemahkan; jabatannya ya. Kosong berarti
                  halaman /en memakai jabatan berbahasa Indonesia. */}
              <div>
                <label htmlFor="t-jabatan-en" className={LABEL}>
                  Jabatan <span className="font-normal text-muted-fg">· English</span>
                </label>
                <input
                  id="t-jabatan-en"
                  value={draf.jabatanEn ?? ""}
                  onChange={(e) =>
                    setDraf((d) => ({ ...d, jabatanEn: e.target.value || null }))
                  }
                  className={`${ISIAN} mt-2`}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="t-kelompok" className={LABEL}>Kelompok</label>
                  <div className="mt-2">
                    <Pilihan
                      id="t-kelompok"
                      value={draf.kelompok}
                      onChange={(e) =>
                        setDraf((d) => ({ ...d, kelompok: e.target.value as "PIMPINAN" | "TIM" }))
                      }
                    >
                      <option value="TIM">Tim</option>
                      <option value="PIMPINAN">Pimpinan</option>
                    </Pilihan>
                  </div>
                </div>
                <div>
                  <label htmlFor="t-urutan" className={LABEL}>Urutan</label>
                  <input
                    id="t-urutan"
                    type="number"
                    min={0}
                    value={draf.urutan}
                    onChange={(e) => setDraf((d) => ({ ...d, urutan: Number(e.target.value) }))}
                    className={`${ISIAN} mt-2`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="t-bio" className={LABEL}>
                  Bio
                  <span className="ml-2 font-normal text-muted-fg">
                    {draf.kelompok === "PIMPINAN" ? "ditampilkan" : "tidak ditampilkan untuk kelompok Tim"}
                  </span>
                </label>
                <textarea
                  id="t-bio"
                  rows={4}
                  value={draf.bio ?? ""}
                  onChange={(e) => setDraf((d) => ({ ...d, bio: e.target.value }))}
                  className={`${ISIAN} mt-2 resize-y`}
                />
              </div>

              <PemilihSampul
                sampulId={draf.fotoId}
                sampulUrl={draf.fotoUrl}
                sampulAlt={draf.fotoAlt}
                onPilih={(m) =>
                  setDraf((d) => ({
                    ...d,
                    fotoId: m?.id ?? null,
                    fotoUrl: m?.url ?? null,
                    fotoAlt: m?.alt ?? null,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-line p-5">
            <button
              type="button"
              onClick={() => setTerbuka(false)}
              disabled={simpanJalan}
              className="h-10 rounded-lg border border-line-strong px-4 text-sm font-medium text-muted-fg transition-colors hover:text-white disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={simpan}
              disabled={simpanJalan}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright disabled:opacity-60"
            >
              {simpanJalan && <Loader2 className="size-4 animate-spin" />}
              {simpanJalan ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </dialog>

      <DialogKonfirmasi
        terbuka={tanyaHapus !== null}
        judul={`Hapus ${tanyaHapus?.nama ?? ""}?`}
        keterangan="Anggota akan hilang dari halaman Tentang Kami. Barisnya tidak dibuang dari basis data, jadi masih bisa dipulihkan."
        labelYa="Hapus"
        sedangProses={menghapus}
        onBatal={() => setTanyaHapus(null)}
        onYa={async () => {
          if (!tanyaHapus) return;
          setMenghapus(true);
          const h = await hapusAnggota(tanyaHapus.id);
          setMenghapus(false);
          setTanyaHapus(null);
          if (!h.ok) setPesan(h.pesan);
          else router.refresh();
        }}
      />
    </>
  );
}
