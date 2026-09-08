import Link from "next/link";
import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";
import { namaIkon } from "@/components/site/icon-map";
import { PanelDaftar } from "@/components/cms/panel-daftar";
import {
  hapusGrupLayanan,
  hapusLayanan,
  simpanGrupLayanan,
  simpanLayanan,
} from "@/lib/cms/aksi-halaman";

export const dynamic = "force-dynamic";

const BAGIAN = [
  { nilai: "grup", label: "Kelompok layanan" },
  { nilai: "bidang", label: "Bidang usaha" },
] as const;

type Bagian = (typeof BAGIAN)[number]["nilai"];

export default async function HalamanLayanan({
  searchParams,
}: {
  searchParams: Promise<{ bagian?: string }>;
}) {
  const sp = await searchParams;
  const aktif: Bagian = BAGIAN.some((b) => b.nilai === sp.bagian)
    ? (sp.bagian as Bagian)
    : "grup";

  const p = db();
  const urut = { orderBy: { urutan: "asc" as const }, where: HIDUP };
  const [grup, bidang] = await Promise.all([
    p.grupLayanan.findMany(urut),
    p.layanan.findMany(urut),
  ]);

  // Prisma mengembalikan Json sebagai JsonValue; panel butuh larik teks.
  const grupSiap = grup.map((g) => ({
    ...g,
    cakupan: Array.isArray(g.cakupan) ? (g.cakupan as string[]) : [],
  }));

  return (
    <>
      <h1 className="text-2xl font-semibold text-white">Layanan</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-fg">
        Kelompok layanan yang dibaca pengunjung, dan bidang usaha sesuai akta
        yang dirujuknya.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {BAGIAN.map((b) => (
          <Link
            key={b.nilai}
            href={`/admin/layanan?bagian=${b.nilai}`}
            aria-current={b.nilai === aktif ? "page" : undefined}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              b.nilai === aktif
                ? "bg-brand text-background"
                : "border border-line-strong text-muted-fg hover:text-white",
            ].join(" ")}
          >
            {b.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 max-w-3xl">
        {aktif === "grup" && (
          <PanelDaftar
            judul="Kelompok layanan"
            keterangan="Tampil di beranda dan halaman produk. Ini bahasa yang dibaca pengunjung, bukan teks akta."
            labelBaru="Kelompok baru"
            bidang={[
              { k: "ikon", label: "Ikon", jenis: "ikon" },
              { k: "judul", label: "Judul", jenis: "teks" },
              { k: "isi", label: "Isi", jenis: "panjang", baris: 3 },
              { k: "judulEn", label: "Judul · English", jenis: "teks" },
              { k: "isiEn", label: "Isi · English", jenis: "panjang", baris: 3 },
              {
                k: "cakupan",
                label: "Bidang usaha yang dicakup",
                jenis: "daftar",
                petunjuk: "Satu nama per baris, disalin persis dari tab Bidang usaha.",
              },
            ]}
            ikon={namaIkon}
            awal={grupSiap}
            simpan={simpanGrupLayanan}
            hapus={hapusGrupLayanan}
            kunciJudul="judul"
            kunciIsi="isi"
            kosong="Belum ada kelompok layanan. Bagiannya tidak tampil di beranda."
          />
        )}

        {aktif === "bidang" && (
          <PanelDaftar
            judul="Bidang usaha"
            keterangan="Teks resmi sesuai akta. Tidak tampil langsung ke pengunjung; kelompok layanan yang merujuknya."
            labelBaru="Bidang baru"
            bidang={[
              { k: "nama", label: "Nama bidang usaha", jenis: "teks" },
              { k: "namaEn", label: "Nama bidang usaha · English", jenis: "teks", petunjuk: "Kode KBLI-nya tetap; hanya keterangannya yang dialihbahasakan." },
            ]}
            awal={bidang}
            simpan={simpanLayanan}
            hapus={hapusLayanan}
            kunciJudul="nama"
            kosong="Belum ada bidang usaha."
          />
        )}
      </div>
    </>
  );
}
