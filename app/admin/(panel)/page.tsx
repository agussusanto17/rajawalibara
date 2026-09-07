import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";

export const dynamic = "force-dynamic";

export default async function Ringkasan() {
  const p = db();
  const [artikel, draf, produk, anggota, media, pesan, pesanBaru] = await Promise.all([
    p.artikel.count({ where: HIDUP }),
    p.artikel.count({ where: { ...HIDUP, status: "DRAF" } }),
    p.produk.count({ where: HIDUP }),
    p.anggotaTim.count({ where: HIDUP }),
    p.media.count({ where: HIDUP }),
    p.pesanMasuk.count({ where: HIDUP }),
    p.pesanMasuk.count({ where: { ...HIDUP, status: "BARU" } }),
  ]);

  const kartu = [
    { label: "Artikel", nilai: artikel, catatan: `${draf} draf`, href: "/admin/artikel" },
    { label: "Produk", nilai: produk, href: "/admin/produk" },
    { label: "Anggota tim", nilai: anggota, href: "/admin/tim" },
    { label: "Media", nilai: media, href: "/admin/media" },
    {
      label: "Pesan masuk",
      nilai: pesan,
      catatan: pesanBaru > 0 ? `${pesanBaru} belum ditangani` : "semua sudah ditangani",
      href: "/admin/pesan",
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold text-white">Ringkasan</h1>
      <p className="mt-2 text-sm text-muted-fg">
        Isi situs yang sedang tersimpan di basis data.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kartu.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="group rounded-xl border border-line bg-surface p-5 transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <p className="text-sm text-muted-fg">{k.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{k.nilai}</p>
            {k.catatan && (
              <p className="mt-1 text-xs text-muted-fg">{k.catatan}</p>
            )}
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
              Kelola
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

    </>
  );
}
