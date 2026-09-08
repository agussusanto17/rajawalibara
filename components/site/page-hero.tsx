import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { GridLines } from "@/components/site/section";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { tautan, type Bahasa } from "@/lib/bahasa";
import { teks } from "@/lib/teks";

export type FaktaHero = {
  label: string;
  nilai: string;
  catatan?: string;
  href?: string;
};

/**
 * Hero halaman dalam.
 *
 * Rata kiri dengan kolom fakta di sebelah kanan, bukan blok terpusat.
 * Alasannya sama dengan pita legalitas di beranda: yang membuka halaman ini
 * sedang mencari keterangan, dan judul terpusat di tengah layar kosong
 * menunda keterangan itu satu layar penuh ke bawah. Di sini ia sudah ada di
 * sebelah judulnya.
 *
 * `fakta` boleh kosong — kolomnya tinggal tidak dirender dan judulnya memakai
 * lebar penuh. Isinya harus datum yang benar-benar ada; kolom berisi "—" di
 * sebelah judul halaman terbaca sebagai data yang gagal dimuat.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  bahasa,
  breadcrumb,
  fakta = [],
  aksi,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  bahasa: Bahasa;
  breadcrumb?: { label: string; href?: string }[];
  fakta?: FaktaHero[];
  aksi?: React.ReactNode;
}) {
  const t = teks(bahasa);
  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Penanda remah roti ditempel di sini, bukan di tiap halaman: datanya
          sudah ada di komponen ini, dan halaman yang harus mengingat untuk
          memasangnya sendiri pasti ada yang terlewat. */}
      {breadcrumb && breadcrumb.length > 0 && (
        <JsonLd
          data={breadcrumbSchema([
            { name: t.umum.beranda, path: tautan(bahasa, "/") },
            ...breadcrumb.map((c) => ({ name: c.label, path: c.href ?? "" })),
          ])}
        />
      )}

      <GridLines className="opacity-25" />
      {/* Cahaya jatuh dari kiri atas, searah dengan judulnya. Bukan lingkaran
          terpusat: hero ini tidak simetris, dan glow di tengah menariknya
          kembali ke susunan yang justru sedang ditinggalkan. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-56 size-[38rem] rounded-full bg-brand/[0.10] blur-[120px]"
      />

      <div className="shell relative grid gap-12 pb-16 pt-32 sm:pb-20 sm:pt-40 lg:grid-cols-[1.35fr_auto] lg:gap-20">
        <div>
          {breadcrumb && breadcrumb.length > 0 && (
            <nav aria-label={t.umum.remahRoti} className="mb-8">
              <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-fg">
                <li>
                  {/* Padding negatif menambah tinggi sentuh dari 15px ke 31px
                      tanpa merenggangkan barisnya. */}
                  <Link
                    href={tautan(bahasa, "/")}
                    className="-my-2 inline-block py-2 transition-colors hover:text-brand"
                  >
                    {t.umum.beranda}
                  </Link>
                </li>
                {breadcrumb.map((c) => (
                  <li key={c.label} className="flex items-center gap-1.5">
                    <ChevronRight className="size-3 opacity-50" aria-hidden="true" />
                    {c.href ? (
                      <Link
                        href={tautan(bahasa, c.href)}
                        className="-my-2 inline-block py-2 transition-colors hover:text-brand"
                      >
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-white">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {eyebrow && <p className="eyebrow">{eyebrow}</p>}

          <h1 className="mt-6 max-w-[16ch] text-[2.5rem] uppercase text-white sm:text-[3.5rem] lg:text-[4.25rem]">
            {title}
          </h1>

          {description && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-fg">
              {description}
            </p>
          )}

          {aksi && (
            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              {aksi}
            </div>
          )}
        </div>

        {fakta.length > 0 && (
          <dl className="flex flex-col divide-y divide-line self-end border-y border-line lg:min-w-[16rem]">
            {fakta.map((f) => (
              <div key={f.label} className="flex flex-col gap-1.5 py-5">
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-fg">
                  {f.label}
                </dt>
                <dd className="angka text-[0.95rem] font-medium leading-snug text-white">
                  {f.href ? (
                    <a
                      href={f.href}
                      className="-my-2.5 inline-block py-2.5 text-brand underline-offset-4 hover:underline"
                    >
                      {f.nilai}
                    </a>
                  ) : (
                    f.nilai
                  )}
                  {f.catatan && (
                    <span className="mt-1 block font-sans text-xs font-normal normal-case tracking-normal text-muted-fg">
                      {f.catatan}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
