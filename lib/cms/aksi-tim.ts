"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/cms/sesi";
import { anggotaMasuk } from "@/lib/cms/skema";
import type { HasilAksi } from "@/lib/cms/aksi-artikel";

export async function simpanAnggota(
  id: string | null,
  mentah: unknown,
): Promise<HasilAksi> {
  await wajibMasuk();

  const hasil = anggotaMasuk.safeParse(mentah);
  if (!hasil.success) {
    const galat: Record<string, string> = {};
    for (const m of hasil.error.issues) galat[m.path.join(".") || "form"] ??= m.message;
    return { ok: false, pesan: "Ada isian yang belum benar.", galat };
  }

  const d = hasil.data;

  try {
    const a = id
      ? await db().anggotaTim.update({ where: { id }, data: d })
      : await db().anggotaTim.create({ data: d });

    revalidatePath("/admin/tim");
    revalidatePath("/tentang-kami");
    return { ok: true, id: a.id };
  } catch (e) {
    console.error("[cms] gagal menyimpan anggota:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
  }
}

export async function hapusAnggota(id: string): Promise<HasilAksi> {
  await wajibMasuk();
  try {
    await db().anggotaTim.update({
      where: { id },
      data: { dihapusPada: new Date() },
    });
    revalidatePath("/admin/tim");
    revalidatePath("/tentang-kami");
    return { ok: true, id };
  } catch (e) {
    console.error("[cms] gagal menghapus anggota:", e);
    return { ok: false, pesan: "Gagal menghapus. Coba lagi." };
  }
}
