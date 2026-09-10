import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { bilangan, company } from "@/lib/site";
import { produkTerbit } from "@/lib/konten";

/**
 * Dibuat per permintaan. Angka jumlah tingkatan di dalamnya datang dari basis
 * data, jadi gambar ini tidak bisa disiapkan saat build — saat build berjalan
 * DATABASE_URL belum tentu ada.
 *
 * Ongkosnya kecil: perayap media sosial mengambilnya sekali lalu menyimpannya
 * di sisi mereka.
 */
export const dynamic = "force-dynamic";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${company.name} — ${company.tagline}`;

/**
 * Gambar pratinjau saat tautan situs ini dibagikan.
 *
 * Ini yang muncul di WhatsApp, dan WhatsApp adalah cara tautan benar-benar
 * beredar dalam percakapan dagang. Tanpa berkas ini tautan tampil polos tanpa
 * gambar sama sekali.
 *
 * Memakai lockup resmi. Versi PNG-nya sudah diratakan ke arang, warna yang
 * sama dengan latar gambar ini, jadi tepinya menyatu tanpa kotak.
 *
 * Fontnya dibaca dari `assets/font`, bukan dari `next/font`: Satori tidak bisa
 * memakai woff2, dan nama berkas keluaran `next/font` di-hash ulang tiap build.
 */
export default async function Image() {
  // Path ditulis utuh sebagai teks, bukan disusun dari potongan: penyusunan
  // dinamis membuat Turbopack gagal melacaknya dan ia menarik seluruh project
  // ke dalam bundle server.
  const produk = await produkTerbit("id");

  const [logo, semiBold, regular] = await Promise.all([
    readFile(join(process.cwd(), "public/logo/logo-square-og.png")),
    readFile(join(process.cwd(), "assets/font/Inter-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/font/Inter-Regular.ttf")),
  ]);

  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0c",
          padding: "76px 84px",
          fontFamily: "Inter",
        }}
      >
        {/* Glow emas, memakai bentuk yang sama dengan hero situs. */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: 300,
            width: 640,
            height: 640,
            borderRadius: 999,
            background: "#d4af4f",
            opacity: 0.16,
            filter: "blur(120px)",
          }}
        />

        {/* 168px, bukan 112 seperti lockup berbaris sebelumnya. Pada marka
            bertumpuk, wordmark menempati 26% bagian bawah — di 112px itu
            menyisakan 29px untuk tiga baris teks, dan pratinjau bagikan
            justru ditampilkan mengecil lagi oleh aplikasi pesan. */}
        <img src={logoSrc} height={168} alt="" style={{ objectFit: "contain" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 600,
              color: "#ffffff",
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Mitra energi Anda yang andal dan profesional
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: "#98928a",
              display: "flex",
            }}
          >
            {bilangan(produk.length)} tingkatan kalori, spesifikasinya dapat
            disesuaikan permintaan.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 10,
            background: "#d4af4f",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: semiBold, weight: 600, style: "normal" },
        { name: "Inter", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
