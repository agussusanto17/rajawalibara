import type { Orang, Product, Spesifikasi } from "@/lib/site";
import * as naskahId from "@/lib/site";
import * as naskahEn from "@/lib/site.en";
import { pilih, pilihJson, type Bahasa } from "@/lib/bahasa";
import { HIDUP } from "@/lib/cms/saring";
import { db } from "@/lib/db";

/**
 * Naskah cadangan untuk satu bahasa.
 *
 * Dipakai ketika tabelnya masih kosong atau basis datanya tidak terjangkau.
 * Bentuk kedua modul dijamin sama oleh tipe `Teks<>` di lib/site.en.ts, jadi
 * pemilihan di sini tidak perlu memeriksa keberadaan field satu per satu.
 */
const naskah = (bahasa: Bahasa) => (bahasa === "en" ? naskahEn : naskahId);

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
  namaEn: string | null;
  namaPanjangEn: string | null;
  ringkasEn: string | null;
  deskripsiEn: string | null;
  peruntukanEn: string | null;
  asalEn: string | null;
  spesifikasiEn: unknown;
  keunggulanEn: unknown;
  mitra: { nama: string; logo: { url: string } | null }[];
  langkah: unknown;
  sampul: { url: string } | null;
};

/** Kolom Json dibaca longgar: bentuknya dijaga di lapisan tulis, dan halaman
 *  publik tidak boleh meledak hanya karena satu grup kosong atau rusak. */
const larik = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

const keProduct = (bahasa: Bahasa, p: BarisProduk): Product => ({
  slug: p.slug,
  name: pilih(bahasa, p.nama, p.namaEn),
  full: pilih(bahasa, p.namaPanjang, p.namaPanjangEn),
  jenis: p.jenis,
  summary: pilih(bahasa, p.ringkas, p.ringkasEn),
  description: pilih(bahasa, p.deskripsi, p.deskripsiEn),
  icon: p.ikon,
  audience: pilih(bahasa, p.peruntukan, p.peruntukanEn),
  asal: pilih(bahasa, p.asal, p.asalEn),
  specs: pilihJson(bahasa, larik<Spesifikasi>(p.spesifikasi), p.spesifikasiEn),
  why: pilihJson(bahasa, larik(p.keunggulan), p.keunggulanEn),
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
  namaEn: true,
  namaPanjangEn: true,
  ringkasEn: true,
  deskripsiEn: true,
  peruntukanEn: true,
  asalEn: true,
  spesifikasiEn: true,
  keunggulanEn: true,
  mitra: {
    where: { dihapusPada: null },
    orderBy: { urutan: "asc" },
    select: { nama: true, logo: { select: { url: true } } },
  },
  langkah: true,
  sampul: { select: { url: true } },
} as const;

/** Seluruh komoditas terbit, mengikuti urutan yang disetel di CMS. */
export async function produkTerbit(bahasa: Bahasa): Promise<Product[]> {
  const baris = await db().produk.findMany({
    where: PRODUK_TERBIT,
    orderBy: [{ urutan: "asc" }, { nama: "asc" }],
    select: PILIH_PRODUK,
  });
  return baris.map((b) => keProduct(bahasa, b));
}




/* ----------------------------------------------------------- Anggota tim --*/

const keOrang = (
  bahasa: Bahasa,
  a: {
    nama: string;
    jabatan: string;
    bio: string | null;
    jabatanEn: string | null;
    bioEn: string | null;
    foto: { url: string } | null;
  },
): Orang => ({
  name: a.nama,
  role: pilih(bahasa, a.jabatan, a.jabatanEn),
  bio: a.bio ? pilih(bahasa, a.bio, a.bioEn) : undefined,
  photo: a.foto?.url,
});

/** Anggota tim per kelompok, mengikuti urutan yang disetel di CMS. */
export async function anggotaTim(
  bahasa: Bahasa,
  kelompok: "PIMPINAN" | "TIM",
): Promise<Orang[]> {
  const baris = await db().anggotaTim.findMany({
    where: { kelompok, dihapusPada: null },
    orderBy: [{ urutan: "asc" }, { nama: "asc" }],
    select: {
      nama: true,
      jabatan: true,
      bio: true,
      jabatanEn: true,
      bioEn: true,
      foto: { select: { url: true } },
    },
  });
  return baris.map((b) => keOrang(bahasa, b));
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
export async function profil(bahasa: Bahasa): Promise<Profil> {
  try {
    const p = db();
    const [row, stat] = await Promise.all([
      p.perusahaan.findUnique({ where: { id: "tunggal" } }),
      p.statistik.findUnique({ where: { id: "tunggal" } }),
    ]);
    if (!row) return naskah(bahasa).company;
    return {
      name: row.nama,
      legalName: row.namaLegal,
      tagline: pilih(bahasa, row.tagline, row.taglineEn),
      nib: row.nib,
      founded: row.berdiri,
      clientCount: stat?.jumlahKlien ?? naskah(bahasa).company.clientCount,
      intro: pilih(bahasa, row.intro, row.introEn),
      phone: row.telepon,
      // Diturunkan, bukan disimpan: nomor yang tersimpan dua kali pasti
      // berselisih suatu saat, dan yang salah justru tautan yang diklik.
      phoneHref: `tel:+62${row.telepon.replace(/^0/, "")}`,
      whatsappHref: row.whatsapp,
      email: row.email,
      vision: pilih(bahasa, row.visi, row.visiEn),
      history: pilih(bahasa, row.sejarah, row.sejarahEn),
      background: pilih(bahasa, row.latarBelakang, row.latarBelakangEn),
    };
  } catch {
    return naskah(bahasa).company;
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
export async function daftarKantor(bahasa: Bahasa): Promise<Kantor[]> {
  try {
    const r = await db().kantor.findMany({
      where: HIDUP,
      orderBy: [{ urutan: "asc" }, { nama: "asc" }],
    });
    if (!r.length) return naskah(bahasa).kantor.map((k) => ({ ...k }));
    return r.map((k) => ({
      jenis: k.jenis,
      nama: pilih(bahasa, k.nama, k.namaEn),
      alamat: pilih(bahasa, k.alamat, k.alamatEn),
      alamatSingkat: pilih(bahasa, k.alamatSingkat, k.alamatSingkatEn),
      telepon: k.telepon,
      email: k.email,
      mapsCid: k.mapsCid,
    }));
  } catch {
    return naskah(bahasa).kantor.map((k) => ({ ...k }));
  }
}

/** Kantor pusat. Dipakai footer, SEO, dan JSON-LD, yang hanya boleh menyebut
 *  satu alamat. Jatuh ke entri pertama bila tidak ada yang bertanda PUSAT. */
export async function kantorPusat(bahasa: Bahasa): Promise<Kantor> {
  const semua = await daftarKantor(bahasa);
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

export async function isiBeranda(bahasa: Bahasa): Promise<IsiBeranda> {
  const b = naskah(bahasa).beranda;
  const bawaan: IsiBeranda = {
    ...b,
    fotoSatu: { url: b.fotoSatu, alt: "" },
    fotoDua: { url: b.fotoDua, alt: "" },
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
      pitaTag: pilih(bahasa, row.pitaTag, row.pitaTagEn),
      pitaTeks: pilih(bahasa, row.pitaTeks, row.pitaTeksEn),
      pitaTautan: row.pitaTautan,
      judul: pilih(bahasa, row.judul, row.judulEn),
      intro: pilih(bahasa, row.intro, row.introEn),
      ctaUtamaLabel: pilih(bahasa, row.ctaUtamaLabel, row.ctaUtamaLabelEn),
      ctaUtamaLabelPendek: pilih(
        bahasa,
        row.ctaUtamaLabelPendek,
        row.ctaUtamaLabelPendekEn,
      ),
      ctaUtamaHref: row.ctaUtamaHref,
      ctaKeduaLabel: pilih(bahasa, row.ctaKeduaLabel, row.ctaKeduaLabelEn),
      ctaKeduaLabelPendek: pilih(
        bahasa,
        row.ctaKeduaLabelPendek,
        row.ctaKeduaLabelPendekEn,
      ),
      ctaKeduaHref: row.ctaKeduaHref,
      manifesto: pilih(bahasa, row.manifesto, row.manifestoEn),
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
export async function slideHero(
  bahasa: Bahasa,
): Promise<{ foto: string; alt: string; keterangan: string | null }[]> {
  try {
    const r = await db().slide.findMany({
      ...urutBlok,
      include: { foto: { select: { url: true, alt: true } } },
    });
    return r.map((x) => ({
      foto: x.foto.url,
      alt: x.foto.alt,
      keterangan: x.keterangan
        ? pilih(bahasa, x.keterangan, x.keteranganEn)
        : null,
    }));
  } catch {
    return [];
  }
}

/** Nilai perusahaan. Bentuknya sengaja sama dengan `values` yang lama. */
export async function nilaiPerusahaan(
  bahasa: Bahasa,
): Promise<{ title: string; body: string; icon: string }[]> {
  const cadangan = () => [...naskah(bahasa).values];
  try {
    const r = await db().blokKonten.findMany({ ...urutBlok, where: { ...HIDUP, jenis: "NILAI" } });
    if (!r.length) return cadangan();
    return r.map((b) => ({
      title: pilih(bahasa, b.judul, b.judulEn),
      body: pilih(bahasa, b.isi, b.isiEn),
      icon: b.ikon ?? "",
    }));
  } catch {
    return cadangan();
  }
}

/**
 * Misi perusahaan sebagai daftar bernomor.
 *
 * `judul` kolomnya yang dipakai, bukan `isi`: tiap butir misi adalah satu
 * kalimat utuh, dan memecahnya jadi judul plus penjelasan berarti mengarang
 * separuhnya.
 */
export async function misiPerusahaan(bahasa: Bahasa): Promise<string[]> {
  const cadangan = () => [...naskah(bahasa).misi];
  try {
    const r = await db().blokKonten.findMany({ ...urutBlok, where: { ...HIDUP, jenis: "MISI" } });
    if (!r.length) return cadangan();
    return r.map((b) => pilih(bahasa, b.judul, b.judulEn));
  } catch {
    return cadangan();
  }
}

export async function alasanMemilih(
  bahasa: Bahasa,
): Promise<{ icon: string; title: string; body: string }[]> {
  const cadangan = () => [...naskah(bahasa).alasanKami];
  try {
    const r = await db().blokKonten.findMany({ ...urutBlok, where: { ...HIDUP, jenis: "ALASAN" } });
    if (!r.length) return cadangan();
    return r.map((b) => ({
      icon: b.ikon ?? "",
      title: pilih(bahasa, b.judul, b.judulEn),
      body: pilih(bahasa, b.isi, b.isiEn),
    }));
  } catch {
    return cadangan();
  }
}

export async function langkah(
  bahasa: Bahasa,
): Promise<{ title: string; body: string }[]> {
  const cadangan = () => [...naskah(bahasa).langkahMulai];
  try {
    const r = await db().blokKonten.findMany({ ...urutBlok, where: { ...HIDUP, jenis: "LANGKAH" } });
    if (!r.length) return cadangan();
    return r.map((b) => ({
      title: pilih(bahasa, b.judul, b.judulEn),
      body: pilih(bahasa, b.isi, b.isiEn),
    }));
  } catch {
    return cadangan();
  }
}

export async function faq(bahasa: Bahasa): Promise<{ q: string; a: string }[]> {
  const cadangan = () => [...naskah(bahasa).faqUmum];
  try {
    const r = await db().blokKonten.findMany({ ...urutBlok, where: { ...HIDUP, jenis: "FAQ" } });
    if (!r.length) return cadangan();
    return r.map((b) => ({
      q: pilih(bahasa, b.judul, b.judulEn),
      a: pilih(bahasa, b.isi, b.isiEn),
    }));
  } catch {
    return cadangan();
  }
}

export async function tonggak(
  bahasa: Bahasa,
): Promise<{ tahun: string; judul: string; body: string }[]> {
  const cadangan = () => [...naskah(bahasa).perjalanan];
  try {
    const r = await db().perjalanan.findMany(urutBlok);
    if (!r.length) return cadangan();
    return r.map((t) => ({
      tahun: t.tahun,
      judul: pilih(bahasa, t.judul, t.judulEn),
      body: pilih(bahasa, t.isi, t.isiEn),
    }));
  } catch {
    return cadangan();
  }
}

export async function bidangUsaha(bahasa: Bahasa): Promise<string[]> {
  const cadangan = () => [...naskah(bahasa).services];
  try {
    const r = await db().layanan.findMany(urutBlok);
    if (!r.length) return cadangan();
    return r.map((l) => pilih(bahasa, l.nama, l.namaEn));
  } catch {
    return cadangan();
  }
}

export async function kelompokLayanan(
  bahasa: Bahasa,
): Promise<{ title: string; body: string; icon: string; covers: string[] }[]> {
  const cadangan = () =>
    naskah(bahasa).serviceGroups.map((g) => ({ ...g, covers: [...g.covers] }));
  try {
    const r = await db().grupLayanan.findMany(urutBlok);
    if (!r.length) return cadangan();
    return r.map((g) => ({
      title: pilih(bahasa, g.judul, g.judulEn),
      body: pilih(bahasa, g.isi, g.isiEn),
      icon: g.ikon,
      covers: pilihJson(bahasa, larik<string>(g.cakupan), g.cakupanEn),
    }));
  } catch {
    return cadangan();
  }
}

/**
 * Proyek yang pernah dijalankan.
 *
 * Hanya yang punya foto yang dikembalikan: bagian ini berupa galeri, dan entri
 * tanpa gambar meninggalkan lubang di kisinya yang terbaca sebagai gambar
 * gagal dimuat, bukan sebagai entri tanpa foto.
 */
export async function daftarProyek(bahasa: Bahasa): Promise<
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
            judul: pilih(bahasa, p.judul, p.judulEn),
            lokasi: p.lokasi ? pilih(bahasa, p.lokasi, p.lokasiEn) : null,
            tahun: p.tahun,
            ringkas: p.ringkas ? pilih(bahasa, p.ringkas, p.ringkasEn) : null,
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
export async function namaMitra(
  bahasa: Bahasa,
): Promise<{ name: string; sector: string }[]> {
  try {
    const r = await db().mitra.findMany(urutBlok);
    return r.map((m) => ({
      name: m.nama,
      sector: pilih(bahasa, m.sektor, m.sektorEn),
    }));
  } catch {
    return [];
  }
}

/** Kutipan klien. Kosong sampai ada testimoni sungguhan yang diizinkan tampil. */
export async function kutipanKlien(
  bahasa: Bahasa,
): Promise<{ quote: string; name: string; role: string; contoh: boolean }[]> {
  try {
    const r = await db().testimoni.findMany(urutBlok);
    return r.map((t) => {
      const peran = pilih(bahasa, t.peran, t.peranEn);
      return {
        quote: pilih(bahasa, t.kutipan, t.kutipanEn),
        name: t.nama,
        role: t.organisasi ? `${peran}, ${t.organisasi}` : peran,
        contoh: t.contoh,
      };
    });
  } catch {
    return [];
  }
}
