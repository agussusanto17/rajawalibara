import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";
import { PanelKategori } from "@/components/cms/panel-kategori";

export const dynamic = "force-dynamic";

export default async function HalamanKategori() {
  const kategori = await db().kategoriArtikel.findMany({
    where: HIDUP,
    orderBy: [{ urutan: "asc" }, { nama: "asc" }],
    select: {
      id: true,
      nama: true,
      slug: true,
      urutan: true,
      // Yang dihitung hanya artikel yang belum dihapus: angka ini dipakai
      // editor untuk memutuskan apakah kategori aman dihapus.
      _count: { select: { artikel: { where: HIDUP } } },
    },
  });

  return (
    <PanelKategori
      awal={kategori.map((k) => ({
        id: k.id,
        nama: k.nama,
        slug: k.slug,
        urutan: k.urutan,
        jumlahArtikel: k._count.artikel,
      }))}
    />
  );
}
