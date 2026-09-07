"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/cms/sesi";
import {
  berandaMasuk,
  perusahaanMasuk,
  seoMasuk,
  statistikMasuk,
} from "@/lib/cms/skema";
import type { HasilAksi } from "@/lib/cms/aksi-artikel";
import type { z } from "zod";

/** `id` dikunci ke "tunggal" supaya tidak pernah ada dua baris yang bertentangan. */
const TUNGGAL = "tunggal";

function galatDari(e: z.ZodError) {
  const galat: Record<string, string> = {};
  for (const m of e.issues) galat[m.path.join(".") || "form"] ??= m.message;
  return galat;
}

/**
 * Menyimpan data tunggal.
 *
 * Memakai upsert, bukan update: baris tunggal ini belum tentu pernah dibuat,
 * dan pengaturan yang menolak disimpan hanya karena barisnya belum ada adalah
 * kegagalan yang tidak masuk akal bagi yang mengisinya.
 */
export async function simpanPerusahaan(mentah: unknown): Promise<HasilAksi> {
  await wajibMasuk();
  const h = perusahaanMasuk.safeParse(mentah);
  if (!h.success) {
    return { ok: false, pesan: "Ada isian yang belum benar.", galat: galatDari(h.error) };
  }
  try {
    await db().perusahaan.upsert({
      where: { id: TUNGGAL },
      update: h.data,
      create: { id: TUNGGAL, ...h.data },
    });
    revalidatePath("/", "layout");
    return { ok: true, id: TUNGGAL };
  } catch (e) {
    console.error("[cms] gagal menyimpan data perusahaan:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
  }
}

export async function simpanBeranda(mentah: unknown): Promise<HasilAksi> {
  await wajibMasuk();
  const h = berandaMasuk.safeParse(mentah);
  if (!h.success) {
    return { ok: false, pesan: "Ada isian yang belum benar.", galat: galatDari(h.error) };
  }
  try {
    await db().beranda.upsert({
      where: { id: TUNGGAL },
      update: h.data,
      create: { id: TUNGGAL, ...h.data },
    });
    revalidatePath("/");
    return { ok: true, id: TUNGGAL };
  } catch (e) {
    console.error("[cms] gagal menyimpan copy beranda:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
  }
}

export async function simpanStatistik(mentah: unknown): Promise<HasilAksi> {
  await wajibMasuk();
  const h = statistikMasuk.safeParse(mentah);
  if (!h.success) {
    return { ok: false, pesan: "Ada isian yang belum benar.", galat: galatDari(h.error) };
  }
  try {
    await db().statistik.upsert({
      where: { id: TUNGGAL },
      update: h.data,
      create: { id: TUNGGAL, ...h.data },
    });
    revalidatePath("/", "layout");
    return { ok: true, id: TUNGGAL };
  } catch (e) {
    console.error("[cms] gagal menyimpan statistik:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
  }
}

export async function simpanSeo(mentah: unknown): Promise<HasilAksi> {
  await wajibMasuk();
  const h = seoMasuk.safeParse(mentah);
  if (!h.success) {
    return { ok: false, pesan: "Ada isian yang belum benar.", galat: galatDari(h.error) };
  }
  const { jalur, judul, deskripsi } = h.data;
  try {
    await db().seoHalaman.upsert({
      where: { jalur },
      update: { judul, deskripsi },
      create: { jalur, judul, deskripsi },
    });
    revalidatePath(jalur);
    return { ok: true, id: jalur };
  } catch (e) {
    console.error("[cms] gagal menyimpan SEO halaman:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
  }
}

export async function hapusSeo(jalur: string): Promise<HasilAksi> {
  await wajibMasuk();
  try {
    await db().seoHalaman.delete({ where: { jalur } });
    revalidatePath(jalur);
    return { ok: true, id: jalur };
  } catch (e) {
    console.error("[cms] gagal menghapus SEO halaman:", e);
    return { ok: false, pesan: "Gagal menghapus. Coba lagi." };
  }
}
