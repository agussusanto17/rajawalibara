"use server";

import type { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/cms/sesi";
import {
  blokMasuk,
  grupLayananMasuk,
  kantorMasuk,
  layananMasuk,
  misiMasuk,
  mitraMasuk,
  perjalananMasuk,
  proyekMasuk,
  slideMasuk,
  testimoniMasuk,
} from "@/lib/cms/skema";
import type { HasilAksi } from "@/lib/cms/aksi-artikel";

function kumpulkanGalat(e: z.ZodError) {
  const galat: Record<string, string> = {};
  for (const m of e.issues) galat[m.path.join(".") || "form"] ??= m.message;
  return galat;
}

/**
 * Jalur publik yang ikut disegarkan setiap isi halaman berubah.
 *
 * Sengaja semua sekaligus: nilai tampil di tentang kami, alasan tampil di
 * tentang kami DAN di setiap halaman produk, FAQ dan langkah tampil di setiap
 * halaman produk, layanan tampil di beranda dan halaman produk. Melacak
 * pasangan jenis-ke-halaman satu per satu hanya menyiapkan bug di mana satu
 * bagian tertinggal basi tanpa ada yang menyadarinya.
 */
const JALUR = ["/", "/tentang-kami", "/produk", "/hubungi-kami"] as const;

function segarkan(jalurAdmin: string) {
  revalidatePath(jalurAdmin);
  for (const j of JALUR) revalidatePath(j);
  // Halaman detail produk memakai FAQ, langkah, dan alasan yang sama.
  revalidatePath("/produk/[slug]", "page");
}

/** Bentuk aksi yang seragam untuk seluruh daftar isi halaman. */
function buatAksi<S extends z.ZodType>(
  skema: S,
  jalurAdmin: string,
  tulis: (data: z.infer<S>, id: string | null) => Promise<{ id: string }>,
  buang: (id: string) => Promise<unknown>,
) {
  return {
    async simpan(id: string | null, mentah: unknown): Promise<HasilAksi> {
      await wajibMasuk();
      const h = skema.safeParse(mentah);
      if (!h.success) {
        return { ok: false, pesan: "Ada isian yang belum benar.", galat: kumpulkanGalat(h.error) };
      }
      try {
        const baris = await tulis(h.data, id);
        segarkan(jalurAdmin);
        return { ok: true, id: baris.id };
      } catch (e) {
        console.error(`[cms] gagal menyimpan ${jalurAdmin}:`, e);
        return { ok: false, pesan: "Gagal menyimpan. Coba lagi." };
      }
    },
    async hapus(id: string): Promise<HasilAksi> {
      await wajibMasuk();
      try {
        await buang(id);
        segarkan(jalurAdmin);
        return { ok: true, id };
      } catch (e) {
        console.error(`[cms] gagal menghapus ${jalurAdmin}:`, e);
        return { ok: false, pesan: "Gagal menghapus. Coba lagi." };
      }
    },
  };
}

/* Penghapusan lunak: barisnya disembunyikan, tidak dibuang. */
const lunak = { dihapusPada: new Date() };

const blok = (jenis: "NILAI" | "ALASAN" | "LANGKAH" | "FAQ") =>
  buatAksi(
    blokMasuk,
    "/admin/halaman",
    (d, id) =>
      id
        ? db().blokKonten.update({ where: { id }, data: d })
        : db().blokKonten.create({ data: { ...d, jenis } }),
    (id) => db().blokKonten.update({ where: { id }, data: lunak }),
  );

// Server action harus berupa ekspor async tersendiri, jadi tiap jenis
// diberi pasangannya sendiri alih-alih satu fungsi bergenerik.
const aksiNilai = blok("NILAI");
export async function simpanNilai(id: string | null, m: unknown) { return aksiNilai.simpan(id, m); }
export async function hapusNilai(id: string) { return aksiNilai.hapus(id); }

const aksiAlasan = blok("ALASAN");
export async function simpanAlasan(id: string | null, m: unknown) { return aksiAlasan.simpan(id, m); }
export async function hapusAlasan(id: string) { return aksiAlasan.hapus(id); }

const aksiLangkah = blok("LANGKAH");
export async function simpanLangkah(id: string | null, m: unknown) { return aksiLangkah.simpan(id, m); }
export async function hapusLangkah(id: string) { return aksiLangkah.hapus(id); }

const aksiFaq = blok("FAQ");
export async function simpanFaq(id: string | null, m: unknown) { return aksiFaq.simpan(id, m); }
export async function hapusFaq(id: string) { return aksiFaq.hapus(id); }

/**
 * Misi punya aksinya sendiri, bukan memakai `blok()`.
 *
 * Formulirnya hanya berisi satu kolom kalimat, sehingga `isi` tidak pernah
 * diisi editor. Kolomnya NOT NULL di basis data, jadi diisi string kosong di
 * sini — bukan dijadikan nullable, yang akan membuat empat jenis blok lain
 * ikut boleh kosong tanpa alasan.
 */
const aksiMisi = buatAksi(
  misiMasuk,
  "/admin/halaman",
  (d, id) =>
    id
      ? db().blokKonten.update({ where: { id }, data: d })
      : db().blokKonten.create({ data: { ...d, isi: "", jenis: "MISI" } }),
  (id) => db().blokKonten.update({ where: { id }, data: lunak }),
);
export async function simpanMisi(id: string | null, m: unknown) { return aksiMisi.simpan(id, m); }
export async function hapusMisi(id: string) { return aksiMisi.hapus(id); }

const aksiPerjalanan = buatAksi(
  perjalananMasuk,
  "/admin/halaman",
  (d, id) =>
    id ? db().perjalanan.update({ where: { id }, data: d }) : db().perjalanan.create({ data: d }),
  (id) => db().perjalanan.update({ where: { id }, data: lunak }),
);
export async function simpanPerjalanan(id: string | null, m: unknown) { return aksiPerjalanan.simpan(id, m); }
export async function hapusPerjalanan(id: string) { return aksiPerjalanan.hapus(id); }

const aksiLayanan = buatAksi(
  layananMasuk,
  "/admin/layanan",
  (d, id) =>
    id ? db().layanan.update({ where: { id }, data: d }) : db().layanan.create({ data: d }),
  (id) => db().layanan.update({ where: { id }, data: lunak }),
);
export async function simpanLayanan(id: string | null, m: unknown) { return aksiLayanan.simpan(id, m); }
export async function hapusLayanan(id: string) { return aksiLayanan.hapus(id); }

const aksiGrup = buatAksi(
  grupLayananMasuk,
  "/admin/layanan",
  (d, id) =>
    id ? db().grupLayanan.update({ where: { id }, data: d }) : db().grupLayanan.create({ data: d }),
  (id) => db().grupLayanan.update({ where: { id }, data: lunak }),
);
export async function simpanGrupLayanan(id: string | null, m: unknown) { return aksiGrup.simpan(id, m); }
export async function hapusGrupLayanan(id: string) { return aksiGrup.hapus(id); }

const aksiMitra = buatAksi(
  mitraMasuk,
  "/admin/mitra",
  (d, id) => (id ? db().mitra.update({ where: { id }, data: d }) : db().mitra.create({ data: d })),
  (id) => db().mitra.update({ where: { id }, data: lunak }),
);
export async function simpanMitra(id: string | null, m: unknown) { return aksiMitra.simpan(id, m); }
export async function hapusMitra(id: string) { return aksiMitra.hapus(id); }

const aksiTestimoni = buatAksi(
  testimoniMasuk,
  "/admin/mitra",
  (d, id) =>
    id ? db().testimoni.update({ where: { id }, data: d }) : db().testimoni.create({ data: d }),
  (id) => db().testimoni.update({ where: { id }, data: lunak }),
);
export async function simpanTestimoni(id: string | null, m: unknown) { return aksiTestimoni.simpan(id, m); }
export async function hapusTestimoni(id: string) { return aksiTestimoni.hapus(id); }

const aksiProyek = buatAksi(
  proyekMasuk,
  "/admin/halaman",
  (d, id) =>
    id ? db().proyek.update({ where: { id }, data: d }) : db().proyek.create({ data: d }),
  (id) => db().proyek.update({ where: { id }, data: lunak }),
);
export async function simpanProyek(id: string | null, m: unknown) { return aksiProyek.simpan(id, m); }
export async function hapusProyek(id: string) { return aksiProyek.hapus(id); }

const aksiKantor = buatAksi(
  kantorMasuk,
  "/admin/pengaturan",
  (d, id) =>
    id ? db().kantor.update({ where: { id }, data: d }) : db().kantor.create({ data: d }),
  (id) => db().kantor.update({ where: { id }, data: lunak }),
);
export async function simpanKantor(id: string | null, m: unknown) { return aksiKantor.simpan(id, m); }
export async function hapusKantor(id: string) { return aksiKantor.hapus(id); }

const aksiSlide = buatAksi(
  slideMasuk,
  "/admin/pengaturan",
  (d, id) =>
    id ? db().slide.update({ where: { id }, data: d }) : db().slide.create({ data: d }),
  (id) => db().slide.update({ where: { id }, data: lunak }),
);
export async function simpanSlide(id: string | null, m: unknown) { return aksiSlide.simpan(id, m); }
export async function hapusSlide(id: string) { return aksiSlide.hapus(id); }
