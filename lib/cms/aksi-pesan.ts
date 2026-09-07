"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/cms/sesi";
import type { HasilAksi } from "@/lib/cms/aksi-artikel";

const STATUS = ["BARU", "DIPROSES", "SELESAI"] as const;
type Status = (typeof STATUS)[number];

export async function ubahStatusPesan(
  id: string,
  status: string,
): Promise<HasilAksi> {
  await wajibMasuk();

  if (!(STATUS as readonly string[]).includes(status)) {
    return { ok: false, pesan: "Status tidak dikenal." };
  }

  try {
    await db().pesanMasuk.update({
      where: { id },
      data: { status: status as Status },
    });
    revalidatePath("/admin/pesan");
    revalidatePath("/admin");
    return { ok: true, id };
  } catch (e) {
    console.error("[cms] gagal mengubah status pesan:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
  }
}

export async function simpanCatatanPesan(
  id: string,
  catatan: string,
): Promise<HasilAksi> {
  await wajibMasuk();

  try {
    await db().pesanMasuk.update({
      where: { id },
      data: { catatan: catatan.trim() || null },
    });
    revalidatePath("/admin/pesan");
    return { ok: true, id };
  } catch (e) {
    console.error("[cms] gagal menyimpan catatan:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
  }
}

/** Menyembunyikan pesan dari kotak masuk. Barisnya tetap ada. */
export async function arsipkanPesan(id: string): Promise<HasilAksi> {
  await wajibMasuk();
  try {
    await db().pesanMasuk.update({
      where: { id },
      data: { dihapusPada: new Date() },
    });
    revalidatePath("/admin/pesan");
    revalidatePath("/admin");
    return { ok: true, id };
  } catch (e) {
    console.error("[cms] gagal mengarsipkan pesan:", e);
    return { ok: false, pesan: "Gagal mengarsipkan. Coba lagi." };
  }
}

/**
 * Menghapus pesan SELAMANYA dari basis data.
 *
 * Berbeda dari konten lain, penghapusan di sini benar-benar membuang barisnya.
 * Alasannya bukan kerapian: isinya nama, surel, dan nomor telepon orang
 * sungguhan. Kalau pengirimnya meminta datanya dihapus, menandai baris sebagai
 * "terhapus" sambil tetap menyimpan datanya bukan penghapusan — datanya masih
 * ada di basis data dan ikut ke setiap cadangan.
 */
export async function hapusPermanenPesan(id: string): Promise<HasilAksi> {
  await wajibMasuk();
  try {
    await db().pesanMasuk.delete({ where: { id } });
    revalidatePath("/admin/pesan");
    revalidatePath("/admin");
    return { ok: true, id };
  } catch (e) {
    console.error("[cms] gagal menghapus pesan:", e);
    return { ok: false, pesan: "Gagal menghapus. Coba lagi." };
  }
}
