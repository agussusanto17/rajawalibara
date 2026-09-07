"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/cms/sesi";
import { artikelMasuk } from "@/lib/cms/skema";
import { HIDUP } from "@/lib/cms/saring";

export type HasilAksi =
  | { ok: true; id: string }
  | { ok: false; pesan: string; galat?: Record<string, string> };

/**
 * Menyimpan artikel, baru maupun suntingan.
 *
 * wajibMasuk() dipanggil DI SINI, bukan hanya di layout. Aksi server punya
 * titik masuk HTTP sendiri: siapa pun bisa memanggilnya tanpa layout panel
 * pernah dirender, jadi penjaga di layout saja tidak menjaga apa pun.
 */
export async function simpanArtikel(
  id: string | null,
  mentah: unknown,
): Promise<HasilAksi> {
  await wajibMasuk();

  const hasil = artikelMasuk.safeParse(mentah);
  if (!hasil.success) {
    const galat: Record<string, string> = {};
    for (const m of hasil.error.issues) {
      const kunci = m.path.join(".") || "form";
      galat[kunci] ??= m.message;
    }
    return { ok: false, pesan: "Ada isian yang belum benar.", galat };
  }

  const d = hasil.data;

  // Terbit tanpa tanggal akan tampil tanpa keterangan waktu di kartu dan di
  // penanda Article. Diisi saat itu juga, bukan dibiarkan kosong.
  const terbitPada =
    d.status === "TERBIT" ? (d.terbitPada ?? new Date()) : d.terbitPada;

  const data = {
    judul: d.judul,
    slug: d.slug,
    ringkas: d.ringkas,
    kategoriId: d.kategoriId,
    isi: d.isi,
    status: d.status,
    unggulan: d.unggulan,
    terbitPada,
    sampulId: d.sampulId,
    seoJudul: d.seoJudul,
    seoDeskripsi: d.seoDeskripsi,
  };

  try {
    const artikel = id
      ? await db().artikel.update({ where: { id }, data })
      : await db().artikel.create({ data });

    revalidatePath("/admin/artikel");
    revalidatePath("/artikel");
    revalidatePath(`/artikel/${artikel.slug}`);
    revalidatePath("/");

    return { ok: true, id: artikel.id };
  } catch (e) {
    // Slug ganda adalah kesalahan editor, bukan kerusakan sistem: sebut
    // kolomnya supaya bisa langsung diperbaiki.
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      // Slug tetap unik termasuk terhadap artikel yang sudah dihapus, karena
      // barisnya masih ada. Tanpa kalimat ini editor melihat "sudah dipakai"
      // sementara artikel pemilik slug itu tidak muncul di daftar mana pun.
      const terhapus = await db().artikel.findFirst({
        where: { slug: d.slug, NOT: HIDUP },
        select: { judul: true },
      });

      return {
        ok: false,
        pesan: terhapus
          ? `Slug itu masih dipegang artikel yang sudah dihapus (“${terhapus.judul}”).`
          : "Slug itu sudah dipakai artikel lain.",
        galat: {
          slug: terhapus
            ? "Dipakai artikel yang sudah dihapus. Pakai slug lain, atau pulihkan artikel itu."
            : "Sudah dipakai. Ganti dengan yang lain.",
        },
      };
    }
    console.error("[cms] gagal menyimpan artikel:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
  }
}

/**
 * Menghapus artikel secara lunak.
 *
 * Barisnya tidak dibuang, hanya ditandai waktu penghapusannya. Salah klik bisa
 * dipulihkan, dan tidak ada relasi yang tiba-tiba menunjuk baris yang lenyap.
 */
export async function hapusArtikel(id: string): Promise<HasilAksi> {
  await wajibMasuk();

  try {
    const artikel = await db().artikel.update({
      where: { id },
      data: { dihapusPada: new Date() },
    });
    revalidatePath("/admin/artikel");
    revalidatePath("/artikel");
    revalidatePath(`/artikel/${artikel.slug}`);
    return { ok: true, id };
  } catch (e) {
    console.error("[cms] gagal menghapus artikel:", e);
    return { ok: false, pesan: "Gagal menghapus. Coba lagi." };
  }
}

/** Mengembalikan artikel yang terhapus. */
export async function pulihkanArtikel(id: string): Promise<HasilAksi> {
  await wajibMasuk();

  try {
    await db().artikel.update({ where: { id }, data: { dihapusPada: null } });
    revalidatePath("/admin/artikel");
    revalidatePath("/artikel");
    return { ok: true, id };
  } catch (e) {
    console.error("[cms] gagal memulihkan artikel:", e);
    return { ok: false, pesan: "Gagal memulihkan. Coba lagi." };
  }
}
