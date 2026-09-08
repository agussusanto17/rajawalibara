import { KerangkaSitus } from "@/components/site/kerangka";

/**
 * Cabang bahasa Indonesia, tinggal di akar URL.
 *
 * Route group `(id)` tidak muncul di alamat: halaman di dalamnya tetap berada
 * di /, /layanan, /tentang-kami, dan /hubungi-kami persis seperti sebelum
 * dwibahasa. Tautan yang sudah tersebar sejak deploy pertama tidak patah.
 */
export default function LayoutIndonesia({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KerangkaSitus bahasa="id">{children}</KerangkaSitus>;
}
