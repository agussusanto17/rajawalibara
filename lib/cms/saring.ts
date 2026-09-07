/**
 * Penyaring baris yang belum dihapus.
 *
 * Penghapusan di CMS ini lunak: barisnya tetap ada, hanya ditandai waktunya.
 * Artinya SETIAP kueri baca harus menyaringnya sendiri — Prisma tidak
 * melakukannya otomatis. Satu kueri yang lupa akan menampilkan kembali isi
 * yang sudah dihapus editor, dan itu terlihat seperti data yang hidup lagi.
 */
export const HIDUP = { dihapusPada: null } as const;
