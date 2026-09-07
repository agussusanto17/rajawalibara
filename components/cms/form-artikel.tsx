"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Loader2,
  Plus,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { hapusArtikel, simpanArtikel } from "@/lib/cms/aksi-artikel";
import { DialogKonfirmasi } from "@/components/cms/dialog-konfirmasi";
import { PemilihSampul } from "@/components/cms/pemilih-sampul";
import { keSlug } from "@/lib/cms/skema";
import { Pilihan } from "@/components/cms/pilihan";
import type { z } from "zod";
import type { blokArtikel } from "@/lib/cms/skema";

type Blok = z.infer<typeof blokArtikel>;

export type NilaiArtikel = {
  judul: string;
  slug: string;
  ringkas: string;
  kategoriId: string;
  isi: Blok[];
  status: "DRAF" | "TERBIT";
  unggulan: boolean;
  terbitPada: string | null;
  sampulId: string | null;
  /** Hanya untuk ditampilkan. Tidak ikut divalidasi maupun disimpan. */
  sampulUrl: string | null;
  sampulAlt: string | null;
  seoJudul: string | null;
  seoDeskripsi: string | null;
};

const ISIAN =
  "w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-[0.95rem] text-white outline-none transition-colors placeholder:text-muted-fg/50 focus-visible:border-brand";
const LABEL = "text-sm font-medium text-white";

const JENIS: { nilai: Blok["jenis"]; label: string }[] = [
  { nilai: "paragraf", label: "Paragraf" },
  { nilai: "subjudul", label: "Subjudul" },
  { nilai: "sorotan", label: "Sorotan" },
  { nilai: "daftar", label: "Daftar" },
];

/** Blok kosong sesuai jenisnya. Ganti jenis tidak boleh membuang isi yang ada. */
function ubahJenis(blok: Blok, jenis: Blok["jenis"]): Blok {
  const teks = blok.jenis === "daftar" ? blok.butir.join("\n") : blok.teks;
  if (jenis === "daftar") {
    return { jenis, butir: teks.split("\n").filter(Boolean) || [""] };
  }
  return { jenis, teks };
}

/**
 * Pesan galat satu kolom.
 *
 * Didefinisikan di luar FormArtikel, bukan di dalamnya: komponen yang dibuat
 * saat render adalah tipe baru pada setiap render, sehingga React membongkar
 * dan memasang ulang seluruh isinya. Di dalam formulir itu berarti fokus
 * input bisa lepas saat pengguna sedang mengetik.
 */
function Galat({ peta, k }: { peta: Record<string, string>; k: string }) {
  if (!peta[k]) return null;
  return <p className="text-xs text-red-300">{peta[k]}</p>;
}

export type OpsiKategori = { id: string; nama: string };

export function FormArtikel({
  id,
  awal,
  kategori,
  isiRusak = false,
}: {
  id: string | null;
  awal: NilaiArtikel;
  kategori: OpsiKategori[];
  isiRusak?: boolean;
}) {
  const router = useRouter();
  const [nilai, setNilai] = useState(awal);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [sukses, setSukses] = useState(false);
  const [menyimpan, mulai] = useTransition();
  const [tanyaHapus, setTanyaHapus] = useState(false);
  const [menghapus, setMenghapus] = useState(false);

  const ubah = <K extends keyof NilaiArtikel>(k: K, v: NilaiArtikel[K]) =>
    setNilai((n) => ({ ...n, [k]: v }));

  const ubahBlok = (i: number, b: Blok) =>
    setNilai((n) => ({ ...n, isi: n.isi.map((x, j) => (j === i ? b : x)) }));

  const geser = (i: number, arah: -1 | 1) =>
    setNilai((n) => {
      const j = i + arah;
      if (j < 0 || j >= n.isi.length) return n;
      const isi = [...n.isi];
      [isi[i], isi[j]] = [isi[j], isi[i]];
      return { ...n, isi };
    });

  function simpan() {
    setGalat({});
    setPesan(null);
    setSukses(false);

    mulai(async () => {
      const hasil = await simpanArtikel(id, {
        ...nilai,
        terbitPada: nilai.terbitPada ? new Date(nilai.terbitPada) : null,
        seoJudul: nilai.seoJudul || null,
        seoDeskripsi: nilai.seoDeskripsi || null,
      });

      if (!hasil.ok) {
        setPesan(hasil.pesan);
        setGalat(hasil.galat ?? {});
        return;
      }

      setSukses(true);
      if (!id) router.replace(`/admin/artikel/${hasil.id}`);
      else router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Menempel di atas selama menggulir. Naskah artikel bisa panjang, dan
          tombol Simpan yang ikut hilang ke atas memaksa orang menggulir balik
          setiap kali ingin menyimpan. Latarnya buram supaya teks yang lewat di
          bawahnya tidak menembus. Margin negatif melebarkan latar itu sampai
          tepi kolom, sementara padding mengembalikan posisi isinya. */}
      <div className="sticky top-0 z-20 -mx-5 -mt-8 mb-2 flex flex-wrap items-center justify-between gap-4 border-b border-line bg-background/85 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:-mt-10 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {/* Tautan, bukan tombol history.back(): halaman ini bisa dibuka
              langsung dari tautan yang disalin, dan riwayat peramban belum
              tentu punya daftar artikel di belakangnya. */}
          <Link
            href="/admin/artikel"
            aria-label="Kembali ke daftar artikel"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-line-strong text-muted-fg transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <h1 className="truncate text-2xl font-semibold text-white">
            {id ? "Sunting artikel" : "Artikel baru"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {id && (
            <button
              type="button"
              onClick={() => setTanyaHapus(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong px-3.5 text-sm text-muted-fg transition-colors hover:border-red-500/40 hover:text-red-300"
            >
              <Trash2 className="size-4" />
              Hapus
            </button>
          )}

          <button
            type="button"
            onClick={simpan}
            disabled={menyimpan}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright disabled:opacity-60"
          >
            {menyimpan ? (
              <Loader2 className="size-4 animate-spin" />
            ) : sukses ? (
              <Check className="size-4" />
            ) : null}
            {menyimpan ? "Menyimpan..." : sukses ? "Tersimpan" : "Simpan"}
          </button>
        </div>
      </div>

      {isiRusak && (
        <p className="mt-6 flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-sm text-amber-200">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          Naskah yang tersimpan tidak berbentuk blok yang dikenali, jadi editor
          memulai dari naskah kosong. Menyimpan akan menimpa isi lama.
        </p>
      )}

      {pesan && (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {pesan}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="judul" className={LABEL}>Judul</label>
          <input
            id="judul"
            value={nilai.judul}
            onChange={(e) => {
              const v = e.target.value;
              // Slug ikut hanya selama belum pernah disentuh manual, supaya
              // slug artikel yang sudah terbit tidak berubah diam-diam dan
              // mematikan tautan yang sudah beredar.
              setNilai((n) => ({
                ...n,
                judul: v,
                slug: id ? n.slug : keSlug(v),
              }));
            }}
            className={ISIAN}
          />
          <Galat peta={galat} k="judul" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="slug" className={LABEL}>Slug</label>
          <input
            id="slug"
            value={nilai.slug}
            onChange={(e) => ubah("slug", e.target.value)}
            className={`${ISIAN} font-mono text-sm`}
          />
          <p className="text-xs text-muted-fg">/artikel/{nilai.slug || "…"}</p>
          <Galat peta={galat} k="slug" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="kategori" className={LABEL}>Kategori</label>
            <Pilihan
              id="kategori"
              value={nilai.kategoriId}
              onChange={(e) => ubah("kategoriId", e.target.value)}
            >
              <option value="">Pilih kategori…</option>
              {kategori.map((k) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </Pilihan>
            {kategori.length === 0 && (
              <p className="text-xs text-amber-300">
                Belum ada kategori. Tambahkan lebih dulu di menu Kategori.
              </p>
            )}
            <Galat peta={galat} k="kategoriId" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="terbit" className={LABEL}>Tanggal terbit</label>
            <input
              id="terbit"
              type="date"
              value={nilai.terbitPada ?? ""}
              onChange={(e) => ubah("terbitPada", e.target.value || null)}
              className={ISIAN}
            />
            <p className="text-xs text-muted-fg">
              Kosong dan berstatus terbit akan diisi tanggal hari ini.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="ringkas" className={LABEL}>
            Ringkasan
            <span className="ml-2 font-normal text-muted-fg">
              {nilai.ringkas.length}/200
            </span>
          </label>
          <textarea
            id="ringkas"
            rows={3}
            value={nilai.ringkas}
            onChange={(e) => ubah("ringkas", e.target.value)}
            className={`${ISIAN} resize-y`}
          />
          <p className="text-xs text-muted-fg">
            Dipakai di kartu artikel dan sebagai meta description.
          </p>
          <Galat peta={galat} k="ringkas" />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className={LABEL}>Status</legend>
          <div className="mt-1 flex gap-2">
            {(["DRAF", "TERBIT"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ubah("status", s)}
                aria-pressed={nilai.status === s}
                className={[
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  nilai.status === s
                    ? "bg-brand text-background"
                    : "border border-line-strong text-muted-fg hover:text-white",
                ].join(" ")}
              >
                {s === "DRAF" ? "Draf" : "Terbit"}
              </button>
            ))}
          </div>
        </fieldset>

        <PemilihSampul
          sampulId={nilai.sampulId}
          sampulUrl={nilai.sampulUrl}
          sampulAlt={nilai.sampulAlt}
          onPilih={(m) =>
            setNilai((n) => ({
              ...n,
              sampulId: m?.id ?? null,
              sampulUrl: m?.url ?? null,
              sampulAlt: m?.alt ?? null,
            }))
          }
        />

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface p-4">
          <input
            type="checkbox"
            checked={nilai.unggulan}
            onChange={(e) => ubah("unggulan", e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[var(--brand-gold)]"
          />
          <span>
            <span className="block text-[0.95rem] font-medium text-white">
              Jadikan unggulan
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted-fg">
              Ditonjolkan di halaman publik. Ini bukan pengganti status: artikel
              unggulan yang masih draf tetap tidak tampil di mana pun.
            </span>
          </span>
        </label>

        {/* ------------------------------------------------------- Naskah */}
        <div className="flex flex-col gap-3">
          <h2 className={LABEL}>Naskah</h2>
          <Galat peta={galat} k="isi" />

          {nilai.isi.map((b, i) => (
            <div
              key={i}
              className="rounded-xl border border-line bg-surface p-4"
            >
              <div className="flex flex-wrap items-center gap-2 [&>div:first-child]:w-32">
                <Pilihan
                  ringkas
                  value={b.jenis}
                  onChange={(e) =>
                    ubahBlok(i, ubahJenis(b, e.target.value as Blok["jenis"]))
                  }
                  aria-label={`Jenis blok ${i + 1}`}
                  className="w-32"
                >
                  {JENIS.map((j) => (
                    <option key={j.nilai} value={j.nilai}>{j.label}</option>
                  ))}
                </Pilihan>

                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => geser(i, -1)}
                    disabled={i === 0}
                    aria-label={`Naikkan blok ${i + 1}`}
                    className="grid size-8 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => geser(i, 1)}
                    disabled={i === nilai.isi.length - 1}
                    aria-label={`Turunkan blok ${i + 1}`}
                    className="grid size-8 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNilai((n) => ({
                        ...n,
                        isi: n.isi.filter((_, j) => j !== i),
                      }))
                    }
                    disabled={nilai.isi.length === 1}
                    aria-label={`Hapus blok ${i + 1}`}
                    className="grid size-8 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-30"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {b.jenis === "daftar" ? (
                <>
                  <textarea
                    rows={4}
                    value={b.butir.join("\n")}
                    onChange={(e) =>
                      ubahBlok(i, {
                        jenis: "daftar",
                        butir: e.target.value.split("\n"),
                      })
                    }
                    aria-label={`Butir daftar blok ${i + 1}`}
                    className={`${ISIAN} mt-3 resize-y`}
                  />
                  <p className="mt-1.5 text-xs text-muted-fg">
                    Satu butir per baris. Baris kosong diabaikan saat disimpan.
                  </p>
                </>
              ) : (
                <textarea
                  rows={b.jenis === "subjudul" ? 1 : 4}
                  value={b.teks}
                  onChange={(e) =>
                    ubahBlok(i, { jenis: b.jenis, teks: e.target.value })
                  }
                  aria-label={`Isi blok ${i + 1}`}
                  className={`${ISIAN} mt-3 resize-y`}
                />
              )}
              <Galat peta={galat} k={`isi.${i}.teks`} />
              <Galat peta={galat} k={`isi.${i}.butir`} />
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            {JENIS.map((j) => (
              <button
                key={j.nilai}
                type="button"
                onClick={() =>
                  setNilai((n) => ({
                    ...n,
                    isi: [
                      ...n.isi,
                      j.nilai === "daftar"
                        ? { jenis: "daftar", butir: [""] }
                        : { jenis: j.nilai, teks: "" },
                    ],
                  }))
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-2 text-xs text-muted-fg transition-colors hover:border-brand/40 hover:text-white"
              >
                <Plus className="size-3.5" />
                {j.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {id && (
        <DialogKonfirmasi
          terbuka={tanyaHapus}
          judul="Hapus artikel ini?"
          keterangan="Artikel akan hilang dari daftar dan dari situs publik. Isinya tidak dibuang dari basis data, jadi masih bisa dipulihkan."
          labelYa="Hapus"
          sedangProses={menghapus}
          onBatal={() => setTanyaHapus(false)}
          onYa={async () => {
            setMenghapus(true);
            const h = await hapusArtikel(id);
            if (h.ok) {
              router.push("/admin/artikel");
              return;
            }
            setMenghapus(false);
            setTanyaHapus(false);
            setPesan(h.pesan);
          }}
        />
      )}
    </div>
  );
}
