import Image from "next/image";
import Link from "next/link";
import { ImageOff, Plus } from "lucide-react";
import type { Prisma } from "@/lib/generated/prisma";
import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";

export const dynamic = "force-dynamic";

export default async function DaftarProduk({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saring?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  const saring = (["semua", "terbit", "draf"] as const).includes(
    sp.saring as never,
  )
    ? (sp.saring as "semua" | "terbit" | "draf")
    : "semua";

  const cariSaja: Prisma.ProdukWhereInput = q
    ? {
        ...HIDUP,
        OR: [
          { nama: { contains: q } },
          { namaPanjang: { contains: q } },
          { ringkas: { contains: q } },
          { slug: { contains: q } },
        ],
      }
    : HIDUP;

  const where: Prisma.ProdukWhereInput = {
    ...cariSaja,
    ...(saring === "terbit"
      ? { status: "TERBIT" as const }
      : saring === "draf"
        ? { status: "DRAF" as const }
        : {}),
  };

  const [produk, nSemua, nTerbit, nDraf] = await Promise.all([
    db().produk.findMany({
      where,
      orderBy: [{ urutan: "asc" }, { nama: "asc" }],
      select: {
        id: true,
        slug: true,
        nama: true,
        namaPanjang: true,
        urutan: true,
        status: true,
        unggulan: true,
        sampul: { select: { url: true } },
      },
    }),
    db().produk.count({ where: cariSaja }),
    db().produk.count({ where: { ...cariSaja, status: "TERBIT" } }),
    db().produk.count({ where: { ...cariSaja, status: "DRAF" } }),
  ]);

  const CHIP = [
    { nilai: "semua", label: "Semua", jumlah: nSemua },
    { nilai: "terbit", label: "Terbit", jumlah: nTerbit },
    { nilai: "draf", label: "Draf", jumlah: nDraf },
  ] as const;

  const tautan = (p: Record<string, string>) =>
    `/admin/produk?${new URLSearchParams({ ...(q ? { q } : {}), ...p })}`;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Komoditas</h1>
          <p className="mt-2 text-sm text-muted-fg">
            {q ? `${nSemua} hasil untuk “${q}”.` : `${nSemua} komoditas tersimpan.`}
          </p>
          {/* Sebagian kolom formulir tidak punya tempat tayang saat ini.
              Editor yang mengisinya lalu tidak menemukannya di situs akan
              mengira ada yang rusak — jadi dikatakan di sini, bukan dibiarkan
              ditemukan sendiri. */}
          <p className="mt-3 max-w-xl rounded-lg border border-line bg-surface/60 px-4 py-3 text-xs leading-relaxed text-muted-fg">
            Yang tampil di situs saat ini hanya <strong className="text-white">nama</strong>,{" "}
            <strong className="text-white">spesifikasi</strong>, dan{" "}
            <strong className="text-white">peruntukan</strong> — sebagai tabel
            perbandingan di halaman Layanan. Deskripsi, keunggulan, asal
            tambang, galeri, dan langkah tetap tersimpan untuk halaman detail
            per tingkatan yang belum dihidupkan.
          </p>
        </div>

        <Link
          href="/admin/produk/baru"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright"
        >
          <Plus className="size-4" />
          Produk baru
        </Link>
      </div>

      <form method="get" role="search" className="mt-6 flex max-w-md gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cari nama atau slug produk…"
          aria-label="Cari produk"
          className="w-full rounded-lg border border-line-strong bg-surface px-3.5 py-2.5 text-[0.95rem] text-white outline-none placeholder:text-muted-fg/50 focus-visible:border-brand"
        />
        <button
          type="submit"
          className="rounded-lg border border-line-strong px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
        >
          Cari
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {CHIP.map((c) => (
          <Link
            key={c.nilai}
            href={tautan({ saring: c.nilai })}
            aria-current={c.nilai === saring ? "page" : undefined}
            className={[
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              c.nilai === saring
                ? "bg-brand text-background"
                : "border border-line-strong text-muted-fg hover:text-white",
            ].join(" ")}
          >
            {c.label}
            <span
              className={[
                "rounded-full px-1.5 text-xs tabular-nums",
                c.nilai === saring ? "bg-background/20" : "bg-white/[0.07]",
              ].join(" ")}
            >
              {c.jumlah}
            </span>
          </Link>
        ))}
      </div>

      {produk.length === 0 ? (
        <p className="mt-8 rounded-xl border border-line bg-surface p-6 text-sm text-muted-fg">
          {q ? `Tidak ada produk yang cocok dengan “${q}”.` : "Belum ada produk."}
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produk.map((p) => (
            <Link
              key={p.id}
              href={`/admin/produk/${p.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-line-strong hover:bg-surface-2"
            >
              <div className="relative aspect-[16/10] bg-white/[0.03]">
                {p.sampul?.url ? (
                  <Image
                    src={p.sampul.url}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-muted-fg/40">
                    <ImageOff className="size-6" />
                  </span>
                )}
                <span
                  className={[
                    "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.7rem] font-medium backdrop-blur",
                    p.status === "TERBIT"
                      ? "bg-brand/90 text-background"
                      : "bg-background/80 text-muted-fg",
                  ].join(" ")}
                >
                  {p.status === "TERBIT" ? "Terbit" : "Draf"}
                </span>

                {/* Ditaruh berdampingan dengan status, bukan menggantikannya:
                    keduanya berdiri sendiri, dan produk unggulan yang masih
                    draf tetap tidak tampil di mana pun. */}
                {p.unggulan && (
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-medium text-background backdrop-blur">
                    Unggulan
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs text-muted-fg">#{p.urutan}</p>
                <h2 className="mt-1 text-[0.95rem] font-medium text-white">
                  {p.nama}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-fg">
                  {p.namaPanjang}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
