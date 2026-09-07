import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";
import { namaIkon } from "@/components/site/icon-map";
import { FormProduk, type NilaiProduk } from "@/components/cms/form-produk";

export const dynamic = "force-dynamic";

/**
 * Nilai awal untuk entri baru.
 *
 * `spesifikasi` sudah berisi satu baris kosong, bukan larik kosong: tabel
 * spesifikasi wajib minimal satu baris, dan formulir yang membuka dengan
 * tabel kosong membuat aturan itu baru terasa saat tombol simpan ditekan.
 */
const KOSONG: NilaiProduk = {
  nama: "",
  namaPanjang: "",
  slug: "",
  jenis: "BATUBARA",
  ringkas: "",
  deskripsi: "",
  ikon: "",
  peruntukan: "",
  asal: "",
  urutan: 0,
  status: "DRAF",
  unggulan: false,
  spesifikasi: [{ parameter: "", nilai: "", satuan: "" }],
  keunggulan: [{ icon: "", title: "", body: "" }],
  galeri: [],
  mitraId: [],
  langkah: [],
  sampulId: null,
  sampulUrl: null,
  sampulAlt: null,
  seoJudul: null,
  seoDeskripsi: null,
};

/** Bentuk Json dibaca longgar: kolomnya bisa berisi apa saja, dan formulir
 *  harus tetap terbuka meski salah satu grupnya rusak. */
const larik = <T,>(v: unknown, bawaan: T[]): T[] =>
  Array.isArray(v) && v.length > 0 ? (v as T[]) : bawaan;

export default async function SuntingProduk({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ikon = [...namaIkon];

  // Daftar mitra dimuat untuk kedua cabang: formulir entri baru pun perlu
  // menawarkan pilihannya.
  const mitra = await db().mitra.findMany({
    where: HIDUP,
    orderBy: { urutan: "asc" },
    select: { id: true, nama: true, sektor: true },
  });

  if (id === "baru") {
    return <FormProduk id={null} awal={KOSONG} ikon={ikon} mitra={mitra} />;
  }

  const p = await db().produk.findFirst({
    where: { id, ...HIDUP },
    include: {
      sampul: { select: { url: true, alt: true } },
      mitra: { where: HIDUP, select: { id: true } },
    },
  });
  if (!p) notFound();

  return (
    <FormProduk
      id={p.id}
      ikon={ikon}
      mitra={mitra}
      awal={{
        nama: p.nama,
        namaPanjang: p.namaPanjang,
        slug: p.slug,
        jenis: p.jenis,
        ringkas: p.ringkas,
        deskripsi: p.deskripsi,
        ikon: p.ikon,
        peruntukan: p.peruntukan,
        asal: p.asal,
        urutan: p.urutan,
        status: p.status,
        unggulan: p.unggulan,
        spesifikasi: larik(p.spesifikasi, KOSONG.spesifikasi),
        keunggulan: larik(p.keunggulan, KOSONG.keunggulan),
        galeri: larik(p.galeri, []),
        mitraId: p.mitra.map((m) => m.id),
        langkah: larik(p.langkah, []),
        sampulId: p.sampulId,
        sampulUrl: p.sampul?.url ?? null,
        sampulAlt: p.sampul?.alt ?? null,
        seoJudul: p.seoJudul,
        seoDeskripsi: p.seoDeskripsi,
      }}
    />
  );
}
