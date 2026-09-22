import { Fragment } from "react";

/**
 * Merender penanda [[...]] sebagai sorotan warna brand.
 *
 * Judul hero perlu satu bagian berwarna di tengahnya, dan bagian itu harus
 * bisa dipindah lewat CMS. Menyimpan HTML di basis data akan membuka seluruh
 * tipografi judul display ke isian teks bebas, sementara yang dibutuhkan
 * hanya satu penanda. Penanda yang tidak berpasangan dibiarkan apa adanya:
 * teksnya tetap terbaca, hanya tanpa sorotan.
 *
 * Sorotan yang menutup judul selalu dimulai di baris baru. Tanpa itu,
 * pemenggalan baris ditentukan lebar layar, dan warna bisa berganti di
 * tengah baris: "RAJAWALI / BARA YUDHA / PERKASA" di ponsel, dengan putih
 * dan emas bercampur di baris kedua. Dengan aturan ini pergantian warna
 * selalu jatuh di pergantian baris, jadi warnanya membentuk dua tingkat,
 * bukan tambalan.
 *
 * Sorotan di tengah kalimat tetap sebaris: memaksanya turun memotong
 * kalimat di tempat yang tidak dipilih siapa pun.
 */
export function Sorotan({ teks }: { teks: string }) {
  const bagian = teks.split(/(\[\[[^\]]*\]\])/g).filter((b) => b !== "");
  const terakhir = bagian.length - 1;
  return (
    <>
      {bagian.map((b, i) =>
        b.startsWith("[[") && b.endsWith("]]") ? (
          <span
            key={i}
            className={i === terakhir ? "block text-brand" : "text-brand"}
          >
            {b.slice(2, -2)}
          </span>
        ) : (
          <Fragment key={i}>{b}</Fragment>
        ),
      )}
    </>
  );
}
