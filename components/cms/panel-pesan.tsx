"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  Building2,
  Loader2,
  Mail,
  Phone,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  arsipkanPesan,
  hapusPermanenPesan,
  simpanCatatanPesan,
  ubahStatusPesan,
} from "@/lib/cms/aksi-pesan";
import { DialogKonfirmasi } from "@/components/cms/dialog-konfirmasi";
import { Pilihan } from "@/components/cms/pilihan";

export type BarisPesan = {
  id: string;
  nama: string;
  email: string;
  telepon: string | null;
  organisasi: string | null;
  isi: string;
  produk: string | null;
  halaman: string | null;
  kampanye: string | null;
  status: "BARU" | "DIPROSES" | "SELESAI";
  catatan: string | null;
  dibuatPada: string;
  diarsipkan: boolean;
};

const WARNA: Record<BarisPesan["status"], string> = {
  BARU: "bg-brand/15 text-brand",
  DIPROSES: "bg-amber-400/15 text-amber-300",
  SELESAI: "bg-white/[0.07] text-muted-fg",
};

const waktu = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function PanelPesan({
  pesan,
  hitungan,
  saring,
  cari,
  lihatArsip,
  halaman,
  totalHalaman,
}: {
  pesan: BarisPesan[];
  hitungan: { semua: number; baru: number; diproses: number; selesai: number; arsip: number };
  saring: string;
  cari: string;
  lihatArsip: boolean;
  halaman: number;
  totalHalaman: number;
}) {
  const router = useRouter();
  const [sibuk, mulai] = useTransition();
  const [galat, setGalat] = useState<string | null>(null);
  const [catatan, setCatatan] = useState<Record<string, string>>({});
  const [tanyaHapus, setTanyaHapus] = useState<BarisPesan | null>(null);
  const [menghapus, setMenghapus] = useState(false);

  const tautan = (p: Record<string, string>) =>
    `/admin/pesan?${new URLSearchParams({
      ...(cari ? { q: cari } : {}),
      ...(saring !== "semua" ? { saring } : {}),
      ...(lihatArsip ? { arsip: "1" } : {}),
      ...p,
    })}`;

  const CHIP = [
    { nilai: "semua", label: "Semua", jumlah: hitungan.semua },
    { nilai: "baru", label: "Baru", jumlah: hitungan.baru },
    { nilai: "diproses", label: "Diproses", jumlah: hitungan.diproses },
    { nilai: "selesai", label: "Selesai", jumlah: hitungan.selesai },
  ];

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {lihatArsip ? "Arsip pesan" : "Pesan masuk"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-fg">
            {cari
              ? `${hitungan.semua} hasil untuk “${cari}”.`
              : `${hitungan.semua} pesan${lihatArsip ? " diarsipkan" : ""}.`}
          </p>
        </div>

        <Link
          href={lihatArsip ? "/admin/pesan" : "/admin/pesan?arsip=1"}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong px-4 text-sm font-medium text-muted-fg transition-colors hover:text-white"
        >
          <Archive className="size-4" />
          {lihatArsip ? "Kembali ke kotak masuk" : `Arsip (${hitungan.arsip})`}
        </Link>
      </div>

      {galat && (
        <p role="alert" className="mt-6 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {galat}
        </p>
      )}

      <form method="get" role="search" className="mt-6 flex max-w-md gap-2">
        {lihatArsip && <input type="hidden" name="arsip" value="1" />}
        {saring !== "semua" && <input type="hidden" name="saring" value={saring} />}
        <div className="relative flex-1">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-fg" />
          <input
            type="search"
            name="q"
            defaultValue={cari}
            placeholder="Cari nama, email, organisasi, isi pesan…"
            aria-label="Cari pesan"
            className="w-full rounded-lg border border-line-strong bg-surface py-2.5 pl-10 pr-3.5 text-[0.95rem] text-white outline-none placeholder:text-muted-fg/50 focus-visible:border-brand"
          />
        </div>
        <button type="submit" className="rounded-lg border border-line-strong px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]">
          Cari
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {CHIP.map((c) => (
          <Link
            key={c.nilai}
            href={tautan({ saring: c.nilai })}
            aria-current={c.nilai === saring ? "page" : undefined}
            className={[
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              c.nilai === saring
                ? "bg-brand text-background"
                : "border border-line-strong text-muted-fg hover:text-white",
            ].join(" ")}
          >
            {c.label}
            <span className={["rounded-full px-1.5 text-xs tabular-nums", c.nilai === saring ? "bg-background/20" : "bg-white/[0.07]"].join(" ")}>
              {c.jumlah}
            </span>
          </Link>
        ))}
      </div>

      {pesan.length === 0 ? (
        <p className="mt-8 rounded-xl border border-line bg-surface p-6 text-sm text-muted-fg">
          {cari ? `Tidak ada pesan yang cocok dengan “${cari}”.` : "Belum ada pesan."}
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {pesan.map((p) => (
            <article key={p.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-[1.05rem] font-medium text-white">{p.nama}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${WARNA[p.status]}`}>
                      {p.status === "BARU" ? "Baru" : p.status === "DIPROSES" ? "Diproses" : "Selesai"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-fg">{waktu(p.dibuatPada)}</p>
                </div>

                {!p.diarsipkan && (
                  <div className="w-40 shrink-0">
                    <Pilihan
                      ringkas
                      value={p.status}
                      aria-label={`Status pesan dari ${p.nama}`}
                      onChange={(e) =>
                        mulai(async () => {
                          setGalat(null);
                          const h = await ubahStatusPesan(p.id, e.target.value);
                          if (!h.ok) setGalat(h.pesan);
                          else router.refresh();
                        })
                      }
                    >
                      <option value="BARU">Baru</option>
                      <option value="DIPROSES">Diproses</option>
                      <option value="SELESAI">Selesai</option>
                    </Pilihan>
                  </div>
                )}
              </div>

              {/* Kontak dibuat bisa diklik: yang membaca ini akan membalas, dan
                  menyalin alamat dengan tangan mengundang salah ketik. */}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a href={`mailto:${p.email}`} className="inline-flex items-center gap-1.5 text-brand hover:underline">
                  <Mail className="size-3.5" />
                  {p.email}
                </a>
                {p.telepon && (
                  <a href={`tel:${p.telepon.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 text-brand hover:underline">
                    <Phone className="size-3.5" />
                    {p.telepon}
                  </a>
                )}
                {p.organisasi && (
                  <span className="inline-flex items-center gap-1.5 text-muted-fg">
                    <Building2 className="size-3.5" />
                    {p.organisasi}
                  </span>
                )}
              </div>

              <p className="mt-4 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-white/85">
                {p.isi}
              </p>

              {(p.produk || p.halaman || p.kampanye) && (
                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 rounded-lg bg-white/[0.03] px-3.5 py-3 text-xs">
                  {p.produk && (
                    <div className="flex gap-1.5">
                      <dt className="text-muted-fg">Produk</dt>
                      <dd className="font-mono text-white/80">{p.produk}</dd>
                    </div>
                  )}
                  {p.halaman && (
                    <div className="flex min-w-0 gap-1.5">
                      <dt className="shrink-0 text-muted-fg">Halaman</dt>
                      <dd className="truncate font-mono text-white/80">{p.halaman}</dd>
                    </div>
                  )}
                  {p.kampanye && (
                    <div className="flex min-w-0 gap-1.5">
                      <dt className="shrink-0 text-muted-fg">Kampanye</dt>
                      <dd className="truncate font-mono text-white/80">{p.kampanye}</dd>
                    </div>
                  )}
                </dl>
              )}

              <div className="mt-4 flex flex-col gap-2">
                <label htmlFor={`c-${p.id}`} className="text-xs text-muted-fg">
                  Catatan internal — tidak pernah dikirim ke pengirim pesan
                </label>
                <textarea
                  id={`c-${p.id}`}
                  rows={2}
                  defaultValue={p.catatan ?? ""}
                  onChange={(e) => setCatatan((c) => ({ ...c, [p.id]: e.target.value }))}
                  onBlur={() => {
                    const nilai = catatan[p.id];
                    if (nilai === undefined || nilai === (p.catatan ?? "")) return;
                    mulai(async () => {
                      const h = await simpanCatatanPesan(p.id, nilai);
                      if (!h.ok) setGalat(h.pesan);
                    });
                  }}
                  className="w-full resize-y rounded-lg border border-line-strong bg-background px-3 py-2 text-sm text-white outline-none placeholder:text-muted-fg/50 focus-visible:border-brand"
                  placeholder="Sudah ditelepon, menunggu balasan…"
                />
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                {!p.diarsipkan && (
                  <button
                    type="button"
                    disabled={sibuk}
                    onClick={() =>
                      mulai(async () => {
                        setGalat(null);
                        const h = await arsipkanPesan(p.id);
                        if (!h.ok) setGalat(h.pesan);
                        else router.refresh();
                      })
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-line-strong px-3.5 text-sm text-muted-fg transition-colors hover:text-white disabled:opacity-50"
                  >
                    {sibuk ? <Loader2 className="size-3.5 animate-spin" /> : <Archive className="size-3.5" />}
                    Arsipkan
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setGalat(null);
                    setTanyaHapus(p);
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-line-strong px-3.5 text-sm text-muted-fg transition-colors hover:border-red-500/40 hover:text-red-300"
                >
                  <Trash2 className="size-3.5" />
                  Hapus permanen
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalHalaman > 1 && (
        <nav aria-label="Halaman pesan" className="mt-8 flex flex-wrap justify-center gap-2">
          {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={tautan({ hal: String(n) })}
              aria-current={n === halaman ? "page" : undefined}
              className={[
                "grid size-10 place-items-center rounded-lg text-sm font-medium transition-colors",
                n === halaman ? "bg-brand text-background" : "border border-line-strong text-muted-fg hover:text-white",
              ].join(" ")}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}

      <DialogKonfirmasi
        terbuka={tanyaHapus !== null}
        judul="Hapus pesan ini selamanya?"
        keterangan={
          `Pesan dari ${tanyaHapus?.nama ?? ""} akan dibuang dari basis data dan TIDAK bisa dipulihkan. ` +
          "Berbeda dari konten lain, penghapusan di sini benar-benar menghapus: isinya data pribadi, " +
          "dan menandainya saja bukan penghapusan. Untuk sekadar merapikan kotak masuk, pakai Arsipkan."
        }
        labelYa="Hapus selamanya"
        sedangProses={menghapus}
        onBatal={() => setTanyaHapus(null)}
        onYa={async () => {
          if (!tanyaHapus) return;
          setMenghapus(true);
          const h = await hapusPermanenPesan(tanyaHapus.id);
          setMenghapus(false);
          setTanyaHapus(null);
          if (!h.ok) setGalat(h.pesan);
          else router.refresh();
        }}
      />
    </>
  );
}
