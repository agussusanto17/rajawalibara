"use server";

import { revalidatePath } from "next/cache";
import { wajibMasuk } from "@/lib/cms/sesi";
import { tanamBenih, type LaporanBenih } from "@/lib/cms/benih";

export type HasilBenih =
  | { ok: true; laporan: LaporanBenih }
  | { ok: false; pesan: string };

/**
 * Mengisi basis data kosong dari data bawaan yang ikut terbundel.
 *
 * Wajib masuk. Ini menulis ke seluruh tabel konten, jadi bukan sesuatu yang
 * boleh dipanggil siapa pun yang menemukan alamatnya.
 */
export async function tanamBenihSekarang(): Promise<HasilBenih> {
  await wajibMasuk();

  try {
    const laporan = await tanamBenih();

    // Jalurnya disebut satu per satu, BUKAN revalidatePath("/", "layout").
    // Cakupan "layout" pada "/" menyegarkan seluruh rute di bawahnya termasuk
    // /admin — dasbor ikut dirender ulang, syarat "basis data kosong" jadi
    // salah, komponennya lepas dari DOM, dan laporannya hilang sebelum sempat
    // dibaca. Termasuk peringatan tentang naskah contoh dan potret stok.
    for (const jalur of ["/", "/produk", "/artikel", "/tentang-kami", "/hubungi-kami"]) {
      revalidatePath(jalur);
    }
    return { ok: true, laporan };
  } catch (e) {
    console.error("[cms] gagal menanam benih:", e);
    return {
      ok: false,
      pesan:
        e instanceof Error
          ? `Gagal: ${e.message}`
          : "Gagal mengisi data awal. Periksa log server.",
    };
  }
}
