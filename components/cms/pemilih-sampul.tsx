"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { ImageOff, Loader2, Search, Trash2, Upload, X } from "lucide-react";
import {
  daftarMedia,
  unggahMedia,
  type PilihanMedia,
} from "@/lib/cms/aksi-media";
import { kecilkanDiPeramban } from "@/lib/gambar-peramban";

/**
 * Memilih sampul dari pustaka media, atau mengunggah yang baru di tempat.
 *
 * Dialognya memakai <dialog> bawaan dengan alasan yang sama seperti dialog
 * konfirmasi: jebakan fokus, tutup dengan Esc, dan latar inert datang gratis.
 */
export function PemilihSampul({
  sampulId,
  sampulUrl,
  sampulAlt,
  onPilih,
  judul = "Sampul",
}: {
  sampulId: string | null;
  sampulUrl: string | null;
  sampulAlt: string | null;
  onPilih: (m: { id: string; url: string; alt: string } | null) => void;
  /** Membedakan beberapa pemilih pada satu halaman. Tanpa ini keduanya
   *  bernama "Sampul" dan tidak ada cara mengetahui mana yang mana. */
  judul?: string;
}) {
  // Isi dialog selalu ada di DOM, bahkan saat tertutup. Id tetap akan
  // terduplikasi begitu komponen ini dipakai dua kali di satu halaman, dan
  // label yang menunjuk id ganda mengarah ke input milik instans pertama.
  const uid = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [terbuka, setTerbuka] = useState(false);
  const [daftar, setDaftar] = useState<PilihanMedia[] | null>(null);
  const [cari, setCari] = useState("");
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, mulai] = useTransition();

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (terbuka && !d.open) d.showModal();
    if (!terbuka && d.open) d.close();
  }, [terbuka]);

  const muat = (q = "") =>
    mulai(async () => {
      setPesan(null);
      setDaftar(await daftarMedia(q));
    });

  function buka() {
    setTerbuka(true);
    setCari("");
    muat();
  }

/**
 * Menyiapkan FormData yang benar-benar dikirim.
 *
 * Berkasnya diganti versi yang sudah dikecilkan, bukan yang dipilih pengguna.
 * Batas 5 MB diperiksa SETELAH pengecilan, sama seperti yang diperiksa server:
 * foto 12 MB dari kamera menjadi beberapa ratus kilobita dan seharusnya
 * berhasil, sementara memeriksa berkas asli akan menolaknya tanpa alasan yang
 * bisa dipahami pengguna.
 */
const MAKS_BYTE = 5 * 1024 * 1024;

async function siapkanKiriman(form: HTMLFormElement, berkas: File) {
  const kecil = await kecilkanDiPeramban(berkas);
  if (kecil.size > MAKS_BYTE) {
    return {
      galat: `Berkas ${(kecil.size / 1024 / 1024).toFixed(1)} MB, masih melebihi batas 5 MB setelah dikecilkan.`,
    };
  }
  const data = new FormData(form);
  data.set("berkas", kecil, kecil.name);
  return { data };
}

  function unggahDiTempat(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const inputBerkas = form.elements.namedItem("berkas") as HTMLInputElement | null;
    const berkas = inputBerkas?.files?.[0];
    if (!berkas) {
      setPesan("Tidak ada berkas yang dipilih.");
      return;
    }

    mulai(async () => {
      setPesan(null);
      // Ditangkap di sini, bukan dibiarkan menolak. Aksi server yang gagal di
      // tingkat HTTP — badan terlalu besar, proxy menolak, jaringan terputus —
      // melempar, dan tanpa penangkap ini React menggantikan seluruh halaman
      // dengan layar galatnya. Orang yang mengunggah kehilangan formulirnya
      // tanpa pernah diberi tahu apa yang terjadi.
      let h;
      try {
        const siap = await siapkanKiriman(form, berkas);
        if (siap.galat) {
          setPesan(siap.galat);
          return;
        }
        h = await unggahMedia(siap.data!);
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
      // Berkas baru langsung dipilih: itu yang diinginkan orang yang baru saja
      // mengunggahnya, dan menyuruhnya mencari lagi di kisi hanya menambah langkah.
      onPilih({ id: h.id, url: h.url, alt: "" });
      setTerbuka(false);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.95rem] font-medium text-white">{judul}</span>

      {sampulId && sampulUrl ? (
        <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-white/[0.03]">
            <Image
              src={sampulUrl}
              alt={sampulAlt ?? ""}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="truncate text-sm text-muted-fg">
              {sampulAlt || "Tanpa teks alternatif"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={buka}
                className="h-9 rounded-lg border border-line-strong px-3 text-sm text-muted-fg transition-colors hover:text-white"
              >
                Ganti
              </button>
              <button
                type="button"
                onClick={() => onPilih(null)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line-strong px-3 text-sm text-muted-fg transition-colors hover:border-red-500/40 hover:text-red-300"
              >
                <Trash2 className="size-3.5" />
                Lepas
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={buka}
          className="flex items-center gap-3 rounded-xl border border-dashed border-line-strong bg-surface p-4 text-left transition-colors hover:border-brand/40"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-muted-fg">
            <ImageOff className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-medium text-white">
              Pilih sampul
            </span>
            <span className="mt-0.5 block text-xs text-muted-fg">
              Dari pustaka media, atau unggah baru.
            </span>
          </span>
        </button>
      )}

      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          setTerbuka(false);
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) setTerbuka(false);
        }}
        className="m-auto w-[min(56rem,calc(100vw-2.5rem))] rounded-2xl border border-line-strong bg-surface p-0 text-white backdrop:bg-background/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[80vh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line p-5">
            <h2 className="text-lg font-semibold">Pilih {judul.toLowerCase()}</h2>
            <button
              type="button"
              onClick={() => setTerbuka(false)}
              aria-label="Tutup"
              className="grid size-9 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="border-b border-line p-5">
            <form onSubmit={unggahDiTempat} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`berkas-${uid}`} className="text-xs text-muted-fg">
                  Unggah baru
                </label>
                <input
                  id={`berkas-${uid}`}
                  name="berkas"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  required
                  className="w-full rounded-lg border border-line-strong bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-white/[0.08] file:px-3 file:py-1.5 file:text-sm file:text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`alt-${uid}`} className="text-xs text-muted-fg">
                  Teks alternatif
                </label>
                <input
                  id={`alt-${uid}`}
                  name="alt"
                  required
                  placeholder="Apa yang terlihat di gambar"
                  className="w-full rounded-lg border border-line-strong bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-fg/50 focus-visible:border-brand"
                />
              </div>
              <button
                type="submit"
                disabled={sibuk}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright disabled:opacity-60"
              >
                {sibuk ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                Unggah
              </button>
            </form>

            {pesan && (
              <p role="alert" className="mt-3 text-sm text-red-300">
                {pesan}
              </p>
            )}
          </div>

          <div className="border-b border-line px-5 py-4">
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-fg"
              />
              <input
                value={cari}
                onChange={(e) => {
                  setCari(e.target.value);
                  muat(e.target.value);
                }}
                placeholder="Cari berdasarkan teks alternatif…"
                aria-label="Cari media"
                className="w-full rounded-lg border border-line-strong bg-background py-2.5 pl-10 pr-3.5 text-sm outline-none placeholder:text-muted-fg/50 focus-visible:border-brand"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {daftar === null ? (
              <p className="py-8 text-center text-sm text-muted-fg">Memuat…</p>
            ) : daftar.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-fg">
                {cari ? `Tidak ada media yang cocok dengan “${cari}”.` : "Pustaka media masih kosong."}
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {daftar.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onPilih({ id: m.id, url: m.url, alt: m.alt });
                      setTerbuka(false);
                    }}
                    aria-pressed={m.id === sampulId}
                    className={[
                      "group overflow-hidden rounded-lg border text-left transition-colors",
                      m.id === sampulId
                        ? "border-brand"
                        : "border-line hover:border-line-strong",
                    ].join(" ")}
                  >
                    <span className="relative block aspect-[4/3] bg-white/[0.03]">
                      <Image
                        src={m.url}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover"
                        unoptimized={m.tipe === "image/svg+xml"}
                      />
                    </span>
                    <span className="block truncate px-2.5 py-2 text-xs text-muted-fg">
                      {m.alt || "Tanpa alt"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
