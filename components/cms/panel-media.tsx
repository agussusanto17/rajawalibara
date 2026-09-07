"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Link2, Loader2, Trash2, TriangleAlert, Upload } from "lucide-react";
import { hapusMedia, unggahMedia } from "@/lib/cms/aksi-media";
import { kecilkanDiPeramban } from "@/lib/gambar-peramban";
import { DialogKonfirmasi } from "@/components/cms/dialog-konfirmasi";

export type BarisMedia = {
  id: string;
  url: string;
  alt: string;
  tipe: string;
  ukuran: number;
  milikKita: boolean;
  dipakai: number;
};

const ukuranRingkas = (b: number) =>
  b === 0 ? "—" : b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

export function PanelMedia({
  awal,
  penyimpananSiap,
}: {
  awal: BarisMedia[];
  penyimpananSiap: boolean;
}) {
  const router = useRouter();
  const berkasRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [namaBerkas, setNamaBerkas] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [unggahJalan, mulai] = useTransition();
  const [tanyaHapus, setTanyaHapus] = useState<BarisMedia | null>(null);
  const [menghapus, setMenghapus] = useState(false);
  const [tersalin, setTersalin] = useState<string | null>(null);

  function kirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setPesan(null);

    const berkas = berkasRef.current?.files?.[0];
    if (!berkas) {
      setPesan("Tidak ada berkas yang dipilih.");
      return;
    }

    mulai(async () => {
      setPesan(null);
      // Lihat catatan penangkap yang sama di pemilih-sampul.tsx.
      let h;
      try {
        const kecil = await kecilkanDiPeramban(berkas);
        if (kecil.size > 5 * 1024 * 1024) {
          setPesan(
            `Berkas ${(kecil.size / 1024 / 1024).toFixed(1)} MB, masih melebihi batas 5 MB setelah dikecilkan.`,
          );
          return;
        }
        const data = new FormData(form);
        data.set("berkas", kecil, kecil.name);
        h = await unggahMedia(data);
      } catch (e) {
        console.error("[cms] unggah gagal:", e);
        setPesan("Gagal mengunggah. Periksa sambungan, lalu coba lagi.");
        return;
      }
      if (!h.ok) {
        setPesan(h.pesan);
        return;
      }
      form.reset();
      setAlt("");
      setNamaBerkas(null);
      router.refresh();
    });
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-white">Media</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-fg">
        Gambar yang dipakai artikel, produk, tim, dan mitra. Berkas disimpan di
        folder unggahan server.
      </p>

      {!penyimpananSiap && (
        <p className="mt-6 flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-sm text-amber-200">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          Penyimpanan berkas belum dikonfigurasi di lingkungan ini. Unggahan
          akan gagal sampai variabel S3 diisi.
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

      <form
        onSubmit={kirim}
        className="mt-8 rounded-xl border border-line bg-surface p-5"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="flex flex-col gap-2">
            <label htmlFor="berkas" className="text-sm font-medium text-white">
              Berkas
            </label>
            <input
              ref={berkasRef}
              id="berkas"
              name="berkas"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
              required
              onChange={(e) => setNamaBerkas(e.target.files?.[0]?.name ?? null)}
              className="w-full rounded-lg border border-line-strong bg-background px-3 py-2 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-white/[0.08] file:px-3 file:py-1.5 file:text-sm file:text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="alt" className="text-sm font-medium text-white">
              Teks alternatif
            </label>
            <input
              id="alt"
              name="alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              required
              placeholder="Apa yang terlihat di gambar ini"
              className="w-full rounded-lg border border-line-strong bg-background px-3 py-2 text-sm text-white outline-none placeholder:text-muted-fg/50 focus-visible:border-brand"
            />
          </div>

          <button
            type="submit"
            disabled={unggahJalan}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright disabled:opacity-60"
          >
            {unggahJalan ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {unggahJalan ? "Mengunggah..." : "Unggah"}
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-fg">
          JPEG, PNG, WebP, AVIF, atau SVG. Maksimal 5 MB.
          {namaBerkas && ` Dipilih: ${namaBerkas}.`}
        </p>
      </form>

      {awal.length === 0 ? (
        <p className="mt-8 rounded-xl border border-line bg-surface p-6 text-sm text-muted-fg">
          Belum ada berkas.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {awal.map((m) => (
            <figure
              key={m.id}
              className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface"
            >
              <div className="relative aspect-[4/3] bg-white/[0.03]">
                <Image
                  src={m.url}
                  alt={m.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover"
                  unoptimized={m.tipe === "image/svg+xml"}
                />
              </div>

              <figcaption className="flex flex-1 flex-col gap-2 p-3.5">
                <p className="line-clamp-2 text-xs leading-relaxed text-white">
                  {m.alt}
                </p>
                <p className="text-xs text-muted-fg">
                  {ukuranRingkas(m.ukuran)}
                  {!m.milikKita && " · tautan luar"}
                  {m.dipakai > 0 && ` · dipakai ${m.dipakai}`}
                </p>

                <div className="mt-auto flex gap-1 pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(m.url);
                        setTersalin(m.id);
                        window.setTimeout(() => setTersalin(null), 1800);
                      } catch {
                        setPesan("Gagal menyalin. Salin manual dari properti gambar.");
                      }
                    }}
                    aria-label="Salin alamat gambar"
                    className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line-strong text-xs text-muted-fg transition-colors hover:text-white"
                  >
                    {tersalin === m.id ? (
                      <>
                        <Check className="size-3.5" /> Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" /> Salin URL
                      </>
                    )}
                  </button>

                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Buka gambar di tab baru"
                    className="grid size-8 place-items-center rounded-lg border border-line-strong text-muted-fg transition-colors hover:text-white"
                  >
                    <Link2 className="size-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setPesan(null);
                      setTanyaHapus(m);
                    }}
                    aria-label={`Hapus ${m.alt}`}
                    className="grid size-8 place-items-center rounded-lg border border-line-strong text-muted-fg transition-colors hover:border-red-500/40 hover:text-red-300"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <DialogKonfirmasi
        terbuka={tanyaHapus !== null}
        judul="Hapus berkas ini?"
        keterangan={
          (tanyaHapus?.dipakai ?? 0) > 0
            ? `Berkas ini masih dipakai ${tanyaHapus?.dipakai} entri, jadi tidak akan bisa dihapus. Lepaskan dari entri itu lebih dulu.`
            : tanyaHapus?.milikKita
              ? "Baris ditandai terhapus, dan objeknya dibuang dari object storage. Ini tidak bisa dibatalkan."
              : "Baris ditandai terhapus. Gambarnya milik pihak lain, jadi tidak ada yang dihapus dari mana pun."
        }
        labelYa="Hapus"
        sedangProses={menghapus}
        onBatal={() => setTanyaHapus(null)}
        onYa={async () => {
          if (!tanyaHapus) return;
          setMenghapus(true);
          const h = await hapusMedia(tanyaHapus.id);
          setMenghapus(false);
          setTanyaHapus(null);
          if (!h.ok) setPesan(h.pesan);
          else router.refresh();
        }}
      />
    </>
  );
}
