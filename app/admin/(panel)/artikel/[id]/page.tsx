import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";
import { blokArtikel } from "@/lib/cms/skema";
import { FormArtikel, type NilaiArtikel } from "@/components/cms/form-artikel";

export const dynamic = "force-dynamic";

const KOSONG: NilaiArtikel = {
  judul: "",
  slug: "",
  ringkas: "",
  kategoriId: "",
  isi: [{ jenis: "paragraf", teks: "" }],
  status: "DRAF",
  unggulan: false,
  terbitPada: null,
  sampulId: null,
  sampulUrl: null,
  sampulAlt: null,
  seoJudul: null,
  seoDeskripsi: null,
};

export default async function SuntingArtikel({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const kategori = await db().kategoriArtikel.findMany({
    where: HIDUP,
    orderBy: [{ urutan: "asc" }, { nama: "asc" }],
    select: { id: true, nama: true },
  });

  if (id === "baru") {
    return <FormArtikel id={null} awal={KOSONG} kategori={kategori} />;
  }

  const a = await db().artikel.findFirst({
    where: { id, ...HIDUP },
    include: { sampul: { select: { url: true, alt: true } } },
  });
  if (!a) notFound();

  // Kolomnya bertipe Json, jadi isinya bisa apa saja — termasuk hasil tulisan
  // versi lama atau suntingan langsung ke basis data. Diperiksa di sini supaya
  // editor tidak menampilkan blok rusak dan menyimpannya kembali.
  const isi = blokArtikel.array().safeParse(a.isi);

  return (
    <FormArtikel
      id={a.id}
      awal={{
        judul: a.judul,
        slug: a.slug,
        ringkas: a.ringkas,
        kategoriId: a.kategoriId,
        isi: isi.success && isi.data.length > 0 ? isi.data : KOSONG.isi,
        status: a.status,
        unggulan: a.unggulan,
        terbitPada: a.terbitPada ? a.terbitPada.toISOString().slice(0, 10) : null,
        sampulId: a.sampulId,
        sampulUrl: a.sampul?.url ?? null,
        sampulAlt: a.sampul?.alt ?? null,
        seoJudul: a.seoJudul,
        seoDeskripsi: a.seoDeskripsi,
      }}
      kategori={kategori}
      isiRusak={!isi.success}
    />
  );
}
