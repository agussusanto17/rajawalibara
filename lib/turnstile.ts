/**
 * Verifikasi token Cloudflare Turnstile.
 *
 * Dipanggil dari route kontak. Token hanya sekali pakai: sekali diverifikasi,
 * token yang sama ditolak pada percobaan berikutnya.
 */
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Harus sama dengan data-action pada widget di formulirnya. */
export const AKSI_KONTAK = "kontak";

export type HasilTurnstile =
  | { ok: true }
  | { ok: false; sebab: string; kode?: string[] };

/** Apakah verifikasi diaktifkan. Tanpa rahasia, tidak ada yang bisa diperiksa. */
export const turnstileAktif = () => Boolean(process.env.TURNSTILE_SECRET);

/**
 * Daftar hostname yang boleh menampilkan widget ini.
 *
 * Tanpa pemeriksaan ini, siapa pun bisa memasang site key kita di situsnya
 * sendiri, memanen token yang sah dari sana, lalu mengirimkannya ke route ini.
 * Site key memang publik — hostname yang membedakan token milik kita.
 */
function hostnameDiizinkan(): string[] {
  return (process.env.TURNSTILE_HOSTNAMES ?? "")
    .split(",")
    .map((h) =>
      h
        .trim()
        .toLowerCase()
        // Cloudflare menjawab dengan hostname telanjang, jadi yang dibandingkan
        // juga harus telanjang. Skema, port, dan jalur dibuang di sini alih-alih
        // dituntut ditulis benar: salah tulis satu karakter membuat SETIAP
        // kiriman ditolak, dan sebabnya tidak terlihat di layar mana pun.
        .replace(/^[a-z]+:\/\//, "")
        .replace(/[/:].*$/, ""),
    )
    .filter(Boolean);
}

export async function verifikasiTurnstile(
  token: unknown,
  ip: string,
): Promise<HasilTurnstile> {
  const rahasia = process.env.TURNSTILE_SECRET;
  if (!rahasia) return { ok: true };

  if (typeof token !== "string" || !token) {
    return { ok: false, sebab: "Token tidak disertakan." };
  }

  const isi = new URLSearchParams({ secret: rahasia, response: token });
  // Alamat tak dikenal tidak dikirim: Cloudflare menolak nilai yang bukan IP,
  // dan permintaan yang gagal karenanya terbaca seolah tokennya yang salah.
  if (ip && ip !== "tidak-diketahui") isi.set("remoteip", ip);

  let data: {
    success?: boolean;
    action?: string;
    hostname?: string;
    "error-codes"?: string[];
  };
  try {
    const res = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: isi,
      // Tanpa batas waktu, satu gangguan di sisi Cloudflare menahan permintaan
      // sampai proxy yang memutusnya, dan pengirim hanya melihat halaman diam.
      signal: AbortSignal.timeout(8000),
    });
    data = await res.json();
  } catch (e) {
    console.error("[turnstile] gagal menghubungi siteverify:", e);
    return { ok: false, sebab: "Verifikasi tidak dapat dijalankan." };
  }

  if (!data.success) {
    return {
      ok: false,
      sebab: "Verifikasi tidak lolos.",
      kode: data["error-codes"],
    };
  }

  // Aksi mengikat token pada formulir tertentu. Tanpanya, token dari widget
  // mana pun di domain kita bisa dipakai untuk mengirim ke route ini.
  if (data.action !== AKSI_KONTAK) {
    return { ok: false, sebab: `Aksi tidak sesuai: ${data.action}` };
  }

  const daftar = hostnameDiizinkan();
  if (daftar.length === 0) {
    console.error(
      "[turnstile] TURNSTILE_HOSTNAMES kosong. Token dari situs mana pun yang " +
        "memakai site key ini akan diterima. Isi daftar hostname-nya.",
    );
  } else if (!daftar.includes((data.hostname ?? "").toLowerCase())) {
    return { ok: false, sebab: `Hostname tidak diizinkan: ${data.hostname}` };
  }

  return { ok: true };
}
