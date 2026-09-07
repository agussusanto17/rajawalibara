import Image from "next/image";
import { GridLines } from "@/components/site/section";
import type { Orang } from "@/lib/site";

/** Inisial dari dua kata pertama nama. */
function inisial(nama: string) {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * Kartu satu orang. Fotonya hitam putih dan berubah berwarna saat disentuh
 * kursor, bersamaan dengan munculnya nama dan peran di atas foto.
 *
 * Keterangannya TIDAK disembunyikan begitu saja: di perangkat tanpa kursor
 * tidak ada hover sama sekali, jadi namanya akan hilang selamanya. Yang
 * menyembunyikannya hanya `@media (hover: hover)`, sehingga di ponsel
 * keterangannya tampil terus.
 *
 * Selama fotonya belum ada, bidang gambar diisi inisial di atas panel bergaris,
 * dibuat terlihat sebagai pilihan bukan gambar yang gagal dimuat.
 */
export function KartuOrang({
  orang,
  hanyaFoto = false,
}: {
  orang: Orang;
  /** Untuk kartu pimpinan, yang sudah menuliskan nama dan perannya sendiri. */
  hanyaFoto?: boolean;
}) {
  return (
    <figure className="group relative h-full overflow-hidden rounded-2xl bg-ink-strong/[0.04]">
      <div className="relative aspect-[4/5]">
        {orang.photo ? (
          <Image
            src={orang.photo}
            alt={hanyaFoto ? "" : orang.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
            className="object-cover grayscale transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <GridLines className="opacity-[0.07]" />
            <span
              aria-hidden="true"
              className="relative text-4xl font-semibold tracking-[-0.04em] text-gold-ink/60"
            >
              {inisial(orang.name)}
            </span>
          </div>
        )}
      </div>

      {!hanyaFoto && (
        <figcaption
          className={[
            "pointer-events-none absolute inset-x-0 bottom-0 p-5",
            // Lapisan gelap agar teks putih tetap terbaca di atas foto apa pun.
            "bg-[linear-gradient(to_top,rgba(11,11,12,0.92)_0%,rgba(11,11,12,0.55)_55%,rgba(11,11,12,0)_100%)]",
            // Bawaannya terlihat. Hanya perangkat berkursor yang
            // menyembunyikannya, lalu memunculkannya saat disentuh.
            "transition-opacity duration-300",
            "[@media(hover:hover)]:opacity-0",
            "[@media(hover:hover)]:group-hover:opacity-100",
          ].join(" ")}
        >
          <p className="text-[1.05rem] font-semibold leading-snug text-white">
            {orang.name}
          </p>
          <p className="mt-1 text-[0.95rem] text-white/75">{orang.role}</p>
        </figcaption>
      )}
    </figure>
  );
}
