"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Database, Loader2, TriangleAlert } from "lucide-react";
import { tanamBenihSekarang } from "@/lib/cms/aksi-benih";
import type { LaporanBenih } from "@/lib/cms/benih";
import { DialogKonfirmasi } from "@/components/cms/dialog-konfirmasi";

/**
 * Menanam data bawaan yang belum ada di basis data.
 *
 * Selalu tersedia, bukan hanya saat basis datanya kosong. Isi bawaannya
 * bertambah setiap kali ada jenis konten baru, sehingga basis data yang sudah
 * terisi pun bisa kekurangan bagian yang baru — dan dengan syarat "hanya saat
 * kosong", satu-satunya cara memuatnya adalah mengosongkan seluruh basis data.
 *
 * Komponennya SELALU dipasang, dan ia sendiri yang memutuskan menampilkan apa.
 * Kalau kehadirannya digantungkan pada hitungan di induk, ia akan lepas dari
 * DOM tepat setelah penanaman berhasil — aksi server selalu merender ulang
 * rute yang sedang dibuka — dan laporannya hilang sebelum sempat dibaca,
 * termasuk peringatan tentang naskah contoh dan potret stok.
 */
export function TombolBenih() {
  const router = useRouter();
  const [jalan, mulai] = useTransition();
  const [laporan, setLaporan] = useState<LaporanBenih | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [tanya, setTanya] = useState(false);

  if (laporan) {
    return (
      <div className="mt-8 rounded-xl border border-brand/30 bg-brand/[0.06] p-5">
        <p className="flex items-center gap-2 text-sm font-medium text-white">
          <Check className="size-4 text-brand" />
          Data awal terisi.
        </p>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {[
            ["Artikel", laporan.artikel],
            ["Kategori", laporan.kategori],
            ["Produk", laporan.produk],
            ["Anggota tim", laporan.anggota],
            ["Media", laporan.media],
            ["Blok teks", laporan.blok],
            ["Perjalanan", laporan.perjalanan],
            ["Layanan", laporan.layanan],
            ["Testimoni", laporan.testimoni],
            ["Grup layanan", laporan.grupLayanan],
          ].map(([label, n]) => (
            <div key={String(label)} className="flex gap-2">
              <dt className="text-muted-fg">{label}</dt>
              <dd className="font-medium text-white tabular-nums">{n}</dd>
            </div>
          ))}
        </dl>
        {laporan.catatan.length > 0 && (
          <ul className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4">
            {laporan.catatan.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-amber-200">
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-5 h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright"
        >
          Muat ulang
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <h2 className="text-[1.05rem] font-medium text-white">Muat data bawaan</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-fg">
        Menanam isi bawaan yang ikut terbundel bersama aplikasi: artikel,
        produk, anggota tim, kategori, teks beranda, nilai, FAQ, tonggak
        perjalanan, layanan, dan data perusahaan.
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-fg">
        Aman ditekan berulang. Yang sudah ada tidak digandakan, dan yang sudah
        dihapus tidak dihidupkan kembali — jadi suntingan Anda tidak tertimpa.
        Berguna setelah ada jenis konten baru, ketika basis datanya sudah
        terisi tetapi bagian yang baru masih kosong.
      </p>

      {galat && (
        <p role="alert" className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {galat}
        </p>
      )}

      <button
        type="button"
        disabled={jalan}
        onClick={() => setTanya(true)}
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright disabled:opacity-60"
      >
        {jalan ? <Loader2 className="size-4 animate-spin" /> : <Database className="size-4" />}
        {jalan ? "Memuat..." : "Muat data bawaan"}
      </button>

      <DialogKonfirmasi
        terbuka={tanya}
        judul="Muat data bawaan sekarang?"
        keterangan="Hanya yang belum ada yang ditanam. Isi yang sudah Anda sunting tidak tertimpa, dan yang sudah dihapus tidak dihidupkan kembali."
        labelYa="Muat"
        sedangProses={jalan}
        onBatal={() => setTanya(false)}
        onYa={() =>
          mulai(async () => {
            setGalat(null);
            const h = await tanamBenihSekarang();
            setTanya(false);
            if (!h.ok) {
              setGalat(h.pesan);
              return;
            }
            setLaporan(h.laporan);
          })
        }
      />
    </div>
  );
}
