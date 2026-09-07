import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { folderMedia } from "@/lib/cms/media";

/**
 * Penyaji berkas unggahan.
 *
 * Folder unggahan berada di LUAR direktori aplikasi supaya tidak tersapu tiap
 * deploy (lihat lib/cms/media.ts), yang berarti Next tidak menyajikannya
 * sendiri seperti isi `public/`. Route inilah jembatannya.
 */
export const runtime = "nodejs";

/** Tipe konten per ekstensi. Daftar tertutup, sejajar dengan yang boleh
 *  diunggah di lib/cms/aksi-media.ts. */
const TIPE: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  avif: "image/avif",
  svg: "image/svg+xml",
};

export async function GET(
  _permintaan: Request,
  { params }: { params: Promise<{ jalur: string[] }> },
) {
  const { jalur } = await params;

  const akar = folderMedia();
  const berkas = path.resolve(akar, ...jalur);

  // Penjaga penelusuran jalur. Segmen "..%2F" yang lolos dari penguraian URL
  // bisa keluar dari folder unggahan dan menyajikan berkas mana pun yang bisa
  // dibaca proses ini — termasuk .env. Diperiksa setelah resolve, bukan
  // dengan memeriksa string mentahnya: hanya jalur yang sudah dinormalkan
  // yang bisa dibandingkan dengan benar.
  const rel = path.relative(akar, berkas);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    return new Response("Tidak ditemukan", { status: 404 });
  }

  const ekstensi = path.extname(berkas).slice(1).toLowerCase();
  const tipe = TIPE[ekstensi];
  if (!tipe) return new Response("Tidak ditemukan", { status: 404 });

  let ukuran: number;
  try {
    const s = await stat(berkas);
    if (!s.isFile()) return new Response("Tidak ditemukan", { status: 404 });
    ukuran = s.size;
  } catch {
    return new Response("Tidak ditemukan", { status: 404 });
  }

  const aliran = Readable.toWeb(
    createReadStream(berkas),
  ) as unknown as ReadableStream<Uint8Array>;

  return new Response(aliran, {
    headers: {
      "Content-Type": tipe,
      "Content-Length": String(ukuran),
      // Nama berkas mengandung akhiran acak dan tidak pernah ditulis ulang,
      // jadi isinya kekal. immutable membuat peramban berhenti menanyakannya
      // sama sekali, bukan sekadar menerima 304.
      "Cache-Control": "public, max-age=31536000, immutable",
      // Berkas SVG bisa memuat skrip. Disajikan dari origin yang sama dengan
      // CMS, itu berarti satu unggahan SVG jahat bisa membaca sesi admin.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
