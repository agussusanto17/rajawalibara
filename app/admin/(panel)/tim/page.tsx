import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";
import { PanelTim } from "@/components/cms/panel-tim";

export const dynamic = "force-dynamic";

export default async function HalamanTim() {
  const anggota = await db().anggotaTim.findMany({
    where: HIDUP,
    orderBy: [{ kelompok: "asc" }, { urutan: "asc" }, { nama: "asc" }],
    select: {
      id: true,
      nama: true,
      jabatan: true,
      jabatanEn: true,
      kelompok: true,
      bio: true,
      bioEn: true,
      urutan: true,
      fotoId: true,
      foto: { select: { url: true, alt: true } },
    },
  });

  return (
    <PanelTim
      awal={anggota.map((a) => ({
        id: a.id,
        nama: a.nama,
        jabatan: a.jabatan,
        kelompok: a.kelompok,
        bio: a.bio,
        jabatanEn: a.jabatanEn,
        bioEn: a.bioEn,
        urutan: a.urutan,
        fotoId: a.fotoId,
        fotoUrl: a.foto?.url ?? null,
        fotoAlt: a.foto?.alt ?? null,
      }))}
    />
  );
}
