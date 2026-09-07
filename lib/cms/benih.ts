import {
  alasanKami,
  articles,
  beranda,
  company,
  faqUmum,
  fotoHero,
  kantor,
  kategoriAwal,
  klienAwal,
  langkahMulai,
  leadership,
  misi,
  naskahArtikel,
  perjalanan,
  products,
  proyekAwal,
  serviceGroups,
  services,
  team,
  testimoniContoh,
  values,
} from "@/lib/site";
import { db } from "@/lib/db";
import { keSlug } from "@/lib/cms/skema";

/**
 * Mengisi basis data kosong dari lib/site.ts.
 *
 * Berada di dalam aplikasi, bukan sebagai skrip terpisah. Di shared hosting
 * tidak selalu ada akses SSH, dan `tsx` beserta devDependencies-nya belum tentu
 * terpasang di sana — sementara data awalnya SUDAH ikut terbundel bersama
 * aplikasi. Tombolnya ada di /admin.
 *
 * Idempoten seluruhnya: dikenali lewat slug, nama, dan judul. Menjalankannya
 * dua kali tidak menggandakan apa pun, jadi aman ditekan berulang kalau ragu.
 *
 * Pemeriksaan "sudah ada" sengaja TIDAK menyaring baris terhapus. Butir yang
 * dihapus dari CMS berarti memang tidak diinginkan, dan menyaringnya membuat
 * baris itu lolos pemeriksaan lalu ditanam ulang sebagai salinan kedua — jadi
 * menekan tombol ini akan menghidupkan kembali apa yang sengaja dibuang.
 */
export type LaporanBenih = {
  kategori: number;
  artikel: number;
  produk: number;
  anggota: number;
  media: number;
  kantor: number;
  mitra: number;
  proyek: number;
  slide: number;
  perusahaan: boolean;
  statistik: boolean;
  beranda: boolean;
  blok: number;
  perjalanan: number;
  layanan: number;
  testimoni: number;
  grupLayanan: number;
  catatan: string[];
};

export async function tanamBenih(): Promise<LaporanBenih> {
  const p = db();
  const catatan: string[] = [];

  const laporan: LaporanBenih = {
    kategori: 0, artikel: 0, produk: 0, anggota: 0, media: 0,
    kantor: 0, mitra: 0, proyek: 0, slide: 0,
    perusahaan: false, statistik: false, beranda: false,
    blok: 0, perjalanan: 0, layanan: 0, grupLayanan: 0, testimoni: 0, catatan,
  };

  /* ---------------------------------------------------------- Perusahaan */
  const adaPerusahaan = await p.perusahaan.findUnique({ where: { id: "tunggal" } });
  if (!adaPerusahaan) {
    await p.perusahaan.create({
      data: {
        id: "tunggal",
        nama: company.name,
        namaLegal: company.legalName,
        tagline: company.tagline,
        nib: company.nib,
        berdiri: company.founded,
        intro: company.intro,
        telepon: company.phone,
        whatsapp: company.whatsappHref,
        email: company.email,
        visi: company.vision,
        sejarah: company.history,
        latarBelakang: company.background,
      },
    });
    laporan.perusahaan = true;
  }

  if (!(await p.statistik.findUnique({ where: { id: "tunggal" } }))) {
    await p.statistik.create({
      data: { id: "tunggal", jumlahKlien: company.clientCount },
    });
    laporan.statistik = true;
  }

  /* -------------------------------------------------------------- Kantor */
  for (const k of kantor) {
    if (await p.kantor.findFirst({ where: { nama: k.nama } })) continue;
    await p.kantor.create({
      data: {
        jenis: k.jenis,
        nama: k.nama,
        alamat: k.alamat,
        alamatSingkat: k.alamatSingkat,
        telepon: k.telepon,
        email: k.email,
        mapsCid: k.mapsCid,
        urutan: k.urutan,
      },
    });
    laporan.kantor++;
  }

  /* ------------------------------------- Media: gambar yang hanya ditautkan */
  const media = new Map<string, string>();

  /**
   * Mencatat gambar dari alamat luar tanpa menyalin berkasnya.
   *
   * `kunci` dibiarkan kosong, dan itulah yang membedakannya dari unggahan
   * sendiri: berkas yang bukan milik kita tidak pernah dihapus dari disk saat
   * barisnya dihapus, karena tidak ada berkas kita di sana untuk dihapus.
   */
  const catatMediaLuar = async (url: string, alt: string) => {
    const ada = await p.media.findFirst({ where: { url } });
    if (ada) {
      media.set(url, ada.id);
      return;
    }
    const baris = await p.media.create({
      data: { kunci: null, url, alt, tipe: "image/jpeg", ukuran: 0 },
    });
    media.set(url, baris.id);
    laporan.media++;
  };

  for (const a of articles) {
    if (a.cover) await catatMediaLuar(a.cover, "");
  }
  for (const url of [beranda.fotoSatu, beranda.fotoDua]) {
    await catatMediaLuar(url, "Foto stok sementara, ganti dengan dokumentasi sendiri");
  }
  for (const f of fotoHero) await catatMediaLuar(f.url, f.alt);
  for (const o of [...leadership, ...team]) {
    // Sengaja tidak mendeskripsikan wajahnya: ini bukan foto orang yang
    // namanya tertera, jadi deskripsi apa pun akan keliru.
    if (o.photo) await catatMediaLuar(o.photo, "Potret sementara, wajib diganti foto asli");
  }

  /* ------------------------------------------------------------- Kategori */
  // Ditanam dari daftar tetap, bukan diturunkan dari artikel: tabel artikel
  // masih kosong, dan penyuntingan artikel mewajibkan kategori — tanpa ini
  // tulisan pertama tidak bisa disimpan sama sekali.
  const kategori = new Map<string, string>();
  for (const [i, k] of kategoriAwal.entries()) {
    const ada = await p.kategoriArtikel.findUnique({ where: { nama: k.nama } });
    if (ada) {
      kategori.set(k.nama, ada.id);
      continue;
    }
    const baris = await p.kategoriArtikel.create({
      data: { nama: k.nama, slug: k.slug, urutan: i },
    });
    laporan.kategori++;
    kategori.set(k.nama, baris.id);
  }

  /* -------------------------------------------------------------- Artikel */
  for (const a of articles) {
    if (await p.artikel.findUnique({ where: { slug: a.slug } })) continue;
    // Kategori artikel yang belum ada di daftar induk dibuat menyusul, supaya
    // satu artikel tidak menggagalkan seluruh penanaman.
    let kategoriId = kategori.get(a.category);
    if (!kategoriId) {
      const baru = await p.kategoriArtikel.create({
        data: { nama: a.category, slug: keSlug(a.category), urutan: kategori.size },
      });
      kategoriId = baru.id;
      kategori.set(a.category, baru.id);
      laporan.kategori++;
    }
    await p.artikel.create({
      data: {
        slug: a.slug,
        judul: a.title,
        ringkas: a.excerpt,
        isi: naskahArtikel(a),
        kategoriId,
        status: "TERBIT",
        terbitPada: new Date(a.date),
        sampulId: a.cover ? (media.get(a.cover) ?? null) : null,
      },
    });
    laporan.artikel++;
  }

  /* ---------------------------------------------------- Produk/komoditas */
  //
  // Ditanam berstatus DRAF, BUKAN TERBIT.
  //
  // Angka spesifikasinya adalah rentang rujukan pasar, bukan katalog yang
  // dikonfirmasi perusahaan (lihat peringatan di lib/site.ts). Spesifikasi
  // batubara adalah janji kontraktual: selisih 200 kcal bisa membatalkan
  // kargo. Menanamnya sebagai TERBIT berarti angka yang belum diperiksa
  // siapa pun langsung tayang di halaman publik pada detik seed ditekan.
  for (const [i, x] of products.entries()) {
    if (await p.produk.findUnique({ where: { slug: x.slug } })) continue;
    await p.produk.create({
      data: {
        slug: x.slug,
        nama: x.name,
        namaPanjang: x.full,
        jenis: x.jenis,
        ringkas: x.summary,
        deskripsi: x.description,
        ikon: x.icon,
        peruntukan: x.audience,
        asal: x.asal,
        urutan: i,
        status: "DRAF",
        spesifikasi: x.specs,
        keunggulan: x.why,
        galeri: x.gallery ?? [],
        langkah: x.steps ?? [],
        sampulId: x.cover ? (media.get(x.cover) ?? null) : null,
        unggulan: false,
      },
    });
    laporan.produk++;
  }

  /* ---------------------------------------------------------- Anggota tim */
  const orang = [
    ...leadership.map((o) => ({ ...o, kelompok: "PIMPINAN" as const })),
    ...team.map((o) => ({ ...o, kelompok: "TIM" as const })),
  ];
  for (const [i, o] of orang.entries()) {
    if (await p.anggotaTim.findFirst({ where: { nama: o.name } })) continue;
    await p.anggotaTim.create({
      data: {
        nama: o.name,
        jabatan: o.role,
        kelompok: o.kelompok,
        bio: o.bio ?? null,
        urutan: i,
        fotoId: o.photo ? (media.get(o.photo) ?? null) : null,
      },
    });
    laporan.anggota++;
  }

  /* ---------------------------------------------------------------- Mitra */
  // Nama saja, tanpa logo. Logonya ada di company profile tetapi belum
  // diunggah sebagai berkas; sambungkan lewat /admin/mitra setelah diunggah.
  for (const [i, m] of klienAwal.entries()) {
    if (await p.mitra.findFirst({ where: { nama: m.nama } })) continue;
    await p.mitra.create({ data: { nama: m.nama, sektor: m.sektor, urutan: i } });
    laporan.mitra++;
  }

  /* ---------------------------------------------------------------- Slide */
  // Foto latar hero. Dikenali lewat fotoId supaya menekan tombol benih dua
  // kali tidak menumpuk slide yang sama.
  for (const [i, f] of fotoHero.entries()) {
    const fotoId = media.get(f.url);
    if (!fotoId) continue;
    if (await p.slide.findFirst({ where: { fotoId } })) continue;
    await p.slide.create({
      data: { fotoId, keterangan: f.keterangan, urutan: i },
    });
    laporan.slide++;
  }

  /* --------------------------------------------------------------- Proyek */
  for (const [i, x] of proyekAwal.entries()) {
    if (await p.proyek.findFirst({ where: { judul: x.judul } })) continue;
    await p.proyek.create({
      data: {
        judul: x.judul,
        lokasi: x.lokasi ?? null,
        tahun: x.tahun ?? null,
        ringkas: x.ringkas ?? null,
        urutan: i,
      },
    });
    laporan.proyek++;
  }

  /* -------------------------------------------------------------- Beranda */
  if (!(await p.beranda.findUnique({ where: { id: "tunggal" } }))) {
    await p.beranda.create({
      data: {
        id: "tunggal",
        pitaTag: beranda.pitaTag,
        pitaTeks: beranda.pitaTeks,
        pitaTautan: beranda.pitaTautan,
        judul: beranda.judul,
        intro: beranda.intro,
        ctaUtamaLabel: beranda.ctaUtamaLabel,
        ctaUtamaLabelPendek: beranda.ctaUtamaLabelPendek,
        ctaUtamaHref: beranda.ctaUtamaHref,
        ctaKeduaLabel: beranda.ctaKeduaLabel,
        ctaKeduaLabelPendek: beranda.ctaKeduaLabelPendek,
        ctaKeduaHref: beranda.ctaKeduaHref,
        manifesto: beranda.manifesto,
        fotoSatuId: media.get(beranda.fotoSatu) ?? null,
        fotoDuaId: media.get(beranda.fotoDua) ?? null,
      },
    });
    laporan.beranda = true;
  }

  /* --------------------------------------------------------- Blok konten */
  // Dikenali lewat pasangan jenis + judul: judul di dalam satu jenis unik,
  // dan memakai judul saja akan menabrakkan butir yang kebetulan senama di
  // jenis yang berbeda.
  const tanamBlok = async (
    jenis: "NILAI" | "MISI" | "ALASAN" | "LANGKAH" | "FAQ",
    butir: { ikon?: string; judul: string; isi: string }[],
  ) => {
    for (const [i, b] of butir.entries()) {
      const ada = await p.blokKonten.findFirst({
        where: { jenis, judul: b.judul },
      });
      if (ada) continue;
      await p.blokKonten.create({
        data: { jenis, ikon: b.ikon ?? null, judul: b.judul, isi: b.isi, urutan: i },
      });
      laporan.blok++;
    }
  };

  await tanamBlok("NILAI", values.map((v) => ({ ikon: v.icon, judul: v.title, isi: v.body })));
  // Misi hanya punya kalimatnya sendiri: `isi` dikosongkan, bukan diisi
  // penjelasan karangan yang tidak ada di company profile.
  await tanamBlok("MISI", misi.map((m) => ({ judul: m, isi: "" })));
  await tanamBlok("ALASAN", alasanKami.map((v) => ({ ikon: v.icon, judul: v.title, isi: v.body })));
  await tanamBlok("LANGKAH", langkahMulai.map((v) => ({ judul: v.title, isi: v.body })));
  await tanamBlok("FAQ", faqUmum.map((v) => ({ judul: v.q, isi: v.a })));

  /* ----------------------------------------------------------- Perjalanan */
  for (const [i, t] of perjalanan.entries()) {
    const ada = await p.perjalanan.findFirst({
      where: { tahun: t.tahun, judul: t.judul },
    });
    if (ada) continue;
    await p.perjalanan.create({
      data: { tahun: t.tahun, judul: t.judul, isi: t.body, urutan: i },
    });
    laporan.perjalanan++;
  }

  /* ------------------------------------------------------------ Testimoni */
  // Ditanam TANPA tanda `contoh`, jadi tampil seperti testimoni biasa.
  //
  // Penandanya tetap ada di model dan di CMS — nyalakan saja untuk membuat
  // satu kartu tampil bergaris putus-putus. Yang menjaga kutipan karangan ini
  // tidak ikut tayang sekarang tinggal daftar periksa di README, jadi
  // periksalah daftar itu sebelum NEXT_PUBLIC_SITE_LIVE dinyalakan.
  for (const [i, t] of testimoniContoh.entries()) {
    const ada = await p.testimoni.findFirst({ where: { kutipan: t.kutipan } });
    if (ada) continue;
    await p.testimoni.create({
      data: {
        kutipan: t.kutipan,
        nama: t.nama,
        peran: t.peran,
        organisasi: t.organisasi,
        contoh: false,
        urutan: i,
      },
    });
    laporan.testimoni++;
  }

  /* -------------------------------------------------------------- Layanan */
  for (const [i, nama] of services.entries()) {
    if (await p.layanan.findUnique({ where: { nama } })) continue;
    await p.layanan.create({ data: { nama, urutan: i } });
    laporan.layanan++;
  }

  for (const [i, g] of serviceGroups.entries()) {
    const ada = await p.grupLayanan.findFirst({ where: { judul: g.title } });
    if (ada) continue;
    await p.grupLayanan.create({
      data: {
        ikon: g.icon,
        judul: g.title,
        isi: g.body,
        cakupan: [...g.covers],
        urutan: i,
      },
    });
    laporan.grupLayanan++;
  }

  /* -------------------------------------------------------------- Catatan */
  if (laporan.produk > 0) {
    catatan.push(
      `${laporan.produk} komoditas ditanam sebagai DRAF: angka spesifikasinya rentang rujukan pasar, bukan katalog yang sudah dikonfirmasi. Cocokkan dengan hasil uji laboratorium tambang pemasok sebelum diterbitkan.`,
    );
  }
  if (laporan.mitra > 0) {
    catatan.push(
      `${laporan.mitra} klien ditanam tanpa logo. Unggah logonya lewat /admin/media lalu sambungkan di /admin/mitra — selama kosong, strip klien menampilkan nama sebagai teks.`,
    );
  }
  if (laporan.testimoni > 0) {
    catatan.push(
      `${laporan.testimoni} testimoni ditanam sebagai DUMMY dan tampil seperti kutipan biasa. Nama orang dan nama perusahaannya karangan — ganti dengan kutipan yang benar-benar diberikan, atau kosongkan tabelnya supaya bagiannya hilang dari beranda.`,
    );
  }
  if (laporan.anggota > 0) {
    catatan.push(
      `${laporan.anggota} orang ditanam tanpa foto. Kartunya tampil dengan inisial sampai foto aslinya diunggah.`,
    );
  }
  catatan.push(
    "Seluruh foto masih stok Unsplash, termasuk tiga foto slider hero. Ganti lewat /admin/media dan /admin/pengaturan → Slider hero.",
  );

  return laporan;
}
