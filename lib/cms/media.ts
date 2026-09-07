import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Penyimpanan berkas di folder pada disk, bukan object storage.
 *
 * Hostinger memasang aplikasi lewat koneksi GitHub, dan tiap deploy menyetel
 * ulang isi direktori kerja. Berkas yang diunggah pengguna dan kebetulan
 * berada di dalamnya akan hilang pada deploy berikutnya — tanpa galat, tanpa
 * peringatan, dan baru ketahuan saat gambar di situs berubah jadi kotak
 * kosong. Karena itu foldernya WAJIB di luar direktori repo, dan berkas ini
 * menolak jalankan apa pun bila ternyata di dalam.
 *
 * Berkasnya tidak berada di `public/`, jadi tidak disajikan Next secara
 * otomatis. Yang menyajikannya adalah app/media/[...jalur]/route.ts.
 */

/** Akar direktori aplikasi. Dipakai hanya untuk memastikan folder unggahan
 *  BUKAN turunannya. */
const akarAplikasi = () => process.cwd();

function diDalam(induk: string, anak: string) {
  const rel = path.relative(induk, anak);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

/**
 * Folder unggahan, sudah diperiksa.
 *
 * Dipanggil saat dipakai, bukan saat modul diimpor: `next build` mengimpor
 * setiap route untuk mengumpulkan datanya, dan variabel lingkungan Hostinger
 * belum tentu ada di tahap itu. Gagal keras di titik pemakaian masih benar —
 * unggahan yang tampak berhasil padahal tidak menyimpan apa pun persis
 * masalah yang penjaga ini cegah.
 */
export function folderMedia() {
  const dir = process.env.MEDIA_DIR;
  if (!dir) {
    throw new Error(
      "Penyimpanan berkas belum dikonfigurasi. Isi MEDIA_DIR dengan jalur absolut folder unggahan, di luar direktori aplikasi.",
    );
  }

  const abs = path.resolve(dir);
  if (diDalam(akarAplikasi(), abs)) {
    throw new Error(
      `MEDIA_DIR (${abs}) berada di dalam direktori aplikasi. Deploy berbasis Git menyetel ulang direktori itu, jadi seluruh unggahan akan hilang pada deploy berikutnya. Pindahkan ke jalur di luarnya.`,
    );
  }

  return abs;
}

/**
 * Alamat yang dipakai di tag img.
 *
 * Jalur relatif, bukan absolut berdomain: situs ini dilayani dari satu origin,
 * dan menyimpan domainnya di dalam URL membuat seluruh gambar patah begitu
 * domainnya berganti — termasuk saat pindah dari staging ke produksi.
 */
export const urlPublik = (kunci: string) => `/media/${kunci}`;

/**
 * Menyusun kunci berkas: folder per bulan, nama yang sudah dibersihkan, plus
 * akhiran acak. Akhiran itu mencegah dua berkas bernama sama saling menimpa —
 * "foto.jpg" adalah nama yang sangat lazim.
 *
 * Folder per bulan juga menjaga jumlah entri per direktori tetap wajar; ribuan
 * berkas dalam satu folder membuat operasi berkas di shared hosting melambat.
 */
export function kunciBaru(namaAsli: string) {
  const t = new Date();
  const bulan = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;

  const titik = namaAsli.lastIndexOf(".");
  const ekstensi = titik > 0 ? namaAsli.slice(titik + 1).toLowerCase() : "bin";
  const dasar = (titik > 0 ? namaAsli.slice(0, titik) : namaAsli)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "berkas";

  const acak = Math.random().toString(36).slice(2, 8);
  return `${bulan}/${dasar}-${acak}.${ekstensi.replace(/[^a-z0-9]/g, "")}`;
}

/**
 * Sisi terpanjang gambar setelah diperkecil.
 *
 * Dipilih untuk sampul artikel yang tampil selebar layar pada layar rapat:
 * slot 1200px pada kerapatan ganda meminta 2400px. Menyimpan lebih besar dari
 * ini tidak menambah ketajaman yang terlihat, hanya menambah unduhan.
 */
const MAKS_SISI = 2400;

function gantiEkstensi(nama: string, ekstensi: string) {
  const titik = nama.lastIndexOf(".");
  return `${titik > 0 ? nama.slice(0, titik) : nama}.${ekstensi}`;
}

/**
 * Memperkecil dan mengubah gambar raster menjadi WebP sebelum disimpan.
 *
 * SVG dilewatkan apa adanya. Ia vektor: ukurannya sudah kecil, tajam di
 * berapa pun ukuran, dan mengubahnya ke WebP justru membesarkannya sekaligus
 * membuatnya pecah saat diperbesar. Logo instansi kerap dikirim sebagai SVG.
 *
 * Sebagian gambar disajikan lewat <img> biasa, bukan next/image — logo klien
 * dan ikon — sehingga apa pun yang tersimpan itulah yang benar-benar diunduh
 * pengunjung. Di jalur itu pengecilan ini satu-satunya yang bekerja.
 *
 * Hasilnya dipakai hanya bila benar-benar lebih kecil. AVIF dan PNG mungil
 * yang sudah padat bisa membengkak setelah diubah, dan aturan "selalu WebP"
 * akan membuat berkasnya lebih berat tanpa ada yang menyadarinya.
 *
 * Berkas aslinya tidak disimpan. Yang dibutuhkan situs hanya versi tayang.
 */
export async function siapkanGambar(berkas: {
  nama: string;
  tipe: string;
  data: Buffer;
}): Promise<{ nama: string; tipe: string; data: Buffer }> {
  if (berkas.tipe === "image/svg+xml") return berkas;

  try {
    // WebP yang sudah muat dalam batas dibiarkan. Mengodekan ulang gambar
    // lossy selalu menurunkan kualitasnya, dan di sini imbalannya hanya
    // beberapa persen — kerugian yang menumpuk tanpa terlihat di layar.
    if (berkas.tipe === "image/webp") {
      const m = await sharp(berkas.data).metadata();
      const muat = (m.width ?? 0) <= MAKS_SISI && (m.height ?? 0) <= MAKS_SISI;
      if (muat) return berkas;
    }

    const olahan = await sharp(berkas.data)
      // Tanpa argumen: memutar mengikuti penanda orientasi EXIF lalu
      // membuangnya. Foto dari ponsel kerap tersimpan miring, dan penandanya
      // hilang begitu gambarnya diolah ulang.
      .rotate()
      .resize({
        width: MAKS_SISI,
        height: MAKS_SISI,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer();

    if (olahan.byteLength >= berkas.data.byteLength) return berkas;

    return {
      nama: gantiEkstensi(berkas.nama, "webp"),
      tipe: "image/webp",
      data: olahan,
    };
  } catch {
    // Berkas yang tidak bisa dibaca sharp tetap disimpan apa adanya. Unggahan
    // yang gagal seluruhnya karena pengecilan lebih merugikan daripada satu
    // gambar yang lolos tanpa dikecilkan.
    return berkas;
  }
}

/** Menyimpan satu berkas dan mengembalikan kuncinya beserta alamat publiknya. */
export async function unggah(
  berkas: { nama: string; tipe: string; data: Buffer },
) {
  const kunci = kunciBaru(berkas.nama);
  const tujuan = path.join(folderMedia(), kunci);

  // Folder bulan dibuat saat berkas pertama bulan itu masuk. recursive:true
  // juga membuat folder unggahannya sendiri bila belum ada, sehingga tidak
  // perlu langkah persiapan manual saat pindah server.
  await mkdir(path.dirname(tujuan), { recursive: true });
  await writeFile(tujuan, berkas.data);

  return { kunci, url: urlPublik(kunci) };
}

/**
 * Menghapus berkas dari folder. Dipakai hanya untuk berkas yang kita simpan.
 *
 * Berkas yang sudah tidak ada dianggap selesai, bukan galat: yang dituju
 * adalah keadaan akhir "berkas itu tidak ada lagi", dan keadaan itu sudah
 * tercapai.
 */
export async function hapusObjek(kunci: string) {
  try {
    await unlink(path.join(folderMedia(), kunci));
  } catch (e) {
    if ((e as NodeJS.ErrnoException)?.code !== "ENOENT") throw e;
  }
}
