import { z } from "zod";

/**
 * Penjaga bentuk untuk kolom Json.
 *
 * Kolom `isi` pada tabel artikel bertipe Json, jadi MySQL menerima apa
 * pun yang berbentuk JSON valid — termasuk larik kosong, objek tanpa `jenis`,
 * atau blok dengan properti salah ketik. Yang menjaganya cuma berkas ini.
 * Setiap jalur tulis WAJIB melewatinya; kalau ada satu yang lewat begitu saja,
 * halaman publik yang akan meledak saat merender, jauh dari tempat kesalahan
 * itu dibuat.
 */
export const blokArtikel = z.discriminatedUnion("jenis", [
  z.object({ jenis: z.literal("paragraf"), teks: z.string().trim().min(1) }),
  z.object({ jenis: z.literal("subjudul"), teks: z.string().trim().min(1) }),
  z.object({ jenis: z.literal("sorotan"), teks: z.string().trim().min(1) }),
  z.object({
    jenis: z.literal("daftar"),
    butir: z.array(z.string().trim().min(1)).min(1),
  }),
]);

/** Slug: huruf kecil, angka, dan tanda hubung. Dipakai langsung sebagai URL. */
const slug = z
  .string()
  .trim()
  .min(3, "Slug minimal 3 karakter.")
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
  );

export const artikelMasuk = z.object({
  judul: z.string().trim().min(3, "Judul minimal 3 karakter.").max(200),
  slug,
  // Dipakai sebagai meta description. Di atas ~160 karakter Google memotongnya
  // di tengah kalimat, jadi batasnya bukan sekadar rapi-rapi.
  ringkas: z
    .string()
    .trim()
    .min(20, "Ringkasan minimal 20 karakter.")
    .max(200, "Ringkasan maksimal 200 karakter."),
  kategoriId: z.uuid("Kategori wajib dipilih."),
  isi: z.array(blokArtikel).min(1, "Naskah tidak boleh kosong."),
  status: z.enum(["DRAF", "TERBIT"]),
  unggulan: z.boolean(),
  terbitPada: z.coerce.date().nullable(),
  sampulId: z.uuid().nullable(),
  seoJudul: z.string().trim().max(70).nullable(),
  seoDeskripsi: z.string().trim().max(200).nullable(),
});

export type ArtikelMasuk = z.infer<typeof artikelMasuk>;

/** Mengubah judul jadi slug. Dipakai tombol bantu di formulir. */
export const keSlug = (teks: string) =>
  teks
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

export const kategoriMasuk = z.object({
  nama: z.string().trim().min(2, "Nama minimal 2 karakter.").max(60),
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter.")
    .max(80)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
    ),
  urutan: z.coerce.number().int().min(0).max(999),
});

export type KategoriMasuk = z.infer<typeof kategoriMasuk>;

/* ------------------------------------------------------- Produk/komoditas -*/

const teks = (min: number, maks: number, label: string) =>
  z.string().trim().min(min, `${label} minimal ${min} karakter.`).max(maks);

/**
 * Kolom terjemahan bahasa Inggris.
 *
 * Selalu boleh kosong, dan kosong disimpan sebagai NULL — bukan string
 * kosong. Halaman /en membaca NULL sebagai "belum diterjemahkan" lalu
 * menampilkan teks Indonesianya; string kosong yang tersimpan sebagai
 * terjemahan sah akan mengosongkan bagian itu tanpa ada yang menyadarinya.
 *
 * Tanpa batas minimum: terjemahan setengah jadi yang ditolak formulir memaksa
 * penyunting membatalkan seluruh perubahannya, termasuk yang sudah benar.
 */
const teksEn = (maks: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.string().trim().max(maks).nullable().default(null),
  );

export const produkMasuk = z.object({
  nama: teks(2, 60, "Nama"),
  namaPanjang: teks(3, 300, "Nama panjang"),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
    ),
  jenis: z.enum(["BATUBARA", "MINERAL"]),
  ringkas: teks(20, 300, "Ringkasan"),
  deskripsi: teks(20, 3000, "Deskripsi"),
  /**
   * Divalidasi di aksi terhadap daftar ikon yang sebenarnya, bukan di sini:
   * skema ini dipakai peramban juga, dan mengimpor peta ikon ke sana menyeret
   * seluruh komponennya ikut terbundel.
   */
  ikon: z.string().trim().min(1, "Ikon wajib dipilih."),
  peruntukan: teks(3, 300, "Peruntukan"),
  /** Boleh kosong: bagian asal tambang tidak dirender selama belum diisi,
   *  bukan diisi klaim yang belum bisa dibuktikan dokumennya. */
  asal: z.string().trim().max(3000).default(""),
  namaEn: teksEn(60),
  namaPanjangEn: teksEn(300),
  ringkasEn: teksEn(300),
  deskripsiEn: teksEn(3000),
  peruntukanEn: teksEn(300),
  asalEn: teksEn(3000),
  /** Spesifikasi versi Inggris: parameter dan satuan dialihbahasakan, ANGKANYA
   *  tidak. Dua bahasa yang menyebut angka berlainan untuk kargo yang sama
   *  adalah sengketa kontrak, bukan salah ketik. */
  spesifikasiEn: z
    .array(
      z.object({
        parameter: z.string().trim().min(1).max(120),
        nilai: z.string().trim().min(1).max(120),
        satuan: z.string().trim().max(40).default(""),
      }),
    )
    .max(40)
    .default([]),
  keunggulanEn: z
    .array(
      z.object({
        icon: z.string().trim().max(40).default(""),
        title: z.string().trim().min(1).max(160),
        body: z.string().trim().min(1).max(1000),
      }),
    )
    .max(12)
    .default([]),
  urutan: z.coerce.number().int().min(0).max(999),
  status: z.enum(["DRAF", "TERBIT"]),

  /**
   * Tabel spesifikasi teknis. WAJIB minimal satu baris.
   *
   * Ini satu-satunya grup yang tidak boleh kosong. Halaman komoditas tanpa
   * spesifikasi tidak menjawab pertanyaan pertama pembelinya, dan yang tampil
   * hanyalah paragraf pemasaran yang tidak bisa dibandingkan dengan apa pun.
   *
   * `nilai` berupa teks, bukan angka: sebagian parameter ditulis sebagai
   * rentang ("4.200 – 4.400") atau batas ("maks. 1"), dan memaksanya jadi
   * bilangan menutup keduanya.
   */
  spesifikasi: z
    .array(
      z.object({
        parameter: teks(2, 80, "Parameter"),
        nilai: teks(1, 60, "Nilai"),
        satuan: z.string().trim().max(30).default(""),
      }),
    )
    .min(1, "Minimal satu baris spesifikasi."),

  keunggulan: z.array(
    z.object({
      icon: z.string().trim().min(1),
      title: teks(2, 120, "Judul"),
      body: teks(5, 500, "Keterangan"),
    }),
  ),

  galeri: z.array(
    z.object({ src: z.string().trim().min(1), caption: z.string().trim().max(200) }),
  ),

  /** Id mitra yang memakai komoditas ini. Nama dan logonya tinggal di baris
   *  Mitra, jadi mengganti logo satu kali mengubahnya di semua tempat. */
  mitraId: z.array(z.uuid()).max(200).default([]),

  langkah: z.array(
    z.object({ title: teks(2, 120, "Judul langkah"), body: teks(5, 500, "Keterangan") }),
  ),

  sampulId: z.uuid().nullable(),
  seoJudul: z.string().trim().max(70).nullable(),
  seoDeskripsi: z.string().trim().max(300).nullable(),
  unggulan: z.coerce.boolean().default(false),
})
  .refine((d) => !d.unggulan || d.sampulId !== null, {
    // Ditegakkan di sini, bukan disembunyikan lewat penyaringan di halaman.
    // Kartu unggulan memuat foto selebar kartunya; tanpa sampul ia tidak bisa
    // dirender, dan menyaringnya diam-diam berarti entri yang baru saja
    // ditandai justru lenyap tanpa penjelasan.
    path: ["unggulan"],
    message: "Komoditas unggulan harus punya sampul. Pilih sampulnya lebih dulu.",
  });

export type ProdukMasuk = z.infer<typeof produkMasuk>;

/* ------------------------------------------------------------ Anggota tim -*/

export const anggotaMasuk = z.object({
  nama: teks(2, 120, "Nama"),
  jabatan: teks(2, 120, "Jabatan"),
  jabatanEn: teksEn(120),
  bioEn: teksEn(1000),
  kelompok: z.enum(["PIMPINAN", "TIM"]),
  /** Hanya dipakai kartu pimpinan. Kosong berarti kartu tampil tanpa paragraf. */
  bio: z.string().trim().max(1000).nullable(),
  urutan: z.coerce.number().int().min(0).max(999),
  fotoId: z.uuid().nullable(),
});

export type AnggotaMasuk = z.infer<typeof anggotaMasuk>;

/* ------------------------------------------------------------ Pengaturan --*/

/**
 * Data perusahaan.
 *
 * Alamat dan koordinat TIDAK di sini: perusahaan punya kantor pusat dan
 * cabang, dan menyimpan salah satunya sebagai "alamat perusahaan" berarti yang
 * lain hidup di tempat lain. Lihat kantorMasuk.
 *
 * Misi juga tidak di sini. Lima butir bernomor tidak muat sebagai satu kolom
 * teks tanpa kehilangan nomornya; ia jadi daftar BlokKonten jenis MISI.
 */
export const perusahaanMasuk = z.object({
  nama: teks(1, 40, "Nama"),
  namaLegal: teks(3, 160, "Nama legal"),
  tagline: teks(3, 300, "Tagline"),
  /** Boleh kosong: pita legalitas tinggal tidak menampilkan barisnya. */
  nib: z.string().trim().max(30).default(""),
  berdiri: z.coerce.number().int().min(1900).max(2100),
  intro: teks(10, 400, "Intro"),
  telepon: teks(6, 30, "Telepon"),
  whatsapp: z.url("Alamat WhatsApp harus berupa URL lengkap."),
  email: z.email("Format email belum benar."),
  visi: teks(10, 800, "Visi"),
  sejarah: teks(20, 3000, "Sejarah"),
  latarBelakang: teks(20, 3000, "Latar belakang"),
  taglineEn: teksEn(300),
  introEn: teksEn(400),
  visiEn: teksEn(800),
  sejarahEn: teksEn(3000),
  latarBelakangEn: teksEn(3000),
});

/**
 * Satu kantor.
 *
 * `mapsCid` boleh kosong. CID hanya ada untuk tempat yang sudah terdaftar di
 * Google Maps; selama kosong, peta memakai pencarian alamat — kurang presisi,
 * tetapi tidak pernah menunjuk gedung yang salah seperti CID yang ditebak.
 */
export const kantorMasuk = z.object({
  jenis: z.enum(["PUSAT", "CABANG"]),
  nama: teks(3, 120, "Nama kantor"),
  alamat: teks(10, 500, "Alamat"),
  alamatSingkat: teks(3, 300, "Alamat singkat"),
  telepon: z.string().trim().max(30).nullable().default(null),
  email: z.string().trim().max(160).nullable().default(null),
  mapsCid: z.string().trim().max(40).default(""),
  mapsLat: z.coerce.number().min(-90).max(90).default(0),
  mapsLng: z.coerce.number().min(-180).max(180).default(0),
  urutan: z.coerce.number().int().min(0).max(999),
  namaEn: teksEn(120),
  alamatEn: teksEn(500),
  alamatSingkatEn: teksEn(300),
});

export type KantorMasuk = z.infer<typeof kantorMasuk>;

export const berandaMasuk = z.object({
  pitaTag: teks(1, 40, "Label pita"),
  pitaTeks: teks(3, 300, "Teks pita"),
  pitaTautan: z.string().trim().max(200),
  /** Penanda [[...]] dirender sebagai sorotan warna merek di halaman. */
  judul: teks(10, 500, "Judul hero"),
  intro: teks(10, 500, "Intro hero"),
  ctaUtamaLabel: teks(2, 60, "Label CTA utama"),
  /** Dipakai di layar sempit, tempat dua tombol berdampingan tidak muat. */
  ctaUtamaLabelPendek: teks(2, 30, "Label pendek CTA utama"),
  ctaUtamaHref: teks(1, 200, "Tautan CTA utama"),
  ctaKeduaLabel: teks(2, 60, "Label CTA kedua"),
  ctaKeduaLabelPendek: teks(2, 30, "Label pendek CTA kedua"),
  ctaKeduaHref: teks(1, 200, "Tautan CTA kedua"),
  manifesto: teks(20, 3000, "Manifesto"),
  fotoSatuId: z.uuid().nullable(),
  fotoDuaId: z.uuid().nullable(),
  pitaTagEn: teksEn(40),
  pitaTeksEn: teksEn(300),
  judulEn: teksEn(500),
  introEn: teksEn(500),
  ctaUtamaLabelEn: teksEn(60),
  ctaUtamaLabelPendekEn: teksEn(30),
  ctaKeduaLabelEn: teksEn(60),
  ctaKeduaLabelPendekEn: teksEn(30),
  manifestoEn: teksEn(3000),
});

export const statistikMasuk = z.object({
  jumlahKlien: z.coerce.number().int().min(0).max(100000),
});

export const seoMasuk = z.object({
  jalur: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^\/[a-z0-9\-/]*$/, "Jalur harus dimulai dengan / dan huruf kecil."),
  judul: z.string().trim().max(70).nullable(),
  deskripsi: z.string().trim().max(300).nullable(),
  judulEn: teksEn(70),
  deskripsiEn: teksEn(300),
});

export type PerusahaanMasuk = z.infer<typeof perusahaanMasuk>;
export type BerandaMasuk = z.infer<typeof berandaMasuk>;

/* -------------------------------------------------------- Isi halaman --- */

/** Ikon boleh kosong: langkah dan FAQ tampil bernomor, bukan berikon. */
const ikonOpsional = z.string().trim().max(40).nullable().default(null);

const urutan = z.coerce.number().int().min(0).max(999);

export const blokMasuk = z.object({
  ikon: ikonOpsional,
  judul: teks(3, 300, "Judul"),
  isi: teks(10, 3000, "Isi"),
  judulEn: teksEn(300),
  isiEn: teksEn(3000),
  urutan,
});

/**
 * Satu butir misi.
 *
 * Hanya `judul`, tanpa `isi`: tiap butir adalah satu kalimat utuh, dan
 * memecahnya jadi judul plus penjelasan berarti mengarang separuhnya. Aksinya
 * mengisi kolom `isi` dengan string kosong.
 */
export const misiMasuk = z.object({
  judul: teks(10, 300, "Butir misi"),
  judulEn: teksEn(300),
  urutan,
});

export const perjalananMasuk = z.object({
  // Tahun sebagai teks, bukan angka: sebagian tonggak lebih tepat ditulis
  // sebagai rentang, dan memaksanya jadi bilangan menutup kemungkinan itu.
  tahun: teks(4, 20, "Tahun"),
  judul: teks(3, 300, "Judul"),
  isi: teks(10, 3000, "Isi"),
  judulEn: teksEn(300),
  isiEn: teksEn(3000),
  urutan,
});

/**
 * Satu proyek untuk galeri "Proyek Kami".
 *
 * Foto wajib: bagian ini berupa kisi gambar, dan entri tanpa foto meninggalkan
 * lubang yang terbaca sebagai gambar gagal dimuat, bukan sebagai entri tanpa
 * foto. Keterangan lain boleh kosong.
 */
export const proyekMasuk = z.object({
  judul: teks(3, 300, "Judul proyek"),
  lokasi: z.string().trim().max(160).nullable().default(null),
  tahun: z.string().trim().max(20).nullable().default(null),
  ringkas: z.string().trim().max(1000).nullable().default(null),
  judulEn: teksEn(300),
  lokasiEn: teksEn(160),
  ringkasEn: teksEn(1000),
  fotoId: z.uuid("Foto wajib dipilih."),
  urutan,
});

/**
 * Satu slide hero.
 *
 * Foto wajib, keterangan boleh kosong. Tidak ada kolom judul: copy hero tinggal
 * di Beranda, satu untuk semua slide — lihat catatan pada model Slide.
 */
export const slideMasuk = z.object({
  fotoId: z.uuid("Foto wajib dipilih."),
  keterangan: z.string().trim().max(120).nullable().default(null),
  keteranganEn: teksEn(120),
  urutan,
});

export const layananMasuk = z.object({
  nama: teks(3, 300, "Nama bidang usaha"),
  namaEn: teksEn(300),
  urutan,
});

export const grupLayananMasuk = z.object({
  ikon: teks(2, 40, "Ikon"),
  judul: teks(3, 300, "Judul"),
  isi: teks(10, 3000, "Isi"),
  cakupan: z.array(z.string().trim().min(1)).max(20).default([]),
  judulEn: teksEn(300),
  isiEn: teksEn(3000),
  cakupanEn: z.array(z.string().trim().min(1)).max(20).default([]),
  urutan,
});

export const mitraMasuk = z.object({
  nama: teks(2, 120, "Nama mitra"),
  /** Sektor klien atau mitra. Menggantikan "tingkat" (Provinsi/Kota/
   *  Kabupaten) dari project asal, yang hanya masuk akal untuk klien
   *  pemerintahan. */
  sektor: teks(2, 60, "Sektor"),
  sektorEn: teksEn(60),
  logoId: z.uuid().nullable().default(null),
  urutan,
});

export const testimoniMasuk = z.object({
  kutipan: teks(20, 2000, "Kutipan"),
  kutipanEn: teksEn(2000),
  nama: teks(2, 80, "Nama"),
  peran: teks(2, 80, "Peran"),
  peranEn: teksEn(80),
  organisasi: teks(2, 120, "Organisasi"),
  fotoId: z.uuid().nullable().default(null),
  /** Dimatikan setelah kutipannya diganti yang sungguhan. */
  contoh: z.coerce.boolean().default(false),
  urutan,
});
