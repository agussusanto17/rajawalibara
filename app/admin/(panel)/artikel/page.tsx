import Image from "next/image";
import Link from "next/link";
import { ImageOff, Plus, Search, Star } from "lucide-react";
import type { Prisma } from "@/lib/generated/prisma";
import { db } from "@/lib/db";
import { HIDUP } from "@/lib/cms/saring";
import { formatTanggal } from "@/lib/tanggal";

export const dynamic = "force-dynamic";

const PER_HALAMAN = 12;

export default async function DaftarArtikel({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; hal?: string; saring?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  // Nilai saringan dijepit ke daftar yang dikenal. ?saring=apa-saja tidak
  // boleh sampai ke kueri.
  const saring = (["semua", "terbit", "draf", "unggulan"] as const).includes(
    sp.saring as never,
  )
    ? (sp.saring as "semua" | "terbit" | "draf" | "unggulan")
    : "semua";

  const kondisiSaring: Prisma.ArtikelWhereInput =
    saring === "terbit"
      ? { status: "TERBIT" }
      : saring === "draf"
        ? { status: "DRAF" }
        : saring === "unggulan"
          ? { unggulan: true }
          : {};

  // Dicari di judul, ringkasan, slug, dan nama kategori sekaligus. Editor
  // mengingat artikel lewat potongan judul, bukan lewat kolom mana potongan
  // itu kebetulan berada.
  const where: Prisma.ArtikelWhereInput = {
    ...HIDUP,
    ...kondisiSaring,
    ...(q
      ? {
          OR: [
            { judul: { contains: q } },
            { ringkas: { contains: q } },
            { slug: { contains: q } },
            { kategori: { nama: { contains: q } } },
          ],
        }
      : {}),
  };

  // Angka pada tiap chip dihitung dengan saringan pencarian yang sama, supaya
  // "Draf 1" berarti satu draf DI ANTARA hasil pencarian, bukan satu draf di
  // seluruh basis data.
  const cariSaja: Prisma.ArtikelWhereInput = q
    ? { ...HIDUP, OR: where.OR }
    : HIDUP;
  const [nSemua, nTerbit, nDraf, nUnggulan] = await Promise.all([
    db().artikel.count({ where: cariSaja }),
    db().artikel.count({ where: { ...cariSaja, status: "TERBIT" } }),
    db().artikel.count({ where: { ...cariSaja, status: "DRAF" } }),
    db().artikel.count({ where: { ...cariSaja, unggulan: true } }),
  ]);

  const CHIP = [
    { nilai: "semua", label: "Semua", jumlah: nSemua },
    { nilai: "terbit", label: "Terbit", jumlah: nTerbit },
    { nilai: "draf", label: "Draf", jumlah: nDraf },
    { nilai: "unggulan", label: "Unggulan", jumlah: nUnggulan },
  ] as const;

  const total = await db().artikel.count({ where });
  const totalHalaman = Math.max(1, Math.ceil(total / PER_HALAMAN));
  // Dijepit, bukan dipercaya: ?hal=999 atau ?hal=abc tidak boleh menghasilkan
  // kisi kosong atau kueri dengan skip negatif.
  const hal = Math.min(
    Math.max(1, Number.parseInt(sp.hal ?? "1", 10) || 1),
    totalHalaman,
  );

  const artikel = await db().artikel.findMany({
    where,
    orderBy: [{ unggulan: "desc" }, { terbitPada: "desc" }, { dibuatPada: "desc" }],
    skip: (hal - 1) * PER_HALAMAN,
    take: PER_HALAMAN,
    select: {
      id: true,
      judul: true,
      slug: true,
      status: true,
      unggulan: true,
      terbitPada: true,
      kategori: { select: { nama: true } },
      sampul: { select: { url: true } },
    },
  });

  const tautan = (p: Record<string, string>) =>
    `/admin/artikel?${new URLSearchParams({
      ...(q ? { q } : {}),
      ...(saring !== "semua" ? { saring } : {}),
      ...p,
    })}`;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Artikel</h1>
          <p className="mt-2 text-sm text-muted-fg">
            {q
              ? `${total} hasil untuk “${q}”.`
              : `${total} artikel tersimpan.`}
          </p>
          {/* Halaman publiknya dibuang selagi belum ada satu pun tulisan.
              Tanpa catatan ini, tulisan pertama akan diterbitkan lalu dicari
              di situs dan tidak ketemu. */}
          <p className="mt-3 max-w-xl rounded-lg border border-line bg-surface/60 px-4 py-3 text-xs leading-relaxed text-muted-fg">
            Halaman publik artikel sedang <strong className="text-white">tidak aktif</strong>.
            Tulisan tetap bisa disiapkan di sini, tetapi belum tampil di situs
            sampai rutenya dihidupkan kembali — sebutkan ke pengelola sistem
            begitu tulisan pertama siap.
          </p>
        </div>

        <Link
          href="/admin/artikel/baru"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-background transition-colors hover:bg-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Plus className="size-4" />
          Artikel baru
        </Link>
      </div>

      {/* Formulir GET biasa: pencarian tetap bekerja tanpa JavaScript, dan
          hasilnya punya URL sendiri yang bisa disalin atau di-bookmark. */}
      <form method="get" role="search" className="mt-6 flex max-w-md gap-2">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-fg"
          />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Cari judul, ringkasan, atau kategori…"
            aria-label="Cari artikel"
            className="w-full rounded-lg border border-line-strong bg-surface py-2.5 pl-10 pr-3.5 text-[0.95rem] text-white outline-none transition-colors placeholder:text-muted-fg/50 focus-visible:border-brand"
          />
        </div>
        {/* Saringan ikut terbawa saat mencari, jadi memilih "Draf" lalu
            mengetik kata kunci tidak diam-diam kembali ke "Semua". */}
        {saring !== "semua" && (
          <input type="hidden" name="saring" value={saring} />
        )}
        <button
          type="submit"
          className="rounded-lg border border-line-strong px-4 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
        >
          Cari
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {CHIP.map((c) => {
          const aktif = c.nilai === saring;
          return (
            <Link
              key={c.nilai}
              href={tautan({ saring: c.nilai })}
              aria-current={aktif ? "page" : undefined}
              className={[
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                aktif
                  ? "bg-brand text-background"
                  : "border border-line-strong text-muted-fg hover:text-white",
              ].join(" ")}
            >
              {c.label}
              <span
                className={[
                  "rounded-full px-1.5 text-xs tabular-nums",
                  aktif ? "bg-background/20" : "bg-white/[0.07]",
                ].join(" ")}
              >
                {c.jumlah}
              </span>
            </Link>
          );
        })}
      </div>

      {artikel.length === 0 ? (
        <p className="mt-8 rounded-xl border border-line bg-surface p-6 text-sm leading-relaxed text-muted-fg">
          {q
            ? `Tidak ada artikel yang cocok dengan “${q}”.`
            : "Belum ada artikel di basis data."}
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artikel.map((a) => (
            <Link
              key={a.id}
              href={`/admin/artikel/${a.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <div className="relative aspect-[16/10] bg-white/[0.03]">
                {a.sampul?.url ? (
                  <Image
                    src={a.sampul.url}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-muted-fg/40">
                    <ImageOff className="size-6" />
                  </span>
                )}

                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-[0.7rem] font-medium backdrop-blur",
                      a.status === "TERBIT"
                        ? "bg-brand/90 text-background"
                        : "bg-background/80 text-muted-fg",
                    ].join(" ")}
                  >
                    {a.status === "TERBIT" ? "Terbit" : "Draf"}
                  </span>

                  {a.unggulan && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/90 px-2.5 py-1 text-[0.7rem] font-medium text-background backdrop-blur">
                      <Star className="size-3 fill-current" />
                      Unggulan
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs text-muted-fg">{a.kategori.nama}</p>
                <h2 className="mt-1.5 line-clamp-3 text-[0.95rem] font-medium leading-snug text-white">
                  {a.judul}
                </h2>
                <p className="mt-auto pt-4 text-xs text-muted-fg">
                  {a.terbitPada ? formatTanggal(a.terbitPada.toISOString()) : "Belum terbit"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalHalaman > 1 && (
        <nav
          aria-label="Halaman artikel"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={tautan({ hal: String(n) })}
              aria-current={n === hal ? "page" : undefined}
              className={[
                "grid size-10 place-items-center rounded-lg text-sm font-medium transition-colors",
                n === hal
                  ? "bg-brand text-background"
                  : "border border-line-strong text-muted-fg hover:text-white",
              ].join(" ")}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
