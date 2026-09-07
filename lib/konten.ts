import type { Orang, Product, Spesifikasi } from "@/lib/site";
import {
  alasanKami,
  beranda,
  company,
  faqUmum,
  kantor,
  langkahMulai,
  misi,
  perjalanan,
  serviceGroups,
  services,
  values,
} from "@/lib/site";
import { HIDUP } from "@/lib/cms/saring";
import { db } from "@/lib/db";

/**
 * Pembacaan konten untuk halaman publik.
 *
 * Bentuk keluarannya sengaja disamakan dengan tipe di lib/site.ts, supaya
 * komponen tampilan tidak perlu diubah sama sekali saat sumbernya berpindah
 * dari berkas ke basis data.
 *
 * Setiap pembaca menyaring dua hal sekaligus: yang belum terbit dan yang sudah
 * dihapus. Satu saja terlewat, draf yang belum siap bisa tampil di halaman
 * publik.
 *
 * Pembacaan artikel sudah tidak ada di sini — halaman publiknya dibuang, dan
 * pembaca yang tidak dirender siapa pun hanya jadi kode yang ikut dibaca tiap
 * kali berkas ini dibuka. Modelnya sendiri utuh, beserta seluruh CMS-nya.
 */
/* --------------------------------------------------------------- Produk --*/

const PRODUK_TERBIT = { dihapusPada: null, status: "TERBIT" } as const;

type BarisProduk = {
  slug: string;
  nama: string;
  namaPanjang: string;
  jenis: "BATUBARA" | "MINERAL";
  ringkas: string;
  deskripsi: string;
  ikon: string;
  peruntukan: string;
  asal: string;
  unggulan: boolean;
  spesifikasi: unknown;
  keunggulan: unknown;
  galeri: unknown;
  mitra: { nama: string; logo: { url: string } | null }[];
  langkah: unknown;
  sampul: { url: string } | null;
};

/** Kolom Json dibaca longgar: bentuknya dijaga di lapisan tulis, dan halaman
 *  publik tidak boleh meledak hanya karena satu grup kosong atau rusak. */
const larik = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

const keProduct = (p: BarisProduk): Product => ({
  slug: p.slug,
  name: p.nama,
  full: p.namaPanjang,
  jenis: p.jenis,
  summary: p.ringkas,
  description: p.deskripsi,
  icon: p.ikon,
  audience: p.peruntukan,
  asal: p.asal,
  specs: larik<Spesifikasi>(p.spesifikasi),
  why: larik(p.keunggulan),
  gallery: larik(p.galeri),
  // Nama dan logo diambil dari baris Mitra, bukan disalin ke tiap produk:
  // satu organisasi memakai beberapa tingkatan, dan salinan pasti berselisih.
  // Mitra tanpa logo dilewati — bingkai kosong terbaca sebagai gambar gagal.
  clients: p.mitra.flatMap((m) =>
    m.logo ? [{ name: m.nama, logo: m.logo.url }] : [],
  ),
  steps: larik(p.langkah),
  cover: p.sampul?.url,
  unggulan: p.unggulan,
});

const PILIH_PRODUK = {
  slug: true,
  nama: true,
  namaPanjang: true,
  jenis: true,
  ringkas: true,
  deskripsi: true,
  ikon: true,
  peruntukan: true,
  asal: true,
  unggulan: true,
  spesifikasi: true,
  keunggulan: true,
  galeri: true,
  mitra: {
    where: { dihapusPada: null },
    orderBy: { urutan: "asc" },
    select: { nama: true, logo: { select: { url: true } } },
  },
  langkah: true,
  sampul: { select: { url: true } },
} as const;

/** Seluruh komoditas terbit, mengikuti urutan yang disetel di CMS. */
export async function produkTerbit(): Promise<Product[]> {
  const baris = await db().produk.findMany({
    where: PRODUK_TERBIT,
    orderBy: [{ urutan: "asc" }, { nama: "asc" }],
    select: PILIH_PRODUK,
  });
  return baris.map(keProduct);
}




/* ----------------------------------------------------------- Anggota tim --*/

const keOrang = (a: {
  nama: string;
  jabatan: string;
  bio: string | null;
  foto: { url: string } | null;
}): Orang => ({
  name: a.nama,
  role: a.jabatan,
  bio: a.bio ?? undefined,
  photo: a.foto?.url,
});

/** Anggota tim per kelompok, mengikuti urutan yang disetel di CMS. */
export async function anggotaTim(kelompok: "PIMPINAN" | "TIM"): Promise<Orang[]> {
  const baris = await db().anggotaTim.findMany({
    where: { kelompok, dihapusPada: null },
    orderBy: [{ urutan: "asc" }, { nama: "asc" }],
    select: {
      nama: true,
      jabatan: true,
      bio: true,
      foto: { select: { url: true } },
    },
  });
  return baris.map(keOrang);
}

/* ==========================================================================
 * Isi halaman
 *
 * Semua yang di bawah ini dulunya literal di lib/site.ts.
 *
 * Setiap pembaca punya cadangan ke nilai statis itu. Alasannya: basis data
 * yang belum ditanami akan membuat halaman publik kosong atau gagal, dan
 * situs yang menampilkan isi bawaan jauh lebih baik daripada situs yang
 * hilang. Yang memberi tahu bahwa basis datanya masih kosong adalah tombol
 * penanam di /admin, bukan halaman depan yang rusak.
 * ========================================================================== */

export type Profil = {
  name: string;
  legalName: string;
  tagline: string;
  nib: string;
  founded: number;
  clientCount: number;
  intro: string;
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  vision: string;
  history: string;
  background: string;
};

/**
 * Profil perusahaan beserta jumlah klien.
 *
 * Jumlah klien datang dari tabel Statistik, bukan dari Perusahaan: itu angka
 * yang berubah sendiri seiring waktu, sementara sisanya data legal yang
 * hampir tidak pernah berubah.
 *
 * Alamat TIDAK ada di sini. Perusahaan punya kantor pusat dan cabang; lihat
 * daftarKantor().
 */
export async function profil(): Promise<Profil> {
  try {
    const p = db();
    const [row, stat] = await Promise.all([
      p.perusahaan.findUnique({ where: { id: "tunggal" } }),
      p.statistik.findUnique({ where: { id: "tunggal" } }),
    ]);
    if (!row) return company;
    return {
      name: row.nama,
      legalName: row.namaLegal,
      tagline: row.tagline,
      nib: row.nib,
      founded: row.berdiri,
      clientCount: stat?.jumlahKlien ?? company.clientCount,
      intro: row.intro,
      phone: row.telepon,
      // Diturunkan, bukan disimpan: nomor yang tersimpan dua kali pasti
      // berselisih suatu saat, dan yang salah justru tautan yang diklik.
      phoneHref: `tel:+62${row.telepon.replace(/^0/, "")}`,
      whatsappHref: row.whatsapp,
      email: row.email,
      vision: row.visi,
      history: row.sejarah,
      background: row.latarBelakang,
    };
  } catch {
    return company;
  }
}

export type Kantor = {
  jenis: "PUSAT" | "CABANG";
  nama: string;
  alamat: string;
  alamatSingkat: string;
  telepon: string | null;
  email: string | null;
  mapsCid: string;
};

/**
 * Kantor perusahaan, pusat lebih dulu.
 *
 * Selalu mengembalikan minimal satu entri: footer dan halaman kontak menyebut
 * alamat, dan daftar kosong di situ membuat situs terlihat tidak punya kantor.
 */
export async function daftarKantor(): Promise<Kantor[]> {
  try {
    const r = await db().kantor.findMany({
      where: HIDUP,
      orderBy: [{ urutan: "asc" }, { nama: "asc" }],
    });
    if (!r.length) return kantor.map((k) => ({ ...k }));
    return r.map((k) => ({
      jenis: k.jenis,
      nama: k.nama,
      alamat: k.alamat,
      alamatSingkat: k.alamatSingkat,
      telepon: k.telepon,
      email: k.email,
      mapsCid: k.mapsCid,
    }));
  } catch {
    return kantor.map((k) => ({ ...k }));
  }
}

/** Kantor pusat. Dipakai footer, SEO, dan JSON-LD, yang hanya boleh menyebut
 *  satu alamat. Jatuh ke entri pertama bila tidak ada yang bertanda PUSAT. */
export async function kantorPusat(): Promise<Kantor> {
  const semua = await daftarKantor();
  return semua.find((k) => k.jenis === "PUSAT") ?? semua[0];
}

export type IsiBeranda = {
  pitaTag: string;
  pitaTeks: string;
  pitaTautan: string;
  judul: string;
  intro: string;
  ctaUtamaLabel: string;
  ctaUtamaLabelPendek: string;
  ctaUtamaHref: string;
  ctaKeduaLabel: string;
  ctaKeduaLabelPendek: string;
  ctaKeduaHref: string;
  manifesto: string;
  fotoSatu: { url: string; alt: string } | null;
  fotoDua: { url: string; alt: string } | null;
};

export async function isiBeranda(): Promise<IsiBeranda> {
  const bawaan: IsiBeranda = {
    ...beranda,
    fotoSatu: { url: beranda.fotoSatu, alt: "" },
    fotoDua: { url: beranda.fotoDua, alt: "" },
  };
  try {
    const row = await db().beranda.findUnique({
      where: { id: "tunggal" },
      include: {
        fotoSatu: { select: { url: true, alt: true } },
        fotoDua: { select: { url: true, alt: true } },
      },
    });
    if (!row) return bawaan;
    return {
      pitaTag: row.pitaTag,
      pitaTeks: row.pitaTeks,
      pitaTautan: row.pitaTautan,
      judul: row.judul,
      intro: row.intro,
      ctaUtamaLabel: row.ctaUtamaLabel,
      ctaUtamaLabelPendek: row.ctaUtamaLabelPendek,
      ctaUtamaHref: row.ctaUtamaHref,
      ctaKeduaLabel: row.ctaKeduaLabel,
      ctaKeduaLabelPendek: row.ctaKeduaLabelPendek,
      ctaKeduaHref: row.ctaKeduaHref,
      manifesto: row.manifesto,
      fotoSatu: row.fotoSatu,
      fotoDua: row.fotoDua,
    };
  } catch {
    return bawaan;
  }
}

const urutBlok = { orderBy: { urutan: "asc" }, where: HIDUP } as const;

/**
 * Foto latar slider hero.
 *
 * Kosong bukan keadaan darurat: hero tetap dirender, hanya tanpa foto, dengan
 * latar gradien saja. Yang TIDAK dilakukan adalah menjatuhkannya ke foto
 * bawaan — situs yang menampilkan foto tambang milik orang lain di halaman
 * depannya jauh lebih merugikan daripada hero polos.
 */
export async function slideHero(): Promise<
  { foto: string; alt: string; keterangan: string | null }[]
> {
  try {
    const r = await db().slide.findMany({
      ...urutBlok,
      include: { foto: { select: { url: true, alt: true } } },
    });
    return r.map((x) => ({
      foto: x.foto.url,
      alt: x.foto.alt,
      keterangan: x.keterangan,
    }));
  } catch {
    return [];
  }
}

/** Nilai perusahaan. Bentuknya sengaja sama dengan `values` yang lama. */
export async function nilaiPerusahaan(): Promise<
  { title: string; body: string; icon: string }[]
> {
  try {
    const r = await db().blokKonten.findMany({ ...urutBlok, where: { ...HIDUP, jenis: "NILAI" } });
    if (!r.length) return [...values];
    return r.map((b) => ({ title: b.judul, body: b.isi, icon: b.ikon ?? "" }));
  } catch {
    return [...values];
  }
}

/**
 * Misi perusahaan sebagai daftar bernomor.
 *
 * `judul` kolomnya yang dipakai, bukan `isi`: tiap butir misi adalah satu
 * kalimat utuh, dan memecahnya jadi judul plus penjelasan berarti mengarang
 * separuhnya.
 */
export async function misiPerusahaan(): Promise<string[]> {
  try {
    const r = await db().blokKonten.findMany({ ...urutBlok, where: { ...HIDUP, jenis: "MISI" } });
    if (!r.length) return [...misi];
    return r.map((b) => b.judul);
  } catch {
    return [...misi];
  }
}

export async function alasanMemilih(): Promise<
  { icon: string; title: string; body: string }[]
> {
  try {
    const r = await db().blokKonten.findMany({ ...urutBlok, where: { ...HIDUP, jenis: "ALASAN" } });
    if (!r.length) return [...alasanKami];
    return r.map((b) => ({ icon: b.ikon ?? "", title: b.judul, body: b.isi }));
  } catch {
    return [...alasanKami];
  }
}

export async function langkah(): Promise<{ title: string; body: string }[]> {
  try {
    const r = await db().blokKonten.findMany({ ...urutBlok, where: { ...HIDUP, jenis: "LANGKAH" } });
    if (!r.length) return [...langkahMulai];
    return r.map((b) => ({ title: b.judul, body: b.isi }));
  } catch {
    return [...langkahMulai];
  }
}

export async function faq(): Promise<{ q: string; a: string }[]> {
  try {
    const r = await db().blokKonten.findMany({ ...urutBlok, where: { ...HIDUP, jenis: "FAQ" } });
    if (!r.length) return [...faqUmum];
    return r.map((b) => ({ q: b.judul, a: b.isi }));
  } catch {
    return [...faqUmum];
  }
}

export async function tonggak(): Promise<
  { tahun: string; judul: string; body: string }[]
> {
  try {
    const r = await db().perjalanan.findMany(urutBlok);
    if (!r.length) return [...perjalanan];
    return r.map((t) => ({ tahun: t.tahun, judul: t.judul, body: t.isi }));
  } catch {
    return [...perjalanan];
  }
}

export async function bidangUsaha(): Promise<string[]> {
  try {
    const r = await db().layanan.findMany(urutBlok);
    if (!r.length) return [...services];
    return r.map((l) => l.nama);
  } catch {
    return [...services];
  }
}

export async function kelompokLayanan(): Promise<
  { title: string; body: string; icon: string; covers: string[] }[]
> {
  try {
    const r = await db().grupLayanan.findMany(urutBlok);
    if (!r.length) return serviceGroups.map((g) => ({ ...g, covers: [...g.covers] }));
    return r.map((g) => ({
      title: g.judul,
      body: g.isi,
      icon: g.ikon,
      covers: larik<string>(g.cakupan),
    }));
  } catch {
    return serviceGroups.map((g) => ({ ...g, covers: [...g.covers] }));
  }
}

/**
 * Proyek yang pernah dijalankan.
 *
 * Hanya yang punya foto yang dikembalikan: bagian ini berupa galeri, dan entri
 * tanpa gambar meninggalkan lubang di kisinya yang terbaca sebagai gambar
 * gagal dimuat, bukan sebagai entri tanpa foto.
 */
export async function daftarProyek(): Promise<
  { judul: string; lokasi: string | null; tahun: string | null; ringkas: string | null; foto: string; alt: string }[]
> {
  try {
    const r = await db().proyek.findMany({
      ...urutBlok,
      include: { foto: { select: { url: true, alt: true } } },
    });
    return r.flatMap((p) =>
      p.foto
        ? [{
            judul: p.judul,
            lokasi: p.lokasi,
            tahun: p.tahun,
            ringkas: p.ringkas,
            foto: p.foto.url,
            alt: p.foto.alt,
          }]
        : [],
    );
  } catch {
    return [];
  }
}

/**
 * Logo klien. Kosong berarti bagiannya menampilkan slot bertanda, bukan logo
 * karangan: menempelkan logo palsu adalah klaim kemitraan, dan yang membacanya
 * justru pihak yang bisa mengeceknya.
 */
export async function logoMitra(): Promise<{ name: string; src: string }[]> {
  try {
    const r = await db().mitra.findMany({
      ...urutBlok,
      include: { logo: { select: { url: true } } },
    });
    return r.flatMap((m) => (m.logo ? [{ name: m.nama, src: m.logo.url }] : []));
  } catch {
    return [];
  }
}

/**
 * Nama klien, dengan atau tanpa logo.
 *
 * Terpisah dari logoMitra: daftar nama tetap bisa ditampilkan sebagai teks
 * selama logonya belum diunggah, dan itu jauh lebih baik daripada bagian klien
 * yang kosong sama sekali padahal namanya sudah ada.
 */
export async function namaMitra(): Promise<{ name: string; sector: string }[]> {
  try {
    const r = await db().mitra.findMany(urutBlok);
    return r.map((m) => ({ name: m.nama, sector: m.sektor }));
  } catch {
    return [];
  }
}

/** Kutipan klien. Kosong sampai ada testimoni sungguhan yang diizinkan tampil. */
export async function kutipanKlien(): Promise<
  { quote: string; name: string; role: string; contoh: boolean }[]
> {
  try {
    const r = await db().testimoni.findMany(urutBlok);
    return r.map((t) => ({
      quote: t.kutipan,
      name: t.nama,
      role: t.organisasi ? `${t.peran}, ${t.organisasi}` : t.peran,
      contoh: t.contoh,
    }));
  } catch {
    return [];
  }
}
