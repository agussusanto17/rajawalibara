/**
 * Tanggal dalam bahasa Indonesia, format panjang.
 *
 * Dipindah ke lib/ dari komponen kartu artikel: kartunya ikut terhapus bersama
 * halaman publik artikel, sementara panel /admin/artikel tetap perlu menampilkan
 * tanggal terbit. Fungsi pemformat memang bukan milik satu komponen.
 */
export function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
