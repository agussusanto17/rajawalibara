import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

import { tanamBenih } from "../lib/cms/benih";
import { db } from "../lib/db";

/**
 * Menjalankan penanaman yang sama dengan tombol di /admin, dari terminal.
 *
 * Implementasinya satu, di lib/cms/benih.ts. Skrip ini hanya pembungkus:
 * dua salinan logika seed pasti melenceng, dan yang melenceng diam-diam adalah
 * data awal yang berbeda antara mesin lokal dan staging.
 *
 * Di shared hosting skrip ini belum tentu bisa dipakai: devDependencies
 * (termasuk tsx) tidak selalu terpasang di sana. Untuk staging dan produksi,
 * pakai tombolnya di /admin.
 */
tanamBenih()
  .then((l) => {
    console.log(`Kategori   : ${l.kategori}`);
    console.log(`Artikel    : ${l.artikel}`);
    console.log(`Produk     : ${l.produk}`);
    console.log(`Anggota    : ${l.anggota}`);
    console.log(`Media      : ${l.media}`);
    console.log(`Kantor     : ${l.kantor}`);
    console.log(`Mitra      : ${l.mitra}`);
    console.log(`Proyek     : ${l.proyek}`);
    console.log(`Slide hero : ${l.slide}`);
    console.log(`Blok teks  : ${l.blok}`);
    console.log(`Perjalanan : ${l.perjalanan}`);
    console.log(`Layanan    : ${l.layanan}`);
    console.log(`Testimoni  : ${l.testimoni}`);
    console.log(`Grup layan : ${l.grupLayanan}`);
    console.log(`Perusahaan : ${l.perusahaan ? "dibuat" : "sudah ada"}`);
    console.log(`Statistik  : ${l.statistik ? "dibuat" : "sudah ada"}`);
    console.log(`Beranda    : ${l.beranda ? "dibuat" : "sudah ada"}`);
    for (const c of l.catatan) console.log(`\nCATATAN: ${c}`);
  })
  .catch((e) => {
    console.error("\nGagal:", e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => db().$disconnect());
