"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/cms/sesi";
import { HIDUP } from "@/lib/cms/saring";
import { hapusObjek, siapkanGambar, unggah } from "@/lib/cms/media";

/** Hanya gambar. Daftar tertutup, bukan pemeriksaan "dimulai dengan image/". */
const TIPE_DIIZINKAN = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
] as const;

const MAKS_BYTE = 5 * 1024 * 1024;

export type HasilMedia =
  | { ok: true; id: string; url: string }
  | { ok: false; pesan: string };

/**
 * Mengunggah satu berkas dan mencatatnya di tabel media.
 *
 * Penjaga sesi dipanggil di sini, bukan hanya di layout: aksi server punya
 * titik masuk HTTP sendiri, dan tanpa ini siapa pun bisa menaruh berkas di
 * folder unggahan server.
 */
export async function unggahMedia(data: FormData): Promise<HasilMedia> {
  await wajibMasuk();

  const berkas = data.get("berkas");
  const alt = String(data.get("alt") ?? "").trim();

  if (!(berkas instanceof File) || berkas.size === 0) {
    return { ok: false, pesan: "Tidak ada berkas yang dipilih." };
  }

  // Tipe dari peramban bisa dipalsukan, tetapi ini tetap penjaga pertama yang
  // murah. Penjaga kedua ada di app/media/[...jalur]/route.ts: berkas hanya
  // disajikan apa adanya, dengan Content-Type dari ekstensi yang kita kenali
  // dan header sandbox yang melumpuhkan skrip di dalam SVG.
  if (!TIPE_DIIZINKAN.includes(berkas.type as never)) {
    return {
      ok: false,
      pesan: `Jenis berkas ${berkas.type || "tidak dikenali"} tidak diizinkan. Pakai JPEG, PNG, WebP, AVIF, atau SVG.`,
    };
  }

  if (berkas.size > MAKS_BYTE) {
    const mb = (berkas.size / 1024 / 1024).toFixed(1);
    return { ok: false, pesan: `Berkas ${mb} MB, melebihi batas 5 MB.` };
  }

  if (!alt) {
    return {
      ok: false,
      pesan:
        "Teks alternatif wajib diisi. Gambar tanpa alt tidak terbaca pembaca layar dan tidak terbaca mesin telusur.",
    };
  }

  try {
    // Dikecilkan lebih dulu, dan yang dicatat adalah hasilnya — bukan berkas
    // yang dipilih pengguna. Mencatat ukuran asli membuat panel media
    // melaporkan angka yang tidak pernah ada di disk.
    const siap = await siapkanGambar({
      nama: berkas.name,
      tipe: berkas.type,
      data: Buffer.from(await berkas.arrayBuffer()),
    });

    const hasil = await unggah(siap);

    const baris = await db().media.create({
      data: {
        kunci: hasil.kunci,
        url: hasil.url,
        alt,
        tipe: siap.tipe,
        ukuran: siap.data.byteLength,
      },
    });

    revalidatePath("/admin/media");
    return { ok: true, id: baris.id, url: baris.url };
  } catch (e) {
    console.error("[cms] gagal mengunggah media:", e);
    return {
      ok: false,
      pesan:
        e instanceof Error && e.message.includes("belum dikonfigurasi")
          ? e.message
          : "Gagal mengunggah. Coba lagi.",
    };
  }
}

/**
 * Menghapus media secara lunak, dan berkasnya dari disk bila memang milik kita.
 *
 * Ditolak bila masih dipakai: gambar yang hilang dari halaman publik tanpa
 * jejak jauh lebih sulit ditelusuri daripada tombol hapus yang menolak.
 *
 * Pemeriksaannya harus mencakup SETIAP relasi yang menunjuk ke media. Satu
 * yang terlewat berarti tombol hapus mengizinkan penghapusan yang diam-diam
 * mengosongkan gambar di halaman yang tidak diperiksa — persis kegagalan yang
 * penjaga ini ada untuk mencegahnya. Beranda tidak punya penghapusan lunak,
 * jadi ia tidak ikut disaring HIDUP.
 */
export async function hapusMedia(id: string): Promise<HasilMedia | { ok: false; pesan: string }> {
  await wajibMasuk();

  const p = db();
  const [artikel, produk, anggota, mitra, proyek, slide, testimoni, beranda] =
    await Promise.all([
      p.artikel.count({ where: { sampulId: id, ...HIDUP } }),
      p.produk.count({ where: { sampulId: id, ...HIDUP } }),
      p.anggotaTim.count({ where: { fotoId: id, ...HIDUP } }),
      p.mitra.count({ where: { logoId: id, ...HIDUP } }),
      p.proyek.count({ where: { fotoId: id, ...HIDUP } }),
      p.slide.count({ where: { fotoId: id, ...HIDUP } }),
      p.testimoni.count({ where: { fotoId: id, ...HIDUP } }),
      p.beranda.count({
        where: { OR: [{ fotoSatuId: id }, { fotoDuaId: id }] },
      }),
    ]);

  const dipakai =
    artikel + produk + anggota + mitra + proyek + slide + testimoni + beranda;
  if (dipakai > 0) {
    return {
      ok: false,
      pesan: `Masih dipakai ${dipakai} entri. Lepaskan dari entri itu lebih dulu.`,
    };
  }

  try {
    const m = await p.media.update({
      where: { id },
      data: { dihapusPada: new Date() },
    });

    // Berkas hanya dihapus bila kita yang menyimpannya. `kunci` kosong berarti
    // gambar milik pihak lain yang hanya ditautkan.
    if (m.kunci) {
      try {
        await hapusObjek(m.kunci);
      } catch (e) {
        // Baris sudah ditandai terhapus; berkas yatim di disk tidak merusak
        // apa pun dan bisa disapu terpisah. Jangan gagalkan seluruh aksinya.
        console.error("[cms] baris media terhapus tetapi berkas tertinggal:", e);
      }
    }

    revalidatePath("/admin/media");
    return { ok: true, id, url: m.url };
  } catch (e) {
    console.error("[cms] gagal menghapus media:", e);
    return { ok: false, pesan: "Gagal menghapus. Coba lagi." };
  }
}

export type PilihanMedia = {
  id: string;
  url: string;
  alt: string;
  tipe: string;
};

/**
 * Daftar media untuk pemilih sampul.
 *
 * Diambil saat pemilihnya dibuka, bukan dibawa bersama halaman: berkas yang
 * baru diunggah dari dalam pemilih harus langsung muncul, dan halaman
 * penyuntingan tidak perlu membawa seluruh pustaka gambar setiap kali dibuka.
 */
export async function daftarMedia(cari?: string): Promise<PilihanMedia[]> {
  await wajibMasuk();

  const q = (cari ?? "").trim();

  // `contains` tanpa opsi mode: konektor MySQL Prisma tidak menerimanya, dan
  // memang tidak perlu — collation utf8mb4_*_ci sudah abai huruf besar-kecil.
  return db().media.findMany({
    where: {
      ...HIDUP,
      ...(q ? { alt: { contains: q } } : {}),
    },
    orderBy: { dibuatPada: "desc" },
    take: 60,
    select: { id: true, url: true, alt: true, tipe: true },
  });
}
