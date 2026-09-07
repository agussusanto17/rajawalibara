import Link from "next/link";
import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";
import {
  FormBeranda,
  FormPerusahaan,
  FormStatistik,
  PanelSeo,
} from "@/components/cms/panel-pengaturan";
import { TombolBenih } from "@/components/cms/tombol-benih";
import { PanelDaftar } from "@/components/cms/panel-daftar";
import { hapusKantor, hapusSlide, simpanKantor, simpanSlide } from "@/lib/cms/aksi-halaman";

export const dynamic = "force-dynamic";

const BAGIAN = [
  { nilai: "perusahaan", label: "Perusahaan" },
  { nilai: "kantor", label: "Kantor" },
  { nilai: "beranda", label: "Beranda" },
  { nilai: "slide", label: "Slider hero" },
  { nilai: "statistik", label: "Statistik" },
  { nilai: "seo", label: "SEO halaman" },
  { nilai: "data", label: "Data bawaan" },
] as const;

type Bagian = (typeof BAGIAN)[number]["nilai"];

export default async function HalamanPengaturan({
  searchParams,
}: {
  searchParams: Promise<{ bagian?: string }>;
}) {
  const sp = await searchParams;
  const aktif: Bagian = BAGIAN.some((b) => b.nilai === sp.bagian)
    ? (sp.bagian as Bagian)
    : "perusahaan";

  const p = db();
  const [perusahaan, kantor, slide, beranda, statistik, seo, jumlahProduk, jumlahTim] =
    await Promise.all([
      p.perusahaan.findUnique({ where: { id: "tunggal" } }),
      p.kantor.findMany({ where: HIDUP, orderBy: { urutan: "asc" } }),
      p.slide.findMany({
        where: HIDUP,
        orderBy: { urutan: "asc" },
        include: { foto: { select: { url: true, alt: true } } },
      }),
      p.beranda.findUnique({
        where: { id: "tunggal" },
        include: {
          fotoSatu: { select: { url: true, alt: true } },
          fotoDua: { select: { url: true, alt: true } },
        },
      }),
      p.statistik.findUnique({ where: { id: "tunggal" } }),
      p.seoHalaman.findMany({ orderBy: { jalur: "asc" } }),
      p.produk.count({ where: { ...HIDUP, status: "TERBIT" } }),
      p.anggotaTim.count({ where: HIDUP }),
    ]);

  return (
    <>
      <h1 className="text-2xl font-semibold text-white">Pengaturan</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-fg">
        Data perusahaan, kantor, copy beranda, angka, judul halaman untuk
        mesin pencari, dan pemuatan data bawaan.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {BAGIAN.map((b) => (
          <Link
            key={b.nilai}
            href={`/admin/pengaturan?bagian=${b.nilai}`}
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
        {aktif === "perusahaan" && <FormPerusahaan awal={perusahaan} />}

        {aktif === "kantor" && (
          <PanelDaftar
            judul="Kantor"
            keterangan="Tampil di footer, halaman kontak, dan peta. Yang bertanda Pusat dipakai sebagai alamat resmi di footer dan penanda SEO — pastikan hanya satu."
            labelBaru="Kantor baru"
            bidang={[
              {
                k: "jenis",
                label: "Jenis",
                jenis: "pilihan",
                opsi: ["PUSAT", "CABANG"],
                petunjuk: "Peta di halaman kontak menampilkan kantor pusat.",
              },
              { k: "nama", label: "Nama kantor", jenis: "teks", petunjuk: "Misalnya “Kantor Cabang Samarinda”." },
              { k: "alamat", label: "Alamat lengkap", jenis: "panjang", baris: 3 },
              { k: "alamatSingkat", label: "Alamat singkat", jenis: "teks", petunjuk: "Satu baris untuk footer dan kartu kontak." },
              { k: "telepon", label: "Telepon", jenis: "teks", petunjuk: "Boleh kosong — hanya dirender kalau kantor ini memang punya nomor sendiri." },
              { k: "email", label: "Email", jenis: "teks" },
              {
                k: "mapsCid",
                label: "Google Maps CID",
                jenis: "teks",
                petunjuk:
                  "Boleh kosong. Selama kosong, peta memakai pencarian alamat — kurang presisi, tapi tidak pernah menunjuk gedung yang salah seperti CID yang ditebak.",
              },
            ]}
            awal={kantor}
            simpan={simpanKantor}
            hapus={hapusKantor}
            kunciJudul="nama"
            kunciIsi="alamatSingkat"
            kosong="Belum ada kantor. Footer dan halaman kontak memakai alamat bawaan dari lib/site.ts."
          />
        )}
        {aktif === "slide" && (
          <PanelDaftar
            judul="Slider hero"
            keterangan="Foto latar yang berganti di beranda. Judul dan tombol hero TIDAK ikut berganti — judul yang berubah tiap enam detik tidak sempat dibaca sampai habis. Copy hero disunting di bagian Beranda."
            labelBaru="Slide baru"
            bidang={[
              { k: "foto", label: "Foto", jenis: "media" },
              {
                k: "keterangan",
                label: "Keterangan",
                jenis: "teks",
                petunjuk:
                  "Tampil kecil di sudut kiri bawah. Boleh kosong. Sebut tahapnya, bukan lokasi, selama fotonya masih stok.",
              },
            ]}
            awal={slide.map((x) => ({
              ...x,
              fotoUrl: x.foto?.url ?? null,
              fotoAlt: x.foto?.alt ?? null,
            }))}
            simpan={simpanSlide}
            hapus={hapusSlide}
            kunciJudul="keterangan"
            kosong="Belum ada slide. Hero tampil tanpa foto latar."
          />
        )}

        {aktif === "beranda" && (
          <FormBeranda
            awal={
              beranda && {
                ...beranda,
                fotoSatuUrl: beranda.fotoSatu?.url ?? null,
                fotoSatuAlt: beranda.fotoSatu?.alt ?? null,
                fotoDuaUrl: beranda.fotoDua?.url ?? null,
                fotoDuaAlt: beranda.fotoDua?.alt ?? null,
              }
            }
          />
        )}
        {aktif === "statistik" && (
          <FormStatistik
            awal={statistik}
            jumlahProduk={jumlahProduk}
            jumlahTim={jumlahTim}
          />
        )}
        {aktif === "seo" && <PanelSeo awal={seo} />}

        {aktif === "data" && <TombolBenih />}
      </div>
    </>
  );
}
