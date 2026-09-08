"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BAHASA, jalurPadanan, type Bahasa } from "@/lib/bahasa";
import { teks } from "@/lib/teks";
import { cn } from "@/lib/utils";

/**
 * Pengalih ID/EN.
 *
 * Dua tautan, bukan satu tombol yang membalik. Tombol pembalik menyembunyikan
 * bahasa yang sedang aktif, sehingga pembaca yang tersesat ke bahasa yang
 * salah tidak tahu mana yang sedang dibacanya. Dengan dua label berdampingan,
 * keadaan sekarang selalu terlihat.
 *
 * Tujuannya jalur yang setara, bukan beranda: `jalurPadanan` memetakan
 * /layanan ke /en/services. Pengalih yang selalu melempar ke beranda memaksa
 * pembaca mencari ulang halaman yang tadi dibacanya — dan kebanyakan tidak
 * mencari, mereka pergi.
 *
 * Ditandai `prefetch={false}`: kedua bahasa memuat pohon halaman yang penuh,
 * dan mengambil muka seluruh halaman terjemahan untuk setiap pengunjung yang
 * tidak pernah menekannya adalah lalu lintas yang dibayar tanpa dipakai.
 */
export function PengalihBahasa({
  bahasa,
  className,
}: {
  bahasa: Bahasa;
  className?: string;
}) {
  const jalur = usePathname();
  const t = teks(bahasa);

  return (
    <div
      role="group"
      aria-label={t.header.pilihBahasa}
      className={cn(
        "flex shrink-0 items-center rounded-full border border-line-strong p-0.5",
        className,
      )}
    >
      {BAHASA.map((kode) => {
        const aktif = kode === bahasa;
        return (
          <Link
            key={kode}
            href={jalurPadanan(jalur, kode)}
            hrefLang={kode}
            prefetch={false}
            aria-current={aktif ? "true" : undefined}
            /* Ukuran sentuh 24px terpenuhi lewat tinggi baris dan padding,
               bukan lewat kotak kosong di sekelilingnya: WCAG 2.5.8 mengukur
               target yang benar-benar bisa ditekan. */
            className={cn(
              "min-h-6 rounded-full px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-colors",
              aktif
                ? "bg-white/[0.09] text-white"
                : "text-muted-fg hover:text-white",
            )}
          >
            {kode}
            {aktif && <span className="sr-only"> — {t.header.bahasaAktif}</span>}
          </Link>
        );
      })}
    </div>
  );
}
