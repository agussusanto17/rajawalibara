import Link from "next/link";
import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";
import { namaIkon } from "@/components/site/icon-map";
import { PanelDaftar, type Bidang } from "@/components/cms/panel-daftar";
import {
  hapusAlasan,
  hapusFaq,
  hapusLangkah,
  hapusMisi,
  hapusNilai,
  hapusPerjalanan,
  hapusProyek,
  simpanAlasan,
  simpanFaq,
  simpanLangkah,
  simpanMisi,
  simpanNilai,
  simpanPerjalanan,
  simpanProyek,
} from "@/lib/cms/aksi-halaman";

export const dynamic = "force-dynamic";

const BAGIAN = [
  { nilai: "nilai", label: "Nilai" },
  { nilai: "misi", label: "Misi" },
  { nilai: "alasan", label: "Keunggulan" },
  { nilai: "langkah", label: "Alur pemesanan" },
  { nilai: "faq", label: "FAQ" },
  { nilai: "perjalanan", label: "Perjalanan" },
  { nilai: "proyek", label: "Proyek" },
] as const;

type Bagian = (typeof BAGIAN)[number]["nilai"];

const BIDANG_IKON: Bidang[] = [
  { k: "ikon", label: "Ikon", jenis: "ikon" },
  { k: "judul", label: "Judul", jenis: "teks" },
  { k: "isi", label: "Isi", jenis: "panjang", baris: 4 },
];

const BIDANG_POLOS: Bidang[] = [
  { k: "judul", label: "Judul", jenis: "teks" },
  { k: "isi", label: "Isi", jenis: "panjang", baris: 4 },
];

export default async function HalamanIsi({
  searchParams,
}: {
  searchParams: Promise<{ bagian?: string }>;
}) {
  const sp = await searchParams;
  const aktif: Bagian = BAGIAN.some((b) => b.nilai === sp.bagian)
    ? (sp.bagian as Bagian)
    : "nilai";

  const p = db();
  const urut = { orderBy: { urutan: "asc" as const } };

  const [nilai, misi, alasan, langkah, faq, perjalanan, proyek] =
    await Promise.all([
      p.blokKonten.findMany({ where: { ...HIDUP, jenis: "NILAI" }, ...urut }),
      p.blokKonten.findMany({ where: { ...HIDUP, jenis: "MISI" }, ...urut }),
      p.blokKonten.findMany({ where: { ...HIDUP, jenis: "ALASAN" }, ...urut }),
      p.blokKonten.findMany({ where: { ...HIDUP, jenis: "LANGKAH" }, ...urut }),
      p.blokKonten.findMany({ where: { ...HIDUP, jenis: "FAQ" }, ...urut }),
      p.perjalanan.findMany({ where: HIDUP, ...urut }),
      p.proyek.findMany({
        where: HIDUP,
        ...urut,
        include: { foto: { select: { url: true, alt: true } } },
      }),
    ]);

  // Panel memakai pasangan <nama>Id/<nama>Url/<nama>Alt untuk bidang media.
  const proyekSiap = proyek.map((x) => ({
    ...x,
    fotoUrl: x.foto?.url ?? null,
    fotoAlt: x.foto?.alt ?? null,
  }));

  return (
    <>
      <h1 className="text-2xl font-semibold text-white">Isi halaman</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-fg">
        Bagian bertulisan tetap di beranda, tentang kami, dan halaman komoditas.
        Perubahan di sini langsung tampil tanpa perlu deploy.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {BAGIAN.map((b) => (
          <Link
            key={b.nilai}
            href={`/admin/halaman?bagian=${b.nilai}`}
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
        {aktif === "nilai" && (
          <PanelDaftar
            judul="Nilai perusahaan"
            keterangan="Tampil di halaman tentang kami. Yang menentukan cara mengambil keputusan, bukan yang dipajang di dinding kantor."
            labelBaru="Nilai baru"
            bidang={BIDANG_IKON}
            ikon={namaIkon}
            awal={nilai}
            simpan={simpanNilai}
            hapus={hapusNilai}
            kunciJudul="judul"
            kunciIsi="isi"
            kosong="Belum ada nilai. Bagiannya tidak tampil di halaman tentang kami."
          />
        )}

        {aktif === "misi" && (
          <PanelDaftar
            judul="Misi perusahaan"
            keterangan="Daftar bernomor di halaman tentang kami, di sebelah visi. Satu butir satu kalimat utuh — tidak ada kolom keterangan, karena memecahnya jadi judul plus penjelasan berarti mengarang separuhnya."
            labelBaru="Butir misi baru"
            bidang={[{ k: "judul", label: "Butir misi", jenis: "panjang", baris: 2 }]}
            awal={misi}
            simpan={simpanMisi}
            hapus={hapusMisi}
            kunciJudul="judul"
            kosong="Belum ada butir misi. Bagiannya tidak tampil di halaman tentang kami."
          />
        )}

        {aktif === "alasan" && (
          <PanelDaftar
            judul="Keunggulan kami"
            keterangan="Dipakai di halaman tentang kami dan di setiap halaman detail komoditas. Empat pertama yang tampil di tentang kami."
            labelBaru="Keunggulan baru"
            bidang={BIDANG_IKON}
            ikon={namaIkon}
            awal={alasan}
            simpan={simpanAlasan}
            hapus={hapusAlasan}
            kunciJudul="judul"
            kunciIsi="isi"
            kosong="Belum ada alasan."
          />
        )}

        {aktif === "langkah" && (
          <PanelDaftar
            judul="Alur pemesanan"
            keterangan="Tampil di halaman komoditas yang belum punya alur khususnya sendiri. Bernomor, jadi tidak memakai ikon."
            labelBaru="Langkah baru"
            bidang={BIDANG_POLOS}
            awal={langkah}
            simpan={simpanLangkah}
            hapus={hapusLangkah}
            kunciJudul="judul"
            kunciIsi="isi"
            kosong="Belum ada langkah."
          />
        )}

        {aktif === "faq" && (
          <PanelDaftar
            judul="Pertanyaan umum"
            keterangan="Tampil di setiap halaman detail komoditas, di bawah pertanyaan khusus komoditas itu."
            labelBaru="Pertanyaan baru"
            bidang={[
              { k: "judul", label: "Pertanyaan", jenis: "teks" },
              { k: "isi", label: "Jawaban", jenis: "panjang", baris: 4 },
            ]}
            awal={faq}
            simpan={simpanFaq}
            hapus={hapusFaq}
            kunciJudul="judul"
            kunciIsi="isi"
            kosong="Belum ada pertanyaan."
          />
        )}

        {aktif === "perjalanan" && (
          <PanelDaftar
            judul="Tonggak perjalanan"
            keterangan="Garis waktu di halaman tentang kami."
            labelBaru="Tonggak baru"
            bidang={[
              { k: "tahun", label: "Tahun", jenis: "teks", lebar: "sempit", petunjuk: "Boleh ditulis sebagai rentang, misalnya 2024–2025." },
              { k: "judul", label: "Judul", jenis: "teks" },
              { k: "isi", label: "Isi", jenis: "panjang", baris: 3 },
            ]}
            awal={perjalanan}
            simpan={simpanPerjalanan}
            hapus={hapusPerjalanan}
            kunciJudul="judul"
            kunciIsi="isi"
            kosong="Belum ada tonggak."
          />
        )}

        {aktif === "proyek" && (
          <PanelDaftar
            judul="Proyek kami"
            keterangan="Galeri pekerjaan yang pernah dijalankan. Foto wajib: bagian ini berupa kisi gambar, dan entri tanpa foto meninggalkan lubang yang terbaca sebagai gambar gagal dimuat."
            labelBaru="Proyek baru"
            bidang={[
              { k: "judul", label: "Judul", jenis: "teks" },
              { k: "foto", label: "Foto", jenis: "media" },
              { k: "lokasi", label: "Lokasi", jenis: "teks", petunjuk: "Boleh kosong — tidak dirender kalau kosong." },
              { k: "tahun", label: "Tahun", jenis: "teks", lebar: "sempit" },
              { k: "ringkas", label: "Keterangan", jenis: "panjang", baris: 3 },
            ]}
            awal={proyekSiap}
            simpan={simpanProyek}
            hapus={hapusProyek}
            kunciJudul="judul"
            kunciIsi="lokasi"
            kosong="Belum ada proyek. Bagiannya menampilkan slot bertanda."
          />
        )}
      </div>
    </>
  );
}
