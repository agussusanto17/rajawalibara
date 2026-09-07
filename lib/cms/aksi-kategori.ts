"use server";

import type { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/cms/sesi";
import { kategoriMasuk } from "@/lib/cms/skema";
import { HIDUP } from "@/lib/cms/saring";
import type { HasilAksi } from "@/lib/cms/aksi-artikel";

function kumpulkanGalat(e: z.ZodError) {
  const galat: Record<string, string> = {};
  for (const m of e.issues) galat[m.path.join(".") || "form"] ??= m.message;
  return galat;
}

export async function simpanKategori(
  id: string | null,
  mentah: unknown,
): Promise<HasilAksi> {
  await wajibMasuk();

  const hasil = kategoriMasuk.safeParse(mentah);
  if (!hasil.success) {
    return {
      ok: false,
      pesan: "Ada isian yang belum benar.",
      galat: kumpulkanGalat(hasil.error),
    };
  }

  try {
    const k = id
      ? await db().kategoriArtikel.update({ where: { id }, data: hasil.data })
      : await db().kategoriArtikel.create({ data: hasil.data });

    revalidatePath("/admin/kategori");
    revalidatePath("/admin/artikel");
    revalidatePath("/artikel");
    return { ok: true, id: k.id };
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      const kolom = (e.meta?.target as string[] | undefined)?.[0] ?? "nama";
      return {
        ok: false,
        pesan: `Kategori dengan ${kolom} itu sudah ada.`,
        galat: { [kolom]: "Sudah dipakai kategori lain." },
      };
    }
    console.error("[cms] gagal menyimpan kategori:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
  }
}

/**
 * Menghapus kategori, tetapi HANYA bila tidak ada artikel yang memakainya.
 *
 * Penghapusannya lunak, jadi barisnya tetap ada dan kunci asingnya tidak
 * pernah putus. Justru itu masalahnya: artikel yang memakainya akan menunjuk
 * kategori yang tidak muncul di daftar mana pun, dan editor tidak punya cara
 * menemukan kenapa. Lebih baik ditolak dengan menyebut berapa artikel yang
 * masih memakainya.
 */
export async function hapusKategori(id: string): Promise<HasilAksi> {
  await wajibMasuk();

  const dipakai = await db().artikel.count({
    where: { kategoriId: id, ...HIDUP },
  });

  if (dipakai > 0) {
    return {
      ok: false,
      pesan:
        `Masih dipakai ${dipakai} artikel. Pindahkan artikel itu ke kategori ` +
        `lain lebih dulu, baru kategori ini bisa dihapus.`,
    };
  }

  try {
    await db().kategoriArtikel.update({
      where: { id },
      data: { dihapusPada: new Date() },
    });
    revalidatePath("/admin/kategori");
    revalidatePath("/admin/artikel");
    return { ok: true, id };
  } catch (e) {
    console.error("[cms] gagal menghapus kategori:", e);
    return { ok: false, pesan: "Gagal menghapus. Coba lagi." };
  }
}
