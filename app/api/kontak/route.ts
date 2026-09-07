import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { turnstileAktif, verifikasiTurnstile } from "@/lib/turnstile";

/** Batas panjang, supaya satu kiriman tidak bisa membanjiri tabel. */
const BATAS = { nama: 120, email: 160, telepon: 40, organisasi: 160, pesan: 4000 };

/**
 * Pembatas laju sederhana, disimpan di memori proses.
 *
 * Dua ambang, bukan satu. Kiriman yang lolos validasi dibatasi ketat karena
 * itu yang menulis ke tabel, sedangkan jumlah permintaan mentah dibatasi jauh
 * lebih longgar. Kalau keduanya disatukan, pengunjung yang tiga kali salah
 * mengetik email ikut terkunci sepuluh menit, dan yang dihukum justru orang
 * yang sedang berusaha menghubungi.
 *
 * Ini BUKAN pengaman lintas instance: bila nanti berjalan di beberapa instance
 * atau di lingkungan serverless, hitungannya terpisah per instance dan perlu
 * diganti penyimpanan bersama seperti Redis.
 */
const JENDELA_MS = 10 * 60 * 1000;
const MAKS_TERSIMPAN = 3;
const MAKS_PERMINTAAN = 30;

const jejakSimpan = new Map<string, number[]>();
const jejakMinta = new Map<string, number[]>();

function catat(peta: Map<string, number[]>, ip: string, maks: number) {
  const now = Date.now();
  const baru = (peta.get(ip) ?? []).filter((t) => now - t < JENDELA_MS);
  baru.push(now);
  peta.set(ip, baru);

  // Buang jejak alamat lain yang sudah kedaluwarsa, agar map tidak tumbuh terus.
  if (peta.size > 500) {
    for (const [k, v] of peta) {
      if (v.every((t) => now - t >= JENDELA_MS)) peta.delete(k);
    }
  }
  return baru.length > maks;
}

const bersih = (v: unknown, maks: number) =>
  typeof v === "string" ? v.trim().slice(0, maks) : "";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "tidak-diketahui";

  // Ambang longgar: menahan banjir permintaan, bukan menghukum salah ketik.
  if (catat(jejakMinta, ip, MAKS_PERMINTAAN)) {
    return NextResponse.json(
      { ok: false, pesan: "Terlalu banyak permintaan. Coba lagi beberapa saat." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, pesan: "Format kiriman tidak dikenali." },
      { status: 400 },
    );
  }

  // Umpan bot: kolom ini disembunyikan dari manusia, jadi kalau terisi berarti
  // pengirimnya bukan manusia. Dijawab seolah berhasil agar bot tidak belajar.
  if (bersih(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  // Diperiksa setelah umpan bot, sebelum validasi isian: memanggil Cloudflare
  // untuk kiriman bot hanya menambah permintaan keluar tanpa mengubah
  // hasilnya. Ditaruh sebelum penulisan, karena inilah yang menjaga tabel.
  const cek = await verifikasiTurnstile(body.turnstileToken, ip);
  if (!cek.ok) {
    console.warn("[kontak] turnstile ditolak:", cek.sebab, cek.kode ?? "");
    return NextResponse.json(
      {
        ok: false,
        pesan:
          "Verifikasi keamanan gagal. Muat ulang halaman, lalu kirim sekali lagi.",
      },
      { status: 403 },
    );
  }

  if (!turnstileAktif()) {
    // Bukan diam-diam dilewati. Formulirnya tetap jalan — umpan bot dan
    // pembatas laju masih berlaku — tetapi lapisan ini mati, dan itu harus
    // terbaca di log alih-alih hanya diketahui orang yang memasangnya.
    console.error(
      "[kontak] TURNSTILE_SECRET belum diisi; kiriman diterima tanpa verifikasi.",
    );
  }

  const nama = bersih(body.nama, BATAS.nama);
  const email = bersih(body.email, BATAS.email);
  const telepon = bersih(body.telepon, BATAS.telepon);
  const organisasi = bersih(body.organisasi, BATAS.organisasi);
  const pesan = bersih(body.pesan, BATAS.pesan);

  // Divalidasi ulang di sini, bukan hanya di peramban: siapa pun bisa memanggil
  // route ini langsung tanpa melewati formulir.
  const galat: Record<string, string> = {};
  if (!nama) galat.nama = "Nama wajib diisi.";
  if (!email) galat.email = "Email wajib diisi.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    galat.email = "Format email belum benar.";
  if (!telepon) galat.telepon = "Nomor telepon wajib diisi.";
  else if (telepon.replace(/\D/g, "").length < 9)
    galat.telepon = "Nomor telepon belum lengkap.";
  if (!pesan) galat.pesan = "Pesan wajib diisi.";
  else if (pesan.length < 10) galat.pesan = "Pesan minimal 10 karakter.";

  if (Object.keys(galat).length > 0) {
    return NextResponse.json({ ok: false, galat }, { status: 422 });
  }

  // Ambang ketat, dihitung hanya setelah isian dinyatakan sah.
  if (catat(jejakSimpan, ip, MAKS_TERSIMPAN)) {
    return NextResponse.json(
      {
        ok: false,
        pesan:
          "Anda sudah mengirim beberapa pesan. Tim kami akan membalas, atau hubungi kami lewat WhatsApp bila mendesak.",
      },
      { status: 429 },
    );
  }

  try {
    await db().pesanMasuk.create({
      data: {
        nama,
        email,
        telepon: telepon || null,
        organisasi: organisasi || null,
        pesan,
        produk: bersih(body.produk, 80) || null,
        halaman: bersih(body.halaman, 300) || null,
        kampanye: bersih(body.kampanye, 500) || null,
      },
    });
  } catch (e) {
    // Kegagalan penyimpanan harus terlihat oleh pengirim. Menjawab "berhasil"
    // saat pesannya hilang persis kesalahan yang sedang diperbaiki di sini.
    console.error("[kontak] gagal menyimpan pesan:", e);
    return NextResponse.json(
      {
        ok: false,
        pesan:
          "Pesan gagal terkirim. Silakan coba lagi, atau hubungi kami lewat WhatsApp.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
