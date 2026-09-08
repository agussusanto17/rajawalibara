/**
 * Satu logo di dalam strip mitra.
 *
 * Dipakai di beranda, tentang kami, dan halaman detail produk. Ditulis sekali
 * karena ketiganya memang harus terlihat sama: dua salinan yang terpisah
 * sudah pernah melenceng, dan yang melenceng lebih dulu adalah bagian yang
 * hanya muncul saat kursor lewat, jadi tidak ada yang menyadarinya.
 *
 * Hover dipasang pada pembungkus, bukan pada gambarnya: logo yang lebar
 * kurusnya menyisakan celah, dan kursor yang jatuh di celah itu membuat
 * tooltipnya berkedip.
 *
 * Kontainer Marquee memotong isinya, jadi tooltip ini hanya terlihat utuh bila
 * kontainernya diberi padding vertikal yang cukup — sekitar 38px di bawah
 * logo, yaitu jarak mt-3 ditambah tinggi tooltipnya. Pemanggil memakai py-11.
 */
export function LogoMitra({
  nama,
  src,
  tip,
}: {
  nama: string;
  src: string;
  /** Kelas warna tooltip, mengikuti latar tempat strip ini dipasang. */
  tip: string;
}) {
  return (
    <span className="group relative flex shrink-0 items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={nama}
        className="h-16 w-auto opacity-45 grayscale transition-[opacity,filter] duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:h-20"
      />
      <span
        className={`pointer-events-none absolute left-1/2 top-full z-10 mt-3 -translate-x-1/2 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${tip}`}
      >
        {nama}
      </span>
    </span>
  );
}

/** Warna tooltip untuk strip di atas latar gelap. */
export const TIP_GELAP = "border-line-strong bg-surface text-white shadow-lg";
/** Warna tooltip untuk strip di atas latar terang. */
export const TIP_TERANG = "border-ink-strong/15 bg-white text-ink-strong shadow-lg";
