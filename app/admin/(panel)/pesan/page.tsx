import type { Prisma } from "@/lib/generated/prisma";
import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";
import { PanelPesan } from "@/components/cms/panel-pesan";

export const dynamic = "force-dynamic";

const PER_HALAMAN = 20;

export default async function HalamanPesan({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saring?: string; hal?: string; arsip?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const lihatArsip = sp.arsip === "1";

  const saring = (["semua", "baru", "diproses", "selesai"] as const).includes(
    sp.saring as never,
  )
    ? (sp.saring as "semua" | "baru" | "diproses" | "selesai")
    : "semua";

  const dasar: Prisma.PesanMasukWhereInput = lihatArsip
    ? { NOT: HIDUP }
    : HIDUP;

  const cariSaja: Prisma.PesanMasukWhereInput = q
    ? {
        ...dasar,
        OR: [
          { nama: { contains: q } },
          { email: { contains: q } },
          { organisasi: { contains: q } },
          { pesan: { contains: q } },
          { produk: { contains: q } },
        ],
      }
    : dasar;

  const where: Prisma.PesanMasukWhereInput = {
    ...cariSaja,
    ...(saring === "baru"
      ? { status: "BARU" as const }
      : saring === "diproses"
        ? { status: "DIPROSES" as const }
        : saring === "selesai"
          ? { status: "SELESAI" as const }
          : {}),
  };

  const [total, nSemua, nBaru, nProses, nSelesai, nArsip] = await Promise.all([
    db().pesanMasuk.count({ where }),
    db().pesanMasuk.count({ where: cariSaja }),
    db().pesanMasuk.count({ where: { ...cariSaja, status: "BARU" } }),
    db().pesanMasuk.count({ where: { ...cariSaja, status: "DIPROSES" } }),
    db().pesanMasuk.count({ where: { ...cariSaja, status: "SELESAI" } }),
    db().pesanMasuk.count({ where: { NOT: HIDUP } }),
  ]);

  const totalHalaman = Math.max(1, Math.ceil(total / PER_HALAMAN));
  const hal = Math.min(
    Math.max(1, Number.parseInt(sp.hal ?? "1", 10) || 1),
    totalHalaman,
  );

  const pesan = await db().pesanMasuk.findMany({
    where,
    orderBy: { dibuatPada: "desc" },
    skip: (hal - 1) * PER_HALAMAN,
    take: PER_HALAMAN,
  });

  return (
    <PanelPesan
      pesan={pesan.map((p) => ({
        id: p.id,
        nama: p.nama,
        email: p.email,
        telepon: p.telepon,
        organisasi: p.organisasi,
        isi: p.pesan,
        produk: p.produk,
        halaman: p.halaman,
        kampanye: p.kampanye,
        status: p.status,
        catatan: p.catatan,
        dibuatPada: p.dibuatPada.toISOString(),
        diarsipkan: p.dihapusPada !== null,
      }))}
      hitungan={{
        semua: nSemua,
        baru: nBaru,
        diproses: nProses,
        selesai: nSelesai,
        arsip: nArsip,
      }}
      saring={saring}
      cari={q}
      lihatArsip={lihatArsip}
      halaman={hal}
      totalHalaman={totalHalaman}
    />
  );
}
