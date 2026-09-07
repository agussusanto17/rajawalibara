"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Plus, Trash2, TriangleAlert, X } from "lucide-react";
import { hapusKategori, simpanKategori } from "@/lib/cms/aksi-kategori";
import { keSlug } from "@/lib/cms/skema";
import { DialogKonfirmasi } from "@/components/cms/dialog-konfirmasi";

export type BarisKategori = {
  id: string;
  nama: string;
  slug: string;
  urutan: number;
  jumlahArtikel: number;
};

const ISIAN =
  "w-full rounded-lg border border-line-strong bg-background px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-muted-fg/50 focus-visible:border-brand";

type Draf = { nama: string; slug: string; urutan: number };

export function PanelKategori({ awal }: { awal: BarisKategori[] }) {
  const router = useRouter();
  const [menyunting, setMenyunting] = useState<string | null>(null);
  const [menambah, setMenambah] = useState(false);
  const [draf, setDraf] = useState<Draf>({ nama: "", slug: "", urutan: 0 });
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [simpanJalan, mulai] = useTransition();
  const [tanyaHapus, setTanyaHapus] = useState<BarisKategori | null>(null);
  const [menghapus, setMenghapus] = useState(false);

  const tutup = () => {
    setMenyunting(null);
    setMenambah(false);
    setGalat({});
  };

  const simpan = (id: string | null) =>
    mulai(async () => {
      setGalat({});
      setPesan(null);
      const h = await simpanKategori(id, draf);
      if (!h.ok) {
        setPesan(h.pesan);
        setGalat(h.galat ?? {});
        return;
      }
      tutup();
      router.refresh();
    });

  const Isian = (
    <>
      <td className="px-4 py-3">
        <input
          autoFocus
          value={draf.nama}
          onChange={(e) => {
            const v = e.target.value;
            // Slug ikut hanya saat membuat baru. Mengubah slug kategori lama
            // akan mengubah alamat saringan yang mungkin sudah dibagikan.
            setDraf((d) => ({
              ...d,
              nama: v,
              slug: menambah ? keSlug(v) : d.slug,
            }));
          }}
          placeholder="Nama kategori"
          aria-label="Nama kategori"
          className={ISIAN}
        />
        {galat.nama && <p className="mt-1 text-xs text-red-300">{galat.nama}</p>}
      </td>
      <td className="px-4 py-3">
        <input
          value={draf.slug}
          onChange={(e) => setDraf((d) => ({ ...d, slug: e.target.value }))}
          aria-label="Slug kategori"
          className={`${ISIAN} font-mono text-xs`}
        />
        {galat.slug && <p className="mt-1 text-xs text-red-300">{galat.slug}</p>}
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          value={draf.urutan}
          onChange={(e) =>
            setDraf((d) => ({ ...d, urutan: Number(e.target.value) }))
          }
          aria-label="Urutan"
          className={`${ISIAN} w-20`}
        />
      </td>
      <td className="px-4 py-3 text-sm text-muted-fg">—</td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => simpan(menambah ? null : menyunting)}
            disabled={simpanJalan}
            aria-label="Simpan kategori"
            className="grid size-9 place-items-center rounded-lg bg-brand text-background transition-colors hover:bg-brand-bright disabled:opacity-60"
          >
            {simpanJalan ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
          </button>
          <button
            type="button"
            onClick={tutup}
            aria-label="Batal"
            className="grid size-9 place-items-center rounded-lg border border-line-strong text-muted-fg transition-colors hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Kategori</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-fg">
            Data induk kategori artikel. Nama di sini yang muncul sebagai pilihan
            saat menulis artikel dan sebagai saringan di halaman publik.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMenambah(true);
            setMenyunting(null);
            setDraf({ nama: "", slug: "", urutan: awal.length });
          }}
          disabled={menambah}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright disabled:opacity-50"
        >
          <Plus className="size-4" />
          Kategori baru
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

      <div className="mt-8 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-surface text-left">
              <th className="px-4 py-3 font-medium text-muted-fg">Nama</th>
              <th className="px-4 py-3 font-medium text-muted-fg">Slug</th>
              <th className="px-4 py-3 font-medium text-muted-fg">Urutan</th>
              <th className="px-4 py-3 font-medium text-muted-fg">Artikel</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {menambah && <tr className="border-b border-line bg-surface/50">{Isian}</tr>}

            {awal.map((k) =>
              menyunting === k.id ? (
                <tr key={k.id} className="border-b border-line bg-surface/50 last:border-b-0">
                  {Isian}
                </tr>
              ) : (
                <tr
                  key={k.id}
                  className="border-b border-line transition-colors last:border-b-0 hover:bg-surface"
                >
                  <td className="px-4 py-3 font-medium text-white">{k.nama}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-fg">
                    {k.slug}
                  </td>
                  <td className="px-4 py-3 text-muted-fg">{k.urutan}</td>
                  <td className="px-4 py-3 text-muted-fg tabular-nums">
                    {k.jumlahArtikel}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMenambah(false);
                          setMenyunting(k.id);
                          setGalat({});
                          setDraf({ nama: k.nama, slug: k.slug, urutan: k.urutan });
                        }}
                        aria-label={`Sunting ${k.nama}`}
                        className="grid size-9 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-white/[0.06] hover:text-white"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPesan(null);
                          setTanyaHapus(k);
                        }}
                        aria-label={`Hapus ${k.nama}`}
                        className="grid size-9 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}

            {awal.length === 0 && !menambah && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-fg">
                  Belum ada kategori. Artikel tidak bisa disimpan tanpa kategori.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DialogKonfirmasi
        terbuka={tanyaHapus !== null}
        judul={`Hapus kategori “${tanyaHapus?.nama ?? ""}”?`}
        keterangan={
          (tanyaHapus?.jumlahArtikel ?? 0) > 0
            ? `Kategori ini masih dipakai ${tanyaHapus?.jumlahArtikel} artikel, jadi tidak akan bisa dihapus. Pindahkan artikel itu ke kategori lain lebih dulu.`
            : "Kategori akan hilang dari daftar pilihan. Barisnya tidak dibuang dari basis data."
        }
        labelYa="Hapus"
        sedangProses={menghapus}
        onBatal={() => setTanyaHapus(null)}
        onYa={async () => {
          if (!tanyaHapus) return;
          setMenghapus(true);
          const h = await hapusKategori(tanyaHapus.id);
          setMenghapus(false);
          setTanyaHapus(null);
          if (!h.ok) setPesan(h.pesan);
          else router.refresh();
        }}
      />
    </>
  );
}
