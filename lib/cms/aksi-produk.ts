"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/cms/sesi";
import { produkMasuk } from "@/lib/cms/skema";
import { HIDUP } from "@/lib/cms/saring";
import { namaIkon } from "@/components/site/icon-map";
import type { HasilAksi } from "@/lib/cms/aksi-artikel";

/**
 * Memeriksa nama ikon terhadap peta yang sebenarnya.
 *
 * Dilakukan di server, bukan di skema bersama: peta ikon mengimpor seluruh
 * komponen Lucide yang dipakai, dan menariknya ke skema berarti ikut terbundel
 * ke peramban tanpa satu pun dipakai di sana.
 */
function ikonSah(nama: string) {
  return (namaIkon as readonly string[]).includes(nama);
}

export async function simpanProduk(
  id: string | null,
  mentah: unknown,
): Promise<HasilAksi> {
  await wajibMasuk();

  const hasil = produkMasuk.safeParse(mentah);
  if (!hasil.success) {
    const galat: Record<string, string> = {};
    for (const m of hasil.error.issues) galat[m.path.join(".") || "form"] ??= m.message;
    return { ok: false, pesan: "Ada isian yang belum benar.", galat };
  }

  const d = hasil.data;

  // Ikon yang tidak ada di peta tidak menampilkan apa pun di halaman publik,
  // dan tidak memunculkan galat apa pun. Ditolak di sini, bukan dibiarkan.
  const galatIkon: Record<string, string> = {};
  if (!ikonSah(d.ikon)) galatIkon.ikon = "Ikon itu tidak ada di daftar.";
  d.keunggulan.forEach((m, i) => {
    if (!ikonSah(m.icon)) galatIkon[`keunggulan.${i}.icon`] = "Ikon tidak dikenal.";
  });
  if (Object.keys(galatIkon).length > 0) {
    return { ok: false, pesan: "Ada ikon yang tidak dikenal.", galat: galatIkon };
  }

  const data = {
    nama: d.nama,
    namaPanjang: d.namaPanjang,
    slug: d.slug,
    jenis: d.jenis,
    ringkas: d.ringkas,
    deskripsi: d.deskripsi,
    ikon: d.ikon,
    peruntukan: d.peruntukan,
    asal: d.asal,
    urutan: d.urutan,
    status: d.status,
    spesifikasi: d.spesifikasi,
    keunggulan: d.keunggulan,
    galeri: d.galeri,
    langkah: d.langkah,
    sampulId: d.sampulId,
    unggulan: d.unggulan,
    seoJudul: d.seoJudul,
    seoDeskripsi: d.seoDeskripsi,
  };

  const pilihan = d.mitraId.map((x) => ({ id: x }));

  try {
    const p = id
      ? // set mengganti seluruh daftar, bukan menambah: panel mengirim pilihan
        // lengkap, jadi mitra yang dilepas harus benar-benar terlepas.
        await db().produk.update({
          where: { id },
          data: { ...data, mitra: { set: pilihan } },
        })
      : await db().produk.create({
          data: { ...data, mitra: { connect: pilihan } },
        });

    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    revalidatePath(`/produk/${p.slug}`);
    revalidatePath("/");

    return { ok: true, id: p.id };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const terhapus = await db().produk.findFirst({
        where: { slug: d.slug, NOT: HIDUP },
        select: { nama: true },
      });
      return {
        ok: false,
        pesan: terhapus
          ? `Slug itu masih dipegang komoditas yang sudah dihapus (“${terhapus.nama}”).`
          : "Slug itu sudah dipakai komoditas lain.",
        galat: { slug: "Sudah dipakai." },
      };
    }
    console.error("[cms] gagal menyimpan produk:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
  }
}

export async function hapusProduk(id: string): Promise<HasilAksi> {
  await wajibMasuk();
  try {
    const p = await db().produk.update({
      where: { id },
      data: { dihapusPada: new Date() },
    });
    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    revalidatePath(`/produk/${p.slug}`);
    return { ok: true, id };
  } catch (e) {
    console.error("[cms] gagal menghapus produk:", e);
    return { ok: false, pesan: "Gagal menghapus. Coba lagi." };
  }
}
