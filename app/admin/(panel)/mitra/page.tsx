import Link from "next/link";
import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";
import { sektorMitra } from "@/lib/site";
import { PanelDaftar } from "@/components/cms/panel-daftar";
import {
  hapusMitra,
  hapusTestimoni,
  simpanMitra,
  simpanTestimoni,
} from "@/lib/cms/aksi-halaman";

export const dynamic = "force-dynamic";

const BAGIAN = [
  { nilai: "mitra", label: "Klien & mitra" },
  { nilai: "testimoni", label: "Testimoni" },
] as const;

type Bagian = (typeof BAGIAN)[number]["nilai"];

export default async function HalamanMitra({
  searchParams,
}: {
  searchParams: Promise<{ bagian?: string }>;
}) {
  const sp = await searchParams;
  const aktif: Bagian = BAGIAN.some((b) => b.nilai === sp.bagian)
    ? (sp.bagian as Bagian)
    : "mitra";

  const p = db();
  const urut = { orderBy: { urutan: "asc" as const }, where: HIDUP };
  const [mitra, testimoni] = await Promise.all([
    p.mitra.findMany({ ...urut, include: { logo: { select: { url: true, alt: true } } } }),
    p.testimoni.findMany({ ...urut, include: { foto: { select: { url: true, alt: true } } } }),
  ]);

  // Panel memakai pasangan <nama>Id/<nama>Url/<nama>Alt untuk bidang media.
  const mitraSiap = mitra.map((m) => ({
    ...m,
    logoUrl: m.logo?.url ?? null,
    logoAlt: m.logo?.alt ?? null,
  }));
  const testimoniSiap = testimoni.map((t) => ({
    ...t,
    fotoUrl: t.foto?.url ?? null,
    fotoAlt: t.foto?.alt ?? null,
  }));

  return (
    <>
      <h1 className="text-2xl font-semibold text-white">Klien & testimoni</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-fg">
        Nama klien sudah ditanam dari company profile, logonya belum.
        Testimoni saat ini berisi kutipan dummy yang tampil seolah asli —
        lihat peringatan di tab Testimoni.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {BAGIAN.map((b) => (
          <Link
            key={b.nilai}
            href={`/admin/mitra?bagian=${b.nilai}`}
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
        {aktif === "mitra" && (
          <PanelDaftar
            judul="Klien & mitra"
            keterangan="Tampil sebagai deretan logo di beranda dan tentang kami. Menempelkan logo tanpa izin adalah klaim kemitraan, dan yang membacanya justru pihak yang bisa mengeceknya."
            labelBaru="Mitra baru"
            bidang={[
              { k: "nama", label: "Nama organisasi", jenis: "teks" },
              {
                k: "sektor",
                label: "Sektor",
                jenis: "pilihan",
                opsi: sektorMitra,
                petunjuk: "Dipakai juga sebagai label di kartu beranda.",
              },
              { k: "logo", label: "Logo", jenis: "media" },
            ]}
            awal={mitraSiap}
            simpan={simpanMitra}
            hapus={hapusMitra}
            kunciJudul="nama"
            kunciIsi="sektor"
            kosong="Belum ada mitra. Bagiannya menampilkan slot bertanda."
          />
        )}

        {aktif === "testimoni" && (
          <PanelDaftar
            judul="Testimoni"
            keterangan="PERHATIAN: lima kutipan yang ada sekarang DUMMY — nama orang dan nama perusahaannya karangan, dan di situs tampil seperti testimoni biasa tanpa penanda apa pun. Ganti dengan kutipan yang benar-benar diberikan beserta izinnya, atau kosongkan daftar ini supaya bagiannya hilang dari beranda."
            labelBaru="Testimoni baru"
            bidang={[
              { k: "kutipan", label: "Kutipan", jenis: "panjang", baris: 4 },
              { k: "nama", label: "Nama", jenis: "teks" },
              { k: "peran", label: "Peran", jenis: "teks" },
              { k: "organisasi", label: "Organisasi", jenis: "teks" },
              { k: "foto", label: "Foto", jenis: "media" },
              {
                k: "contoh",
                label: "Ini kutipan contoh, bukan testimoni sungguhan",
                jenis: "saklar",
                petunjuk:
                  "Kartu bertanda ini tampil bergaris putus-putus. Matikan setelah kutipan, nama, dan organisasinya diganti dengan yang asli.",
              },
            ]}
            awal={testimoniSiap}
            simpan={simpanTestimoni}
            hapus={hapusTestimoni}
            kunciJudul="nama"
            kunciIsi="kutipan"
            kosong="Belum ada testimoni. Bagiannya menampilkan slot bertanda."
          />
        )}
      </div>
    </>
  );
}
