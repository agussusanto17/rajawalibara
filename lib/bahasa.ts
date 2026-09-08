/**
 * Dua bahasa: Indonesia sebagai bawaan, Inggris di bawah awalan /en.
 *
 * Indonesia tinggal di akar (`/`, `/layanan`) dan bukan di `/id`. Situs ini
 * berbahasa Indonesia lebih dulu, dan memindahkannya ke `/id` akan mematahkan
 * setiap tautan yang sudah tersebar sejak deploy pertama.
 *
 * Ruas jalur bahasa Inggris memakai kata Inggris — `/en/services`, bukan
 * `/en/layanan`. Pembacanya pembeli luar negeri, dan alamat yang setengah
 * Indonesia terbaca seperti terjemahan yang belum selesai. Pemetaannya ada di
 * RUAS di bawah; itu satu-satunya tempat kedua bentuk jalur bertemu.
 */

export const BAHASA = ["id", "en"] as const;
export type Bahasa = (typeof BAHASA)[number];

export const BAHASA_BAWAAN: Bahasa = "id";

/** Label tombol pengalih. Nama bahasa selalu ditulis dalam bahasanya sendiri. */
export const NAMA_BAHASA: Record<Bahasa, string> = {
  id: "Indonesia",
  en: "English",
};

/** Kode BCP 47 untuk atribut lang dan hreflang. */
export const KODE_BAHASA: Record<Bahasa, string> = {
  id: "id-ID",
  en: "en",
};

/** Kode locale untuk Open Graph. */
export const OG_LOCALE: Record<Bahasa, string> = {
  id: "id_ID",
  en: "en_US",
};

/**
 * Melebarkan literal `as const` menjadi string, kuncinya tetap.
 *
 * Dipakai untuk mengikat naskah terjemahan ke bentuk naskah aslinya. Tanpa
 * ini, `typeof naskahIndonesia` menuntut versi Inggris memakai kalimat
 * Indonesia yang sama persis — tipe literal menolak terjemahan apa pun.
 *
 * Angka dan boolean sengaja TIDAK dilebarkan: tahun berdiri dan jumlah klien
 * harus sama di kedua bahasa, dan tipe literal yang mempertahankannya adalah
 * penjaga yang benar di sana.
 */
export type Teks<T> = T extends string
  ? string
  : T extends number | boolean | null | undefined
    ? T
    : T extends readonly (infer U)[]
      ? Teks<U>[]
      : { -readonly [K in keyof T]: Teks<T[K]> };

/**
 * Padanan ruas jalur Indonesia -> Inggris.
 *
 * Kunci adalah jalur Indonesia apa adanya seperti tertulis di lib/site.ts.
 * Jalur yang tidak terdaftar hanya diberi awalan /en — cukup untuk halaman
 * yang ruasnya memang netral, dan tidak pernah menghasilkan 404 diam-diam
 * karena rutenya toh tidak ada di kedua bahasa.
 */
const RUAS: Record<string, string> = {
  "/": "",
  "/tentang-kami": "/about-us",
  "/layanan": "/services",
  "/hubungi-kami": "/contact",
};

/** Kebalikan RUAS, dipakai pengalih bahasa untuk kembali ke jalur Indonesia. */
const RUAS_BALIK: Record<string, string> = Object.fromEntries(
  Object.entries(RUAS).map(([id, en]) => [en || "/", id]),
);

/**
 * Menyusun tautan untuk bahasa tertentu.
 *
 * Seluruh `href` di lib/site.ts dan lib/site.en.ts ditulis dalam bentuk
 * Indonesia tanpa awalan bahasa. Fungsi ini satu-satunya tempat awalan itu
 * ditambahkan; menuliskannya langsung di data berarti setiap tautan baru
 * harus diingat dua kali, dan yang terlupa adalah tautan yang melempar
 * pembaca Inggris kembali ke halaman Indonesia di tengah kunjungan.
 *
 * Tautan luar (http, mailto, tel, wa.me) dan jangkar murni (#bagian)
 * dikembalikan apa adanya.
 */
export function tautan(bahasa: Bahasa, href: string): string {
  if (bahasa === "id") return href;
  if (!href.startsWith("/")) return href;

  const potong = href.indexOf("#");
  const jalur = potong === -1 ? href : href.slice(0, potong);
  const jangkar = potong === -1 ? "" : href.slice(potong);

  const ruas = RUAS[jalur];
  if (ruas !== undefined) return `/en${ruas}${jangkar}`;
  return `/en${jalur}${jangkar}`;
}

/**
 * Jalur padanan di bahasa lain, untuk tombol pengalih.
 *
 * Menerima jalur yang sedang dibuka (dari usePathname) dan mengembalikan
 * jalur yang sama di bahasa tujuan. Pengalih bahasa yang selalu melempar ke
 * beranda memaksa pembaca mencari ulang halaman yang tadi dibacanya.
 */
export function jalurPadanan(jalurSekarang: string, tujuan: Bahasa): string {
  const bersih = jalurSekarang.replace(/\/+$/, "") || "/";

  if (tujuan === "en") {
    return tautan("en", bersih);
  }

  if (!bersih.startsWith("/en")) return bersih;
  const sisa = bersih.slice(3) || "/";
  return RUAS_BALIK[sisa] ?? sisa;
}

/** Membaca bahasa dari jalur. Apa pun di luar /en dianggap Indonesia. */
export function bahasaDariJalur(jalur: string): Bahasa {
  return jalur === "/en" || jalur.startsWith("/en/") ? "en" : "id";
}

/**
 * Memilih nilai terjemahan, jatuh ke bahasa Indonesia bila kosong.
 *
 * Kolom `*_en` di basis data boleh NULL, artinya belum diterjemahkan. Yang
 * benar dilakukan di situ adalah menampilkan teks Indonesianya, bukan ruang
 * kosong: pembaca yang menemukan satu paragraf berbahasa Indonesia masih bisa
 * meneruskan kalimatnya ke penerjemah, sementara paragraf kosong tidak
 * memberi apa pun dan terbaca seperti situs yang rusak.
 *
 * String kosong diperlakukan sama dengan NULL. Formulir CMS mengirim "" untuk
 * isian yang tidak disentuh, dan menyimpannya sebagai terjemahan sah akan
 * mengosongkan halaman Inggris tanpa ada yang menyadarinya.
 */
export function pilih(
  bahasa: Bahasa,
  nilaiId: string,
  nilaiEn: string | null | undefined,
): string {
  if (bahasa === "id") return nilaiId;
  const en = nilaiEn?.trim();
  return en ? en : nilaiId;
}

/** Bentuk `pilih` untuk kolom Json (spesifikasi, keunggulan, cakupan). */
export function pilihJson<T>(
  bahasa: Bahasa,
  nilaiId: T,
  nilaiEn: unknown,
): T {
  if (bahasa === "id") return nilaiId;
  if (nilaiEn === null || nilaiEn === undefined) return nilaiId;
  if (Array.isArray(nilaiEn) && nilaiEn.length === 0) return nilaiId;
  return nilaiEn as T;
}
