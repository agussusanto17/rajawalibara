"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2, Trash2, TriangleAlert } from "lucide-react";
import { hapusProduk, simpanProduk } from "@/lib/cms/aksi-produk";
import { keSlug } from "@/lib/cms/skema";
import { DialogKonfirmasi } from "@/components/cms/dialog-konfirmasi";
import { GrupBerulang } from "@/components/cms/grup-berulang";
import { PemilihSampul } from "@/components/cms/pemilih-sampul";
import { PemilihIkon } from "@/components/cms/pemilih-ikon";

export type NilaiProduk = {
  nama: string;
  namaPanjang: string;
  slug: string;
  jenis: "BATUBARA" | "MINERAL";
  ringkas: string;
  deskripsi: string;
  ikon: string;
  peruntukan: string;
  asal: string;
  urutan: number;
  status: "DRAF" | "TERBIT";
  unggulan: boolean;
  spesifikasi: { parameter: string; nilai: string; satuan: string }[];
  keunggulan: { icon: string; title: string; body: string }[];
  galeri: { src: string; caption: string }[];
  mitraId: string[];
  langkah: { title: string; body: string }[];
  sampulId: string | null;
  sampulUrl: string | null;
  sampulAlt: string | null;
  seoJudul: string | null;
  seoDeskripsi: string | null;
};

const ISIAN =
  "w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-[0.95rem] text-white outline-none transition-colors placeholder:text-muted-fg/50 focus-visible:border-brand";
const ISIAN_DALAM =
  "w-full rounded-lg border border-line-strong bg-background px-3 py-2 text-sm text-white outline-none placeholder:text-muted-fg/50 focus-visible:border-brand";
const LABEL = "text-[0.95rem] font-medium text-white";

function Galat({ peta, k }: { peta: Record<string, string>; k: string }) {
  if (!peta[k]) return null;
  return <p className="mt-1 text-xs text-red-300">{peta[k]}</p>;
}

export function FormProduk({
  id,
  awal,
  ikon,
  mitra,
}: {
  id: string | null;
  awal: NilaiProduk;
  ikon: string[];
  /** Seluruh mitra yang tersedia untuk dipasangkan ke komoditas ini. */
  mitra: { id: string; nama: string; sektor: string }[];
}) {
  const router = useRouter();
  const [nilai, setNilai] = useState(awal);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [sukses, setSukses] = useState(false);
  const [menyimpan, mulai] = useTransition();
  const [tanyaHapus, setTanyaHapus] = useState(false);
  const [menghapus, setMenghapus] = useState(false);

  const ubah = <K extends keyof NilaiProduk>(k: K, v: NilaiProduk[K]) =>
    setNilai((n) => ({ ...n, [k]: v }));

  function simpan() {
    setGalat({});
    setPesan(null);
    setSukses(false);

    mulai(async () => {
      const h = await simpanProduk(id, {
        ...nilai,
        seoJudul: nilai.seoJudul || null,
        seoDeskripsi: nilai.seoDeskripsi || null,
      });
      if (!h.ok) {
        setPesan(h.pesan);
        setGalat(h.galat ?? {});
        return;
      }
      setSukses(true);
      if (!id) router.replace(`/admin/produk/${h.id}`);
      else router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="sticky top-0 z-20 -mx-5 -mt-8 mb-2 flex flex-wrap items-center justify-between gap-4 border-b border-line bg-background/85 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:-mt-10 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/admin/produk"
            aria-label="Kembali ke daftar produk"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-line-strong text-muted-fg transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h1 className="truncate text-2xl font-semibold text-white">
            {id ? "Sunting produk" : "Produk baru"}
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
            {menyimpan ? <Loader2 className="size-4 animate-spin" /> : sukses ? <Check className="size-4" /> : null}
            {menyimpan ? "Menyimpan..." : sukses ? "Tersimpan" : "Simpan"}
          </button>
        </div>
      </div>

      {pesan && (
        <p role="alert" className="mt-6 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {pesan}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="nama" className={LABEL}>Nama pendek</label>
            <input
              id="nama"
              value={nilai.nama}
              onChange={(e) => {
                const v = e.target.value;
                setNilai((n) => ({ ...n, nama: v, slug: id ? n.slug : keSlug(v) }));
              }}
              placeholder="GAR 4200"
              className={`${ISIAN} mt-2`}
            />
            <Galat peta={galat} k="nama" />
          </div>
          <div>
            <label htmlFor="urutan" className={LABEL}>Urutan tampil</label>
            <input
              id="urutan"
              type="number"
              min={0}
              value={nilai.urutan}
              onChange={(e) => ubah("urutan", Number(e.target.value))}
              className={`${ISIAN} mt-2`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="panjang" className={LABEL}>Nama panjang</label>
          <input
            id="panjang"
            value={nilai.namaPanjang}
            onChange={(e) => ubah("namaPanjang", e.target.value)}
            placeholder="Sistem Penerimaan Murid Baru"
            className={`${ISIAN} mt-2`}
          />
          <Galat peta={galat} k="namaPanjang" />
        </div>

        <div>
          <label htmlFor="slug" className={LABEL}>Slug</label>
          <input
            id="slug"
            value={nilai.slug}
            onChange={(e) => ubah("slug", e.target.value)}
            className={`${ISIAN} mt-2 font-mono text-sm`}
          />
          <p className="mt-1 text-xs text-muted-fg">/produk/{nilai.slug || "…"}</p>
          <Galat peta={galat} k="slug" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="ikon" className={LABEL}>Ikon</label>
            <div className="mt-2">
              <PemilihIkon
                ikon={ikon}
                nilai={nilai.ikon}
                onPilih={(v) => ubah("ikon", v)}
                label="Pilih ikon komoditas"
              />
            </div>
            <p className="mt-1 text-xs text-muted-fg">
              Daftar tertutup, sesuai ikon yang tersedia di kode.
            </p>
            <Galat peta={galat} k="ikon" />
          </div>
          <div>
            <label htmlFor="peruntukan" className={LABEL}>Peruntukan</label>
            <input
              id="peruntukan"
              value={nilai.peruntukan}
              onChange={(e) => ubah("peruntukan", e.target.value)}
              placeholder="PLTU, industri semen, smelter"
              className={`${ISIAN} mt-2`}
            />
            <Galat peta={galat} k="peruntukan" />
          </div>

          <div>
            <label htmlFor="jenis" className={LABEL}>Jenis</label>
            <select
              id="jenis"
              value={nilai.jenis}
              onChange={(e) => ubah("jenis", e.target.value as NilaiProduk["jenis"])}
              className={`${ISIAN} mt-2`}
            >
              <option value="BATUBARA">Batubara</option>
              <option value="MINERAL">Mineral</option>
            </select>
            <Galat peta={galat} k="jenis" />
          </div>
        </div>

        <div>
          <label htmlFor="ringkas" className={LABEL}>
            Ringkasan <span className="ml-2 font-normal text-muted-fg">{nilai.ringkas.length}/300</span>
          </label>
          <textarea
            id="ringkas"
            rows={2}
            value={nilai.ringkas}
            onChange={(e) => ubah("ringkas", e.target.value)}
            className={`${ISIAN} mt-2 resize-y`}
          />
          <p className="mt-1 text-xs text-muted-fg">Dipakai di kartu komoditas.</p>
          <Galat peta={galat} k="ringkas" />
        </div>

        <div>
          <label htmlFor="deskripsi" className={LABEL}>Deskripsi</label>
          <textarea
            id="deskripsi"
            rows={4}
            value={nilai.deskripsi}
            onChange={(e) => ubah("deskripsi", e.target.value)}
            className={`${ISIAN} mt-2 resize-y`}
          />
          <Galat peta={galat} k="deskripsi" />
        </div>

        <fieldset>
          <legend className={LABEL}>Status</legend>
          <div className="mt-2 flex gap-2">
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

        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={nilai.unggulan}
              onChange={(e) => ubah("unggulan", e.target.checked)}
              className="mt-0.5 size-4 accent-brand"
            />
            <span>
              <span className={LABEL}>Tampilkan sebagai produk unggulan</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-fg">
                Tampil sebagai kartu besar bertumpuk di beranda dan di bagian
                atas halaman produk. Sampul wajib dipilih lebih dulu, karena
                kartunya memuat foto selebar kartu. Tanpa penanda ini produk
                tetap tampil, tetapi sebagai kartu biasa di bawah.
              </span>
            </span>
          </label>
          <Galat peta={galat} k="unggulan" />
        </div>

        {/* --------------------------------------------------- Spesifikasi */}
        <div className="rounded-xl border border-line bg-surface/50 p-5">
          <h3 className={LABEL}>Spesifikasi teknis</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-fg">
            Bagian yang paling dulu dibaca calon pembeli, dan satu-satunya yang
            wajib diisi. Nilainya boleh ditulis sebagai rentang
            (&ldquo;4.200 – 4.400&rdquo;) atau batas (&ldquo;maks. 1&rdquo;).
          </p>

          <div className="mt-4">
            <GrupBerulang
              label="Baris"
              butir={nilai.spesifikasi}
              kosong={() => ({ parameter: "", nilai: "", satuan: "" })}
              minimal={1}
              onUbah={(v) => ubah("spesifikasi", v)}
              render={(sp, set) => (
                <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr_0.7fr]">
                  <input
                    value={sp.parameter}
                    onChange={(e) => set({ ...sp, parameter: e.target.value })}
                    placeholder="Nilai kalor (GAR)"
                    aria-label="Parameter"
                    className={ISIAN_DALAM}
                  />
                  <input
                    value={sp.nilai}
                    onChange={(e) => set({ ...sp, nilai: e.target.value })}
                    placeholder="4.200 – 4.400"
                    aria-label="Nilai"
                    className={ISIAN_DALAM}
                  />
                  <input
                    value={sp.satuan}
                    onChange={(e) => set({ ...sp, satuan: e.target.value })}
                    placeholder="kcal/kg"
                    aria-label="Satuan"
                    className={ISIAN_DALAM}
                  />
                </div>
              )}
            />
          </div>
          <Galat peta={galat} k="spesifikasi" />
        </div>

        {/* ---------------------------------------------------------- Asal */}
        <div>
          <label htmlFor="asal" className={LABEL}>Asal tambang & legalitas</label>
          <textarea
            id="asal"
            rows={4}
            value={nilai.asal}
            onChange={(e) => ubah("asal", e.target.value)}
            placeholder="Sumber tambang, dokumen asal barang, dan izin yang menyertainya."
            className={`${ISIAN} mt-2 resize-y`}
          />
          <p className="mt-1 text-xs leading-relaxed text-muted-fg">
            Boleh kosong — bagiannya tidak dirender selama belum diisi. Jangan
            diisi klaim yang belum bisa dibuktikan dokumennya: inilah bagian
            yang paling mudah dibantah pembeli.
          </p>
          <Galat peta={galat} k="asal" />
        </div>

        {/* ---------------------------------------------------- Keunggulan */}
        <GrupBerulang
          label="Keunggulan tingkatan ini"
          keterangan="Keunggulan tingkatan ini sendiri, bukan keunggulan perusahaan — yang itu ditulis sekali di Isi halaman."
          butir={nilai.keunggulan}
          kosong={() => ({ icon: "", title: "", body: "" })}
          onUbah={(v) => ubah("keunggulan", v)}
          render={(m, set, i) => (
            <div className="flex flex-col gap-2">
              <div className="w-56">
                <PemilihIkon
                  ringkas
                  ikon={ikon}
                  nilai={m.icon}
                  onPilih={(icon) => set({ ...m, icon })}
                  label={`Pilih ikon keunggulan ${i + 1}`}
                />
              </div>
              <Galat peta={galat} k={`keunggulan.${i}.icon`} />
              <input
                value={m.title}
                onChange={(e) => set({ ...m, title: e.target.value })}
                placeholder="Judul"
                aria-label="Judul keunggulan"
                className={ISIAN_DALAM}
              />
              <textarea
                rows={2}
                value={m.body}
                onChange={(e) => set({ ...m, body: e.target.value })}
                placeholder="Keterangan"
                aria-label="Keterangan keunggulan"
                className={`${ISIAN_DALAM} resize-y`}
              />
            </div>
          )}
        />
        <Galat peta={galat} k="keunggulan" />

        {/* ------------------------------------------------------- Langkah */}
        <GrupBerulang
          label="Langkah memulai"
          keterangan="Kosongkan untuk memakai langkah umum yang berlaku semua komoditas."
          butir={nilai.langkah}
          kosong={() => ({ title: "", body: "" })}
          onUbah={(v) => ubah("langkah", v)}
          render={(l, set) => (
            <div className="flex flex-col gap-2">
              <input
                value={l.title}
                onChange={(e) => set({ ...l, title: e.target.value })}
                placeholder="Judul langkah"
                aria-label="Judul langkah"
                className={ISIAN_DALAM}
              />
              <textarea
                rows={2}
                value={l.body}
                onChange={(e) => set({ ...l, body: e.target.value })}
                placeholder="Keterangan"
                aria-label="Keterangan langkah"
                className={`${ISIAN_DALAM} resize-y`}
              />
            </div>
          )}
        />

        {/* -------------------------------------------------------- Galeri */}
        <GrupBerulang
          label="Galeri"
          keterangan="Foto kargo, stockpile, atau pemuatan. Dua yang pertama tampil di sebelah tabel spesifikasi."
          butir={nilai.galeri}
          kosong={() => ({ src: "", caption: "" })}
          onUbah={(v) => ubah("galeri", v)}
          render={(t, set) => (
            <div className="flex flex-col gap-2">
              <input
                value={t.src}
                onChange={(e) => set({ ...t, src: e.target.value })}
                placeholder="/media/2026-09/foto-abc123.webp"
                aria-label="Alamat foto"
                className={`${ISIAN_DALAM} font-mono text-xs`}
              />
              <input
                value={t.caption}
                onChange={(e) => set({ ...t, caption: e.target.value })}
                placeholder="Keterangan"
                aria-label="Keterangan foto"
                className={ISIAN_DALAM}
              />
            </div>
          )}
        />

        {/* --------------------------------------------------------- Mitra */}
        <fieldset>
          <legend className="text-[0.95rem] font-medium text-white">
            Mitra yang memakai produk ini
          </legend>
          <p className="mt-1 text-xs leading-relaxed text-muted-fg">
            Nama dan logonya dikelola sekali di halaman Mitra. Satu mitra bisa
            dipasang ke berapa pun produk, jadi mengganti logonya cukup di satu
            tempat. Kosong berarti halaman produk menampilkan slot bertanda.
          </p>

          {mitra.length === 0 ? (
            <p className="mt-3 rounded-lg border border-dashed border-line px-4 py-6 text-center text-sm text-muted-fg">
              Belum ada mitra. Tambahkan lebih dulu di menu Mitra.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-1 rounded-xl border border-line p-2">
              {mitra.map((m) => {
                const dipilih = nilai.mitraId.includes(m.id);
                return (
                  <label
                    key={m.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/[0.04]"
                  >
                    <input
                      type="checkbox"
                      checked={dipilih}
                      onChange={(e) =>
                        ubah(
                          "mitraId",
                          e.target.checked
                            ? [...nilai.mitraId, m.id]
                            : nilai.mitraId.filter((x) => x !== m.id),
                        )
                      }
                      className="size-4 accent-brand"
                    />
                    <span className="text-white">{m.nama}</span>
                    <span className="text-xs text-muted-fg">{m.sektor}</span>
                  </label>
                );
              })}
            </div>
          )}
        </fieldset>
      </div>

      {id && (
        <DialogKonfirmasi
          terbuka={tanyaHapus}
          judul="Hapus produk ini?"
          keterangan="Produk akan hilang dari daftar dan dari situs publik. Isinya tidak dibuang dari basis data, jadi masih bisa dipulihkan."
          labelYa="Hapus"
          sedangProses={menghapus}
          onBatal={() => setTanyaHapus(false)}
          onYa={async () => {
            setMenghapus(true);
            const h = await hapusProduk(id);
            if (h.ok) {
              router.push("/admin/produk");
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
