import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";
import { PanelMedia } from "@/components/cms/panel-media";

export const dynamic = "force-dynamic";

export default async function HalamanMedia() {
  const media = await db().media.findMany({
    where: HIDUP,
    orderBy: { dibuatPada: "desc" },
    select: {
      id: true,
      url: true,
      alt: true,
      tipe: true,
      ukuran: true,
      kunci: true,
      dibuatPada: true,
      _count: {
        select: {
          artikel: { where: HIDUP },
          produkCover: { where: HIDUP },
          anggota: { where: HIDUP },
          mitra: { where: HIDUP },
        },
      },
    },
  });

  const siap = Boolean(
    process.env.S3_ENDPOINT &&
      process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY &&
      process.env.S3_SECRET_KEY,
  );

  return (
    <PanelMedia
      penyimpananSiap={siap}
      awal={media.map((m) => ({
        id: m.id,
        url: m.url,
        alt: m.alt,
        tipe: m.tipe,
        ukuran: m.ukuran,
        milikKita: m.kunci !== null,
        dipakai:
          m._count.artikel +
          m._count.produkCover +
          m._count.anggota +
          m._count.mitra,
      }))}
    />
  );
}
