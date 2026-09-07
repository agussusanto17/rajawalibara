/**
 * Memperkecil gambar di peramban sebelum dikirim ke server.
 *
 * Server sudah memperkecil lewat sharp, jadi ini bukan soal ukuran akhir.
 * Yang diperbaiki adalah perjalanannya: berkas 3 MB dari generator gambar
 * harus menyeberang utuh lewat aksi server, dan di sepanjang jalan itu ada
 * batas badan permintaan Next, batas badan proxy, dan waktu unggah yang bisa
 * puluhan detik di sambungan lambat. Dikecilkan lebih dulu, yang menyeberang
 * tinggal ratusan kilobita dan seluruh masalah itu tidak pernah muncul.
 *
 * SVG dilewatkan apa adanya: ia vektor, dan menggambarnya ke kanvas justru
 * mengubahnya menjadi raster.
 *
 * Setiap kegagalan mengembalikan berkas aslinya. Peramban lama bisa tidak
 * mendukung WebP pada kanvas, dan unggahan yang batal karena pengecilan jauh
 * lebih merugikan daripada unggahan yang berjalan tanpa dikecilkan — sharp
 * di server tetap menjadi jaring terakhirnya.
 */
const MAKS_SISI = 2400;

export async function kecilkanDiPeramban(berkas: File): Promise<File> {
  if (berkas.type === "image/svg+xml") return berkas;

  try {
    // from-image menerapkan penanda orientasi EXIF. Tanpa itu foto dari ponsel
    // digambar miring ke kanvas, dan penandanya ikut hilang saat diekspor.
    const bitmap = await createImageBitmap(berkas, { imageOrientation: "from-image" });

    const skala = Math.min(1, MAKS_SISI / Math.max(bitmap.width, bitmap.height));
    const lebar = Math.round(bitmap.width * skala);
    const tinggi = Math.round(bitmap.height * skala);

    const kanvas = document.createElement("canvas");
    kanvas.width = lebar;
    kanvas.height = tinggi;
    const ctx = kanvas.getContext("2d");
    if (!ctx) return berkas;
    ctx.drawImage(bitmap, 0, 0, lebar, tinggi);
    bitmap.close();

    const blob = await new Promise<Blob | null>((selesai) =>
      kanvas.toBlob(selesai, "image/webp", 0.82),
    );
    if (!blob || blob.size >= berkas.size) return berkas;

    const dasar = berkas.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${dasar}.webp`, { type: "image/webp" });
  } catch {
    return berkas;
  }
}
