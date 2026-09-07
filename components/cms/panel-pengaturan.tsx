"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Plus, Trash2, TriangleAlert } from "lucide-react";
import {
  hapusSeo,
  simpanBeranda,
  simpanPerusahaan,
  simpanSeo,
  simpanStatistik,
} from "@/lib/cms/aksi-pengaturan";
import type { HasilAksi } from "@/lib/cms/aksi-artikel";
import { PemilihSampul } from "@/components/cms/pemilih-sampul";

const ISIAN =
  "w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-[0.95rem] text-white outline-none transition-colors placeholder:text-muted-fg/50 focus-visible:border-brand";
const LABEL = "text-[0.95rem] font-medium text-white";

function Galat({ peta, k }: { peta: Record<string, string>; k: string }) {
  if (!peta[k]) return null;
  return <p className="mt-1 text-xs text-red-300">{peta[k]}</p>;
}

/** Tombol simpan bersama, dengan tiga keadaannya. */
function Simpan({
  jalan,
  sukses,
  onKlik,
}: {
  jalan: boolean;
  sukses: boolean;
  onKlik: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onKlik}
      disabled={jalan}
      className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright disabled:opacity-60"
    >
      {jalan ? <Loader2 className="size-4 animate-spin" /> : sukses ? <Check className="size-4" /> : null}
      {jalan ? "Menyimpan..." : sukses ? "Tersimpan" : "Simpan"}
    </button>
  );
}

function Peringatan({ pesan }: { pesan: string | null }) {
  if (!pesan) return null;
  return (
    <p role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" />
      {pesan}
    </p>
  );
}

/** Menyatukan pola simpan yang sama di keempat bagian. */
function usePenyimpan() {
  const router = useRouter();
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [sukses, setSukses] = useState(false);
  const [jalan, mulai] = useTransition();

  const simpan = (aksi: () => Promise<HasilAksi>) =>
    mulai(async () => {
      setGalat({});
      setPesan(null);
      setSukses(false);
      const h = await aksi();
      if (!h.ok) {
        setPesan(h.pesan);
        setGalat(h.galat ?? {});
        return;
      }
      setSukses(true);
      router.refresh();
    });

  return { galat, pesan, sukses, jalan, simpan, setPesan };
}

/* ------------------------------------------------------------ Perusahaan --*/

/**
 * Alamat dan koordinat TIDAK di sini.
 *
 * Perusahaan punya kantor pusat dan cabang; menyimpan salah satunya sebagai
 * "alamat perusahaan" berarti yang lain hidup di tempat lain dan pasti
 * berselisih. Keduanya disunting di bagian Kantor.
 *
 * Misi juga tidak di sini: lima butir bernomor tidak muat sebagai satu kolom
 * teks tanpa kehilangan nomornya. Ia disunting di Isi halaman → Misi.
 */
type Perusahaan = {
  nama: string; namaLegal: string; tagline: string; nib: string; berdiri: number;
  intro: string; telepon: string; whatsapp: string; email: string;
  visi: string; sejarah: string; latarBelakang: string;
};

const PERUSAHAAN_KOSONG: Perusahaan = {
  nama: "", namaLegal: "", tagline: "", nib: "", berdiri: new Date().getFullYear(),
  intro: "", telepon: "", whatsapp: "", email: "",
  visi: "", sejarah: "", latarBelakang: "",
};

export function FormPerusahaan({ awal }: { awal: Perusahaan | null }) {
  const [n, setN] = useState<Perusahaan>(awal ?? PERUSAHAAN_KOSONG);
  const { galat, pesan, sukses, jalan, simpan } = usePenyimpan();
  const u = <K extends keyof Perusahaan>(k: K, v: Perusahaan[K]) =>
    setN((x) => ({ ...x, [k]: v }));

  const teks = (k: keyof Perusahaan, label: string, baris = 1) => (
    <div>
      <label htmlFor={`p-${k}`} className={LABEL}>{label}</label>
      {baris > 1 ? (
        <textarea
          id={`p-${k}`}
          rows={baris}
          value={String(n[k])}
          onChange={(e) => u(k, e.target.value as never)}
          className={`${ISIAN} mt-2 resize-y`}
        />
      ) : (
        <input
          id={`p-${k}`}
          value={String(n[k])}
          onChange={(e) => u(k, e.target.value as never)}
          className={`${ISIAN} mt-2`}
        />
      )}
      <Galat peta={galat} k={k} />
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <Peringatan pesan={pesan} />

      <div className="grid gap-6 sm:grid-cols-2">
        {teks("nama", "Nama pendek")}
        {teks("namaLegal", "Nama legal")}
        {teks("tagline", "Tagline")}
        {teks("nib", "NIB")}
        <div>
          <label htmlFor="p-berdiri" className={LABEL}>Tahun berdiri</label>
          <input
            id="p-berdiri"
            type="number"
            value={n.berdiri}
            onChange={(e) => u("berdiri", Number(e.target.value))}
            className={`${ISIAN} mt-2`}
          />
          <Galat peta={galat} k="berdiri" />
        </div>
      </div>

      {teks("intro", "Intro", 3)}

      <div className="grid gap-6 sm:grid-cols-2">
        {teks("telepon", "Telepon")}
        {teks("email", "Email")}
      </div>
      {teks("whatsapp", "Tautan WhatsApp")}

      {teks("visi", "Visi", 3)}
      {teks("sejarah", "Sejarah", 5)}
      {teks("latarBelakang", "Latar belakang", 4)}

      <p className="rounded-lg border border-line bg-surface/50 px-4 py-3 text-xs leading-relaxed text-muted-fg">
        Alamat kantor disunting di bagian <strong className="text-white">Kantor</strong>,
        dan butir misi di <strong className="text-white">Isi halaman → Misi</strong>.
        Keduanya berupa daftar, jadi tidak muat sebagai satu kolom di sini.
      </p>

      <div className="flex justify-end">
        <Simpan jalan={jalan} sukses={sukses} onKlik={() => simpan(() => simpanPerusahaan(n))} />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Beranda --*/

type Beranda = {
  pitaTag: string; pitaTeks: string; pitaTautan: string; judul: string;
  intro: string;
  ctaUtamaLabel: string; ctaUtamaLabelPendek: string; ctaUtamaHref: string;
  ctaKeduaLabel: string; ctaKeduaLabelPendek: string; ctaKeduaHref: string;
  manifesto: string;
  fotoSatuId: string | null; fotoSatuUrl: string | null; fotoSatuAlt: string | null;
  fotoDuaId: string | null; fotoDuaUrl: string | null; fotoDuaAlt: string | null;
};

const BERANDA_KOSONG: Beranda = {
  pitaTag: "", pitaTeks: "", pitaTautan: "", judul: "", intro: "",
  ctaUtamaLabel: "", ctaUtamaLabelPendek: "", ctaUtamaHref: "",
  ctaKeduaLabel: "", ctaKeduaLabelPendek: "", ctaKeduaHref: "",
  manifesto: "",
  fotoSatuId: null, fotoSatuUrl: null, fotoSatuAlt: null,
  fotoDuaId: null, fotoDuaUrl: null, fotoDuaAlt: null,
};

export function FormBeranda({ awal }: { awal: Beranda | null }) {
  const [n, setN] = useState<Beranda>(awal ?? BERANDA_KOSONG);
  const { galat, pesan, sukses, jalan, simpan } = usePenyimpan();
  const u = <K extends keyof Beranda>(k: K, v: Beranda[K]) =>
    setN((x) => ({ ...x, [k]: v }));

  return (
    <div className="flex flex-col gap-6">
      <Peringatan pesan={pesan} />

      {!awal && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-sm leading-relaxed text-amber-200">
          Copy beranda belum pernah diisi. Teks yang tampil sekarang masih
          tertulis langsung di dalam kode hero, jadi mengisi formulir ini belum
          mengubah apa pun sampai halaman beranda dialihkan membacanya dari sini.
        </p>
      )}

      <fieldset className="rounded-xl border border-line bg-surface/50 p-5">
        <legend className={LABEL}>Pita di atas judul</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="b-tag" className="text-sm text-muted-fg">Label</label>
            <input id="b-tag" value={n.pitaTag} onChange={(e) => u("pitaTag", e.target.value)} placeholder="Sejak 2021" className={`${ISIAN} mt-1.5`} />
            <Galat peta={galat} k="pitaTag" />
          </div>
          <div>
            <label htmlFor="b-teks" className="text-sm text-muted-fg">Teks</label>
            <input id="b-teks" value={n.pitaTeks} onChange={(e) => u("pitaTeks", e.target.value)} placeholder="Dari ide sampai rilis" className={`${ISIAN} mt-1.5`} />
            <Galat peta={galat} k="pitaTeks" />
          </div>
          <div>
            <label htmlFor="b-tautan" className="text-sm text-muted-fg">Tautan</label>
            <input id="b-tautan" value={n.pitaTautan} onChange={(e) => u("pitaTautan", e.target.value)} placeholder="/layanan" className={`${ISIAN} mt-1.5 font-mono text-sm`} />
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="b-judul" className={LABEL}>Judul hero</label>
        <textarea
          id="b-judul"
          rows={3}
          value={n.judul}
          onChange={(e) => u("judul", e.target.value)}
          className={`${ISIAN} mt-2 resize-y`}
        />
        {/* Penanda, bukan rich text: gaya bebas di judul display merusak
            tipografinya, dan editor tidak punya cara melihat akibatnya. */}
        <p className="mt-1 text-xs leading-relaxed text-muted-fg">
          Bungkus kata dengan <code className="text-white">[[…]]</code> untuk
          menyorotnya dengan warna merek. Contoh: Mitra energi Anda yang{" "}
          <code className="text-white">[[merancang]]</code> dan membangun.
        </p>
        <Galat peta={galat} k="judul" />
      </div>

      <div>
        <label htmlFor="b-intro" className={LABEL}>Intro</label>
        <textarea id="b-intro" rows={3} value={n.intro} onChange={(e) => u("intro", e.target.value)} className={`${ISIAN} mt-2 resize-y`} />
        <Galat peta={galat} k="intro" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <fieldset className="rounded-xl border border-line bg-surface/50 p-5">
          <legend className="text-sm font-medium text-white">Tombol utama</legend>
          <input value={n.ctaUtamaLabel} onChange={(e) => u("ctaUtamaLabel", e.target.value)} aria-label="Label tombol utama" placeholder="Lihat Spesifikasi Batubara" className={`${ISIAN} mt-3`} />
          <input value={n.ctaUtamaLabelPendek} onChange={(e) => u("ctaUtamaLabelPendek", e.target.value)} aria-label="Label pendek tombol utama, dipakai di layar sempit" placeholder="Lihat Produk" className={`${ISIAN} mt-2`} />
          <input value={n.ctaUtamaHref} onChange={(e) => u("ctaUtamaHref", e.target.value)} aria-label="Tautan tombol utama" placeholder="/layanan" className={`${ISIAN} mt-2 font-mono text-sm`} />
          <Galat peta={galat} k="ctaUtamaLabel" />
        </fieldset>
        <fieldset className="rounded-xl border border-line bg-surface/50 p-5">
          <legend className="text-sm font-medium text-white">Tombol kedua</legend>
          <input value={n.ctaKeduaLabel} onChange={(e) => u("ctaKeduaLabel", e.target.value)} aria-label="Label tombol kedua" placeholder="Profil Perusahaan" className={`${ISIAN} mt-3`} />
          <input value={n.ctaKeduaLabelPendek} onChange={(e) => u("ctaKeduaLabelPendek", e.target.value)} aria-label="Label pendek tombol kedua, dipakai di layar sempit" placeholder="Profil" className={`${ISIAN} mt-2`} />
          <input value={n.ctaKeduaHref} onChange={(e) => u("ctaKeduaHref", e.target.value)} aria-label="Tautan tombol kedua" placeholder="/tentang-kami" className={`${ISIAN} mt-2 font-mono text-sm`} />
          <Galat peta={galat} k="ctaKeduaLabel" />
        </fieldset>
        <p className="text-xs leading-relaxed text-muted-fg sm:col-span-2">
          Isian kedua tiap tombol adalah label pendeknya, yang menggantikan
          label panjang di layar sempit. Di ponsel kedua tombol berdampingan,
          dan label panjang membuatnya terpotong.
        </p>
      </div>

      <div>
        <label htmlFor="b-manifesto" className={LABEL}>Manifesto</label>
        <textarea id="b-manifesto" rows={5} value={n.manifesto} onChange={(e) => u("manifesto", e.target.value)} className={`${ISIAN} mt-2 resize-y`} />
        <p className="mt-1 text-xs text-muted-fg">Teks panjang yang menyala kata demi kata saat digulir.</p>
        <Galat peta={galat} k="manifesto" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <PemilihSampul
          judul="Foto manifesto kiri"
          sampulId={n.fotoSatuId}
          sampulUrl={n.fotoSatuUrl}
          sampulAlt={n.fotoSatuAlt}
          onPilih={(m) =>
            setN((x) => ({
              ...x,
              fotoSatuId: m?.id ?? null,
              fotoSatuUrl: m?.url ?? null,
              fotoSatuAlt: m?.alt ?? null,
            }))
          }
        />
        <PemilihSampul
          judul="Foto manifesto kanan"
          sampulId={n.fotoDuaId}
          sampulUrl={n.fotoDuaUrl}
          sampulAlt={n.fotoDuaAlt}
          onPilih={(m) =>
            setN((x) => ({
              ...x,
              fotoDuaId: m?.id ?? null,
              fotoDuaUrl: m?.url ?? null,
              fotoDuaAlt: m?.alt ?? null,
            }))
          }
        />
      </div>

      <div className="flex justify-end">
        <Simpan jalan={jalan} sukses={sukses} onKlik={() => simpan(() => simpanBeranda(n))} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Statistik --*/

export function FormStatistik({
  awal,
  jumlahProduk,
  jumlahTim,
}: {
  awal: { jumlahKlien: number } | null;
  jumlahProduk: number;
  jumlahTim: number;
}) {
  const [jumlahKlien, setJumlahKlien] = useState(awal?.jumlahKlien ?? 0);
  const { galat, pesan, sukses, jalan, simpan } = usePenyimpan();

  return (
    <div className="flex flex-col gap-6">
      <Peringatan pesan={pesan} />

      <div>
        <label htmlFor="s-klien" className={LABEL}>Jumlah organisasi pemakai</label>
        <input
          id="s-klien"
          type="number"
          min={0}
          value={jumlahKlien}
          onChange={(e) => setJumlahKlien(Number(e.target.value))}
          className={`${ISIAN} mt-2 max-w-40`}
        />
        <p className="mt-1 text-xs leading-relaxed text-muted-fg">
          Muncul di beranda dan di halaman Tentang Kami. Disimpan sekali dan
          dipanggil di kedua tempat, supaya tidak pernah berbeda.
        </p>
        <Galat peta={galat} k="jumlahKlien" />
      </div>

      {/* Dua angka ini sengaja tidak bisa diisi. Menyimpannya berarti dua
          sumber untuk hal yang sama, dan yang satu pasti tertinggal. */}
      <div className="rounded-xl border border-line bg-surface/50 p-5">
        <h3 className={LABEL}>Dihitung sendiri</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-fg">
          Tidak bisa diisi tangan: angkanya dibaca langsung dari daftar produk
          dan anggota tim setiap kali dibutuhkan, jadi tidak pernah tertinggal
          saat isinya berubah.
        </p>
        <dl className="mt-4 flex gap-8">
          <div>
            <dt className="text-xs text-muted-fg">Produk terbit</dt>
            <dd className="mt-1 text-2xl font-semibold text-white">{jumlahProduk}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-fg">Anggota tim</dt>
            <dd className="mt-1 text-2xl font-semibold text-white">{jumlahTim}</dd>
          </div>
        </dl>
      </div>

      <div className="flex justify-end">
        <Simpan jalan={jalan} sukses={sukses} onKlik={() => simpan(() => simpanStatistik({ jumlahKlien }))} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- SEO --*/

type BarisSeo = { jalur: string; judul: string | null; deskripsi: string | null };

export function PanelSeo({ awal }: { awal: BarisSeo[] }) {
  const router = useRouter();
  const [baris, setBaris] = useState<BarisSeo[]>(awal);
  const [baru, setBaru] = useState<BarisSeo>({ jalur: "", judul: "", deskripsi: "" });
  const { galat, pesan, jalan, simpan, setPesan } = usePenyimpan();

  return (
    <div className="flex flex-col gap-6">
      <Peringatan pesan={pesan} />

      <p className="text-sm leading-relaxed text-muted-fg">
        Judul dan deskripsi untuk mesin telusur, per halaman. Yang dikosongkan
        memakai teks bawaan dari halamannya sendiri.
      </p>

      {baris.map((b, i) => (
        <div key={b.jalur} className="rounded-xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <code className="text-sm text-white">{b.jalur}</code>
            <button
              type="button"
              onClick={() =>
                simpan(async () => {
                  const h = await hapusSeo(b.jalur);
                  if (h.ok) setBaris((x) => x.filter((y) => y.jalur !== b.jalur));
                  return h;
                })
              }
              aria-label={`Hapus SEO ${b.jalur}`}
              className="grid size-9 place-items-center rounded-lg text-muted-fg transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          <input
            value={b.judul ?? ""}
            onChange={(e) =>
              setBaris((x) => x.map((y, j) => (j === i ? { ...y, judul: e.target.value } : y)))
            }
            aria-label={`Judul SEO ${b.jalur}`}
            placeholder="Judul (maks 70 karakter)"
            className={`${ISIAN} mt-3`}
          />
          <textarea
            rows={2}
            value={b.deskripsi ?? ""}
            onChange={(e) =>
              setBaris((x) => x.map((y, j) => (j === i ? { ...y, deskripsi: e.target.value } : y)))
            }
            aria-label={`Deskripsi SEO ${b.jalur}`}
            placeholder="Deskripsi (maks 200 karakter)"
            className={`${ISIAN} mt-2 resize-y`}
          />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              disabled={jalan}
              onClick={() => simpan(() => simpanSeo(b))}
              className="h-9 rounded-lg border border-line-strong px-3.5 text-sm text-muted-fg transition-colors hover:text-white disabled:opacity-50"
            >
              Simpan
            </button>
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-dashed border-line-strong p-5">
        <h3 className={LABEL}>Tambah halaman</h3>
        <input
          value={baru.jalur}
          onChange={(e) => setBaru((b) => ({ ...b, jalur: e.target.value }))}
          placeholder="/layanan"
          aria-label="Jalur halaman"
          className={`${ISIAN} mt-3 font-mono text-sm`}
        />
        <Galat peta={galat} k="jalur" />
        <input
          value={baru.judul ?? ""}
          onChange={(e) => setBaru((b) => ({ ...b, judul: e.target.value }))}
          placeholder="Judul"
          aria-label="Judul SEO halaman baru"
          className={`${ISIAN} mt-2`}
        />
        <textarea
          rows={2}
          value={baru.deskripsi ?? ""}
          onChange={(e) => setBaru((b) => ({ ...b, deskripsi: e.target.value }))}
          placeholder="Deskripsi"
          aria-label="Deskripsi SEO halaman baru"
          className={`${ISIAN} mt-2 resize-y`}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            disabled={jalan}
            onClick={() =>
              simpan(async () => {
                const h = await simpanSeo(baru);
                if (h.ok) {
                  setBaru({ jalur: "", judul: "", deskripsi: "" });
                  setPesan(null);
                  router.refresh();
                }
                return h;
              })
            }
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-3.5 text-sm font-semibold text-background transition-colors hover:bg-brand-bright disabled:opacity-60"
          >
            <Plus className="size-3.5" />
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}
