import { Fragment } from "react";

/**
 * Merender penanda [[...]] sebagai sorotan warna brand.
 *
 * Judul hero perlu satu bagian berwarna di tengahnya, dan bagian itu harus
 * bisa dipindah lewat CMS. Menyimpan HTML di basis data akan membuka seluruh
 * tipografi judul display ke isian teks bebas, sementara yang dibutuhkan
 * hanya satu penanda. Penanda yang tidak berpasangan dibiarkan apa adanya:
 * teksnya tetap terbaca, hanya tanpa sorotan.
 */
export function Sorotan({ teks }: { teks: string }) {
  const bagian = teks.split(/(\[\[[^\]]*\]\])/g);
  return (
    <>
      {bagian.map((b, i) =>
        b.startsWith("[[") && b.endsWith("]]") ? (
          <span key={i} className="text-brand">
            {b.slice(2, -2)}
          </span>
        ) : (
          <Fragment key={i}>{b}</Fragment>
        ),
      )}
    </>
  );
}
