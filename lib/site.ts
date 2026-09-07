/**
 * Sumber tunggal seluruh konten situs, sekaligus data awal yang ditanam tombol
 * benih di /admin. Setelah ditanam, yang dibaca halaman adalah basis data
 * (lihat lib/konten.ts); isi berkas ini menjadi cadangan bila tabelnya masih
 * kosong atau tidak terjangkau.
 *
 * Sumber datanya: Company Profile PT Rajawali Bara Yudha Perkasa 2026 dan NIB
 * 1294000602642. Apa pun yang TIDAK ada di kedua dokumen itu ditandai
 * "PERIKSA" dan ditanam berstatus draf, sehingga tidak pernah tampil di
 * halaman publik sebelum ada yang mengonfirmasinya.
 */

export const company = {
  name: "Rajawali Bara",
  legalName: "PT Rajawali Bara Yudha Perkasa",
  tagline: "Fueling progress with efficiency, precision, and professionalism",
  /** Nomor Induk Berusaha, terbit 24 Juni 2021, perubahan ke-1 6 Agustus 2026. */
  nib: "1294000602642",
  /** Tanggal terbit NIB 1294000602642: 24 Juni 2021. */
  founded: 2021,
  /**
   * Jumlah organisasi yang dilayani. Enam nama disebut di company profile.
   * Satu sumber: angka yang ditulis ulang di beberapa berkas pasti melenceng
   * saat berubah.
   */
  clientCount: 6,
  intro:
    "Perdagangan batubara untuk pembangkit listrik, industri semen, smelter, dan manufaktur — dengan spesifikasi yang disesuaikan permintaan.",
  phone: "081347242614",
  phoneHref: "tel:+6281347242614",
  whatsappHref: "https://wa.me/6281347242614",
  email: "ptrajawalibyp@gmail.com",
  vision:
    "Menjadi perusahaan perdagangan batubara terkemuka dan terpercaya di Indonesia, yang berkontribusi dalam pemenuhan energi nasional dan internasional secara berkelanjutan.",
  history:
    "PT Rajawali Bara Yudha Perkasa berdiri pada 2021 sebagai perusahaan perdagangan batubara, dengan kantor pusat di Jakarta dan kantor cabang di Samarinda, Kalimantan Timur — berdekatan dengan sumber tambang yang dipasoknya.",
  background:
    "Perusahaan ini hadir sebagai mitra energi dengan komitmen terhadap profesionalisme, keberlanjutan, dan kepatuhan terhadap regulasi yang berlaku. Dengan pengalaman dan jaringan yang luas di sektor pertambangan, logistik, dan pemasaran, penyaluran batubara dilakukan secara efisien, tepat waktu, dan sesuai spesifikasi pasar.",
} as const;

/**
 * Kantor perusahaan.
 *
 * Dua alamat sejak awal, jadi ini daftar dan bukan kolom di `company`.
 * Menyimpan salah satunya sebagai "alamat perusahaan" berarti yang lain hidup
 * di tempat lain dan pasti berselisih saat salah satunya pindah.
 *
 * `mapsCid` sengaja kosong. CID hanya ada untuk tempat yang sudah terdaftar di
 * Google Maps, dan menebaknya berarti pin peta jatuh di gedung tetangga.
 * Selama kosong, peta memakai pencarian alamat — kurang presisi, tetapi tidak
 * pernah menunjuk tempat yang salah. Isi CID-nya begitu entri tempatnya ada.
 */
export const kantor = [
  {
    jenis: "PUSAT" as const,
    nama: "Kantor Pusat",
    alamat:
      "Treasury Tower Lantai 17 Unit M, District 8 SCBD, Jl. Senopati Dalam No. 8B, Senayan, Jakarta Selatan 12190",
    alamatSingkat: "SCBD, Jakarta Selatan",
    telepon: null,
    email: null,
    mapsCid: "",
    urutan: 0,
  },
  {
    jenis: "CABANG" as const,
    nama: "Kantor Cabang Samarinda",
    alamat:
      "Jl. Kadrie Oening No. 07 RT. 21, Kelurahan Air Hitam, Kecamatan Samarinda Ulu, Samarinda, Kalimantan Timur 75124",
    alamatSingkat: "Samarinda, Kalimantan Timur",
    telepon: company.phone,
    email: company.email,
    mapsCid: "",
    urutan: 1,
  },
] as const;

/**
 * Teks beranda: pita, judul hero, dua tombol, dan pernyataan manifesto.
 *
 * Label CTA punya dua bentuk: yang panjang tampil dari lebar sm ke atas, yang
 * pendek menggantikannya di layar sempit tempat dua tombol berdampingan tidak
 * muat. Penanda [[...]] pada judul dirender sebagai sorotan warna merek.
 */
export const beranda = {
  pitaTag: `Sejak ${company.founded}`,
  pitaTeks: "Perdagangan batubara domestik & ekspor",
  pitaTautan: "/tentang-kami",
  judul: "Mitra energi Anda yang [[andal dan profesional]]",
  intro: company.intro,
  ctaUtamaLabel: "Lihat Layanan Kami",
  ctaUtamaLabelPendek: "Layanan",
  ctaUtamaHref: "/layanan",
  ctaKeduaLabel: "Profil Perusahaan",
  ctaKeduaLabelPendek: "Profil",
  ctaKeduaHref: "/tentang-kami",
  manifesto:
    "Kami menyediakan batubara berkualitas dari sumber tambang yang telah melalui seleksi, dengan spesifikasi yang dapat disesuaikan permintaan. Didukung logistik darat dan laut yang terintegrasi, pengiriman berlangsung tepat waktu dan minim gangguan.",
  /* Dua foto di blok manifesto. Lihat catatan pada blok FOTO di bawah. */
  fotoSatu: "/foto/beranda-1.webp",
  fotoDua: "/foto/beranda-2.webp",
} as const;

/**
 * Misi perusahaan, lima butir, dari company profile halaman 2.
 *
 * Daftar, bukan satu paragraf: kelimanya bernomor di dokumen aslinya, dan
 * memampatkannya jadi satu kolom teks membuat nomor itu hilang.
 */
export const misi = [
  "Menyediakan produk batubara dengan kualitas terbaik dan sesuai spesifikasi kebutuhan pasar.",
  "Menjalin kemitraan jangka panjang dengan klien melalui kepercayaan, keandalan, dan integritas.",
  "Meningkatkan efisiensi logistik dan distribusi dengan dukungan tim dan sistem yang handal.",
  "Mematuhi peraturan dan standar lingkungan yang berlaku dalam seluruh proses operasional.",
  "Terus berinovasi dalam sistem manajemen, pemasaran, dan pelayanan pelanggan.",
] as const;

/**
 * Nilai perusahaan.
 *
 * Diambil dari taglinenya sendiri — "efficiency, precision, and
 * professionalism" — bukan disusun baru. Tagline itu sudah dipilih perusahaan
 * sebagai ringkasan cara kerjanya; menulis daftar nilai yang berbeda di
 * sebelahnya membuat situs menyebut dua hal untuk pertanyaan yang sama.
 */
export const values = [
  {
    title: "Efisiensi",
    body: "Jalur pasok dan logistik disusun sependek mungkin, sehingga biaya dan waktu tempuh tidak dibebankan ke pembeli tanpa alasan.",
    icon: "Gauge",
  },
  {
    title: "Presisi",
    body: "Spesifikasi yang dijanjikan adalah spesifikasi yang dikirim. Setiap pasokan mengikuti parameter yang disepakati di kontrak.",
    icon: "Target",
  },
  {
    title: "Profesionalisme",
    body: "Setiap transaksi dan pengiriman dijalankan dengan legalitas yang jelas dan mematuhi peraturan yang berlaku.",
    icon: "ShieldCheck",
  },
] as const;

/**
 * Lima kutipan DUMMY.
 *
 * ================== WAJIB DIGANTI SEBELUM SITUS TAYANG ==================
 * Nama orang, jabatan, dan nama perusahaan di bawah ini KARANGAN. Tidak satu
 * pun pernah mengatakannya. Berbeda dari foto stok — yang paling buruk hanya
 * terlihat generik — testimoni bernama adalah klaim yang tidak bisa dibedakan
 * pembaca dari yang asli, dan pembaca situs ini justru bagian pengadaan yang
 * bisa mengangkat telepon untuk mengeceknya.
 *
 * Ganti dengan kutipan yang benar-benar diberikan beserta izin tertulis untuk
 * menampilkan nama dan jabatannya, atau hapus seluruh bagiannya dari beranda.
 * Bagian itu menghilang sendiri begitu tabel testimoni dikosongkan.
 * ========================================================================
 *
 * Kalimatnya sengaja tidak menyebut angka, tonase, atau hasil apa pun: kalau
 * ini terlanjur tayang, yang terbaca setidaknya bukan klaim kinerja yang bisa
 * dibantah dokumen.
 */
export const testimoniContoh = [
  {
    kutipan:
      "Yang kami cari bukan harga paling murah, tapi kargo yang spesifikasinya sama dengan yang tertulis di kontrak. Sejauh ini hasil ujinya cocok.",
    nama: "Bambang Setiawan",
    peran: "Procurement",
    organisasi: "PT Karya Daya Nusantara",
  },
  {
    kutipan:
      "Jadwal pengapalan yang meleset satu minggu berarti stok kami menipis. Komunikasinya jelas dari sebelum muat sampai kapal sandar.",
    nama: "Rina Puspitasari",
    peran: "Kepala Logistik",
    organisasi: "PT Samudra Niaga Utama",
  },
  {
    kutipan:
      "Dokumen asal barang dan legalitasnya lengkap tanpa harus kami kejar. Itu yang membuat proses audit internal kami tidak tersendat.",
    nama: "Hendra Wijaya",
    peran: "Compliance",
    organisasi: "PT Cakra Semen Perkasa",
  },
  {
    kutipan:
      "Saat kebutuhan kalori kami berubah di tengah tahun, penyesuaiannya dibahas dulu, bukan langsung dikirim seadanya.",
    nama: "Dwi Anggraini",
    peran: "Manajer Produksi",
    organisasi: "PT Bumi Manufaktur Sejahtera",
  },
  {
    kutipan:
      "Kami pernah menerima kargo yang moisture-nya di luar batas dari pemasok lain. Di sini hasil uji laboratoriumnya dikirim sebelum barang berangkat.",
    nama: "Yusuf Ramadhan",
    peran: "Quality Control",
    organisasi: "PT Tirta Energi Pratama",
  },
] as const;

/**
 * Sektor klien dan mitra.
 *
 * Satu sumber untuk dua tempat: pilihan di CMS saat menambah mitra, dan label
 * yang tampil di kartunya. Ditulis dua kali, keduanya pasti berselisih suatu
 * saat — dan yang berselisih diam-diam adalah daftar pilihan yang tidak lagi
 * memuat sektor yang sudah tampil di beranda.
 *
 * Menggantikan `tingkatMitra` (Provinsi/Kota/Kabupaten) dari project asal,
 * yang hanya masuk akal untuk klien pemerintahan.
 */
export const sektorMitra = [
  "Industri Pupuk",
  "Energi",
  "Manufaktur",
  "Semen",
  "Smelter",
  "Tambang",
  "Logistik",
] as const;

/**
 * Empat tujuan, dan itu seluruhnya.
 *
 * Katalog spesifikasi (/produk) sengaja TIDAK di sini: seluruh tingkatannya
 * masih berstatus draf sampai angkanya dicocokkan dengan hasil uji
 * laboratorium, dan item menu yang menuju halaman kosong lebih merugikan
 * daripada tidak ada item sama sekali. Halaman Layanan yang menautkannya
 * begitu ada yang diterbitkan.
 *
 * Artikel juga tidak: belum ada satu pun tulisan, dan blog kosong di
 * navigasi utama membuat situs terlihat ditinggalkan. CMS-nya tetap siap.
 */
export const nav = [
  { label: "Home", href: "/" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Layanan", href: "/layanan" },
  { label: "Hubungi Kami", href: "/hubungi-kami" },
] as const;

/** Satu baris di tabel spesifikasi. Nilainya teks, bukan angka: sebagian
 *  parameter ditulis sebagai rentang ("4.200 – 4.400") atau batas ("maks. 1"),
 *  dan memaksanya jadi bilangan menutup keduanya. */

/* ===========================================================================
 * FOTO
 *
 * Dua sumber, dan pembagiannya mengikuti isi gambarnya sendiri:
 *
 *   lokal()    Gambar buatan yang disiapkan untuk perusahaan ini, disimpan di
 *              public/foto. Seluruhnya adegan darat — pit, pemuatan, hauling,
 *              stockpile — dan di situlah ia dipakai.
 *
 *   unsplash() Foto stok, dipakai HANYA untuk tahap yang tidak ada di set
 *              buatan: tekstur batubara, contoh uji, tongkang dan kapal, serta
 *              pembangkit sebagai pengguna akhir. Menggantinya dengan adegan
 *              pit yang lain akan membuat rantai pasok kehilangan separuh
 *              ceritanya.
 *
 * Keduanya tetap BUKAN dokumentasi operasi yang sebenarnya. Keterangan foto
 * karena itu menyebut TAHAP, bukan lokasi atau proyek tertentu — begitu ada
 * foto lapangan yang asli, keterangannya boleh menyebut tempat yang benar.
 *
 * Berkas lokal ikut di dalam repo, bukan di folder unggahan: folder unggahan
 * kosong di server yang baru, dan gambar beranda yang hilang pada deploy
 * pertama adalah kegagalan yang tidak perlu ada.
 * ======================================================================== */

const lokal = (berkas: string) => `/foto/${berkas}`;

const unsplash = (id: string, lebar = 1600) =>
  `https://images.unsplash.com/${id}?w=${lebar}&q=75&auto=format&fit=crop`;

/**
 * Tiga foto latar hero, berurut mengikuti perjalanan barangnya sendiri:
 * tambang, pemuatan, pengapalan. Urutan itu yang membuat slider bercerita
 * alih-alih sekadar berganti gambar.
 */
export const fotoHero = [
  {
    url: lokal("hero-1-armada.webp"),
    alt: "Dump truck tambang besar dan grader di jalan angkut tambang terbuka",
    keterangan: "Armada di jalan angkut",
  },
  {
    url: lokal("hero-2-pemuatan.webp"),
    alt: "Ekskavator memuat batubara ke dump truck di jenjang tambang",
    keterangan: "Pemuatan di jenjang tambang",
  },
  {
    url: lokal("hero-3-jalan-angkut.webp"),
    alt: "Dump truck tambang bermuatan melintasi jalan angkut",
    keterangan: "Hauling ke stockpile",
  },
  {
    // Satu-satunya slide dari stok, dan disengaja: tiga slide pertama semuanya
    // adegan darat, dan hero yang berakhir di tambang tidak pernah sampai ke
    // bagian yang justru membedakan pedagang dari penambang.
    url: unsplash("photo-1728614425921-604f1f61d41c", 1920),
    alt: "Kapal curah bersandar di dermaga muat",
    keterangan: "Pengapalan curah",
  },
] as const;

/** Foto pendamping tiap kelompok layanan, dicocokkan lewat judulnya. */
export const fotoLayanan: Record<string, { url: string; alt: string }> = {
  "Perdagangan Batubara Domestik & Internasional": {
    url: unsplash("photo-1663340246051-23e504a32320", 1200),
    alt: "Bongkahan batubara memenuhi bingkai",
  },
  "Manajemen Logistik & Pengapalan": {
    url: unsplash("photo-1602009775595-f35cf45d9f33", 1200),
    alt: "Kapal kargo bersandar di dermaga dengan derek muat",
  },
  "Pemenuhan Kebutuhan Energi Industri": {
    url: unsplash("photo-1578776349090-de61da00ff1a", 1200),
    alt: "Pembangkit listrik tenaga uap di tepi perairan",
  },
};

export const fotoTentang = [
  {
    url: lokal("tentang-1.webp"),
    alt: "Shovel tambang memuat dump truck besar di area penambangan batubara",
  },
  {
    url: lokal("tentang-2.webp"),
    alt: "Ekskavator memuat beberapa dump truck di lokasi tambang terbuka",
  },
] as const;

/**
 * Rantai pasok, enam tahap dari tambang sampai pembeli.
 *
 * Ini yang menggantikan bagian "Proyek Kami" di company profile. Sepuluh foto
 * di dokumen itu tidak punya satu pun keterangan lokasi, tahun, atau klien —
 * dan menuliskannya sendiri berarti mengarang riwayat pekerjaan. Yang bisa
 * dijelaskan dengan jujur adalah alurnya, dan justru itu yang paling berguna:
 * pembeli baru sering tidak tahu apa persisnya yang dikerjakan seorang trader
 * di antara tambang dan boiler mereka.
 *
 * Struktur, bukan konten editorial — enam tahap ini tidak berubah — jadi ia
 * tinggal di kode, sejalan dengan aturan di CONTENT-MODEL.md.
 */
export const rantaiPasok = [
  {
    tahap: "Sumber",
    judul: "Seleksi tambang",
    isi: "Tambang pemasok dipilih dari kesesuaian spesifikasi dan kelengkapan dokumen asal barangnya, bukan dari harga saja.",
    foto: lokal("rantai-1-seleksi.webp"),
    alt: "Ekskavator memuat dump truck di jenjang batubara tambang terbuka",
  },
  {
    tahap: "Uji",
    judul: "Analisis laboratorium",
    isi: "Kalori, total moisture, abu, dan sulfur diuji sebelum kargo bergerak. Hasilnya menyertai penawaran, bukan menyusul setelahnya.",
    foto: unsplash("photo-1767633411248-e8ca80a8fbd4", 900),
    alt: "Contoh bongkahan batubara di atas karung goni",
  },
  {
    tahap: "Darat",
    judul: "Hauling ke stockpile",
    isi: "Pengangkutan dari mulut tambang ke stockpile atau pelabuhan muat, lewat mitra transportasi yang sudah berjalan rutin.",
    foto: lokal("rantai-3-hauling.webp"),
    alt: "Dua dump truck tambang beriringan di jalan angkut",
  },
  {
    tahap: "Muat",
    judul: "Stockpile dan pemuatan",
    isi: "Penumpukan, pencampuran bila spesifikasinya menuntut, lalu pemuatan ke tongkang di bawah pengawasan surveyor independen.",
    foto: lokal("rantai-4-stockpile.webp"),
    alt: "Dump truck menumpahkan muatan di atas stockpile batubara",
  },
  {
    tahap: "Laut",
    judul: "Tongkang dan kapal",
    isi: "Pengapalan ke titik serah yang disepakati, dengan laporan muat dan perkiraan sandar yang diperbarui bila jadwalnya bergeser.",
    foto: unsplash("photo-1704110826560-cb9d3772c04c", 900),
    alt: "Kapal curah dan derek di kolam pelabuhan",
  },
  {
    tahap: "Serah",
    judul: "Bongkar di pembeli",
    isi: "Serah terima di lokasi pembeli, dengan hasil uji bongkar sebagai dasar penyelesaian akhir bila kontraknya mensyaratkan.",
    foto: unsplash("photo-1578776349090-de61da00ff1a", 900),
    alt: "Pembangkit listrik tenaga uap sebagai pengguna akhir batubara",
  },
] as const;

export type Spesifikasi = {
  parameter: string;
  nilai: string;
  satuan: string;
};

export type Product = {
  slug: string;
  /** Nama pendek untuk kartu dan menu, misalnya "GAR 4200". */
  name: string;
  /** Nama lengkap untuk judul halaman. */
  full: string;
  jenis: "BATUBARA" | "MINERAL";
  summary: string;
  description: string;
  icon: string;
  /** Sektor yang memakainya. */
  audience: string;
  /**
   * Asal tambang beserta legalitasnya. Yang pertama ditanyakan pembeli
   * institusional setelah spesifikasi, karena dokumen asal barang menentukan
   * apakah kargonya bisa lolos audit mereka sendiri.
   *
   * KOSONG = bagian itu tidak dirender. Bukan diisi klaim yang belum bisa
   * dibuktikan dokumennya.
   */
  asal: string;
  /**
   * Tabel spesifikasi teknis. Inilah yang dicari pembeli lebih dulu, sebelum
   * paragraf pemasaran apa pun — jadi ini satu-satunya bagian yang wajib.
   */
  specs: Spesifikasi[];
  /** Keunggulan tingkatan ini sendiri, bukan keunggulan perusahaan. */
  why: { icon: string; title: string; body: string }[];
  /**
   * Foto kargo dan operasinya.
   *
   * KOSONG = halaman menampilkan slot bertanda, bukan menyembunyikan
   * bagiannya. Isi larik ini dan bagian itu berubah sendiri tanpa ubah kode.
   */
  gallery?: { src: string; caption: string }[];
  /**
   * Pembeli yang memakai tingkatan ini.
   *
   * KOSONG = slot bertanda, bukan logo karangan. Menempelkan logo palsu di
   * sini adalah klaim kemitraan, dan yang membacanya justru pihak yang bisa
   * mengeceknya.
   */
  clients?: { name: string; logo: string }[];
  /** Alur pemesanan khusus tingkatan ini. Kosongkan untuk memakai
   *  `langkahMulai` yang berlaku umum. */
  steps?: { title: string; body: string }[];
  cover?: string;
  /** Ditonjolkan sebagai kartu besar. Ditandai sendiri, bukan disimpulkan dari
   *  ada tidaknya sampul. */
  unggulan?: boolean;
};

/* ===========================================================================
 * PERINGATAN — ANGKA SPESIFIKASI DI BAWAH INI BELUM DIKONFIRMASI
 *
 * Company profile menyebut "spesifikasi GAR yang dapat disesuaikan sesuai
 * permintaan" tanpa satu pun angka. Empat tingkatan di bawah adalah RENTANG
 * RUJUKAN PASAR batubara Kalimantan yang lazim diperdagangkan — bukan katalog
 * yang dikonfirmasi perusahaan.
 *
 * Spesifikasi batubara adalah janji kontraktual: selisih 200 kcal atau 1%
 * total moisture bisa membatalkan kargo dan memicu penalti. Karena itu
 * keempatnya ditanam berstatus DRAF dan TIDAK PERNAH tampil di halaman publik
 * sampai ada yang menerbitkannya dari /admin.
 *
 * Sebelum diterbitkan: cocokkan setiap baris dengan hasil uji laboratorium
 * dari tambang pemasok yang sebenarnya, lalu hapus catatan ini.
 * ======================================================================== */
export const products: Product[] = [
  {
    slug: "gar-4200",
    name: "GAR 4200",
    full: "Batubara Kalori Rendah GAR 4200 kcal/kg",
    jenis: "BATUBARA",
    summary:
      "Tingkatan kalori rendah untuk PLTU mulut tambang dan pembangkit yang boiler-nya dirancang untuk batubara muda.",
    description:
      "Batubara sub-bituminus dengan nilai kalor sekitar 4.200 kcal/kg basis GAR. Kandungan abu dan sulfurnya rendah, sehingga beban penanganan residu pembakaran lebih ringan, dengan konsekuensi total moisture yang tinggi. Tingkatan ini paling ekonomis per ton, tetapi perlu boiler yang memang dirancang untuknya.",
    icon: "Flame",
    audience: "PLTU mulut tambang, pembangkit captive industri",
    asal: "",
    specs: [
      { parameter: "Nilai kalor (GAR)", nilai: "4.200 – 4.400", satuan: "kcal/kg" },
      { parameter: "Total moisture (ARB)", nilai: "34 – 38", satuan: "%" },
      { parameter: "Kadar abu (ADB)", nilai: "maks. 6", satuan: "%" },
      { parameter: "Total sulfur (ADB)", nilai: "maks. 0,3", satuan: "%" },
      { parameter: "Ukuran", nilai: "0 – 50", satuan: "mm" },
    ],
    why: [
      {
        icon: "Wallet",
        title: "Biaya energi per ton paling rendah",
        body: "Untuk boiler yang memang dirancang menerima batubara muda, tingkatan ini memberi biaya per kalori yang paling ringan di antara empat tingkatan.",
      },
      {
        icon: "Wind",
        title: "Abu dan sulfur rendah",
        body: "Beban penanganan abu serta emisi belerang lebih ringan, sehingga biaya pengelolaan residu ikut turun.",
      },
      {
        icon: "MapPin",
        title: "Dekat sumber",
        body: "Dipasok dari tambang Kalimantan Timur, dengan jalur hauling dan pemuatan yang sudah berjalan rutin.",
      },
    ],
    unggulan: false,
  },
  {
    slug: "gar-4600",
    name: "GAR 4600",
    full: "Batubara Kalori Menengah GAR 4600 kcal/kg",
    jenis: "BATUBARA",
    summary:
      "Tingkatan paling banyak diminta pasar domestik: kalori cukup untuk sebagian besar boiler industri tanpa harga tingkatan tinggi.",
    description:
      "Batubara sub-bituminus dengan nilai kalor sekitar 4.600 kcal/kg basis GAR. Kombinasi kalori dan total moisture-nya membuat tingkatan ini bisa diterima sebagian besar boiler industri tanpa penyesuaian berarti, dan menjadi acuan volume terbesar di pasar domestik.",
    icon: "Factory",
    audience: "PLTU, industri semen, pabrik manufaktur",
    asal: "",
    specs: [
      { parameter: "Nilai kalor (GAR)", nilai: "4.600 – 4.800", satuan: "kcal/kg" },
      { parameter: "Total moisture (ARB)", nilai: "30 – 34", satuan: "%" },
      { parameter: "Kadar abu (ADB)", nilai: "maks. 6", satuan: "%" },
      { parameter: "Total sulfur (ADB)", nilai: "maks. 0,5", satuan: "%" },
      { parameter: "Ukuran", nilai: "0 – 50", satuan: "mm" },
    ],
    why: [
      {
        icon: "Scale",
        title: "Titik tengah kalori dan harga",
        body: "Cukup tinggi untuk sebagian besar boiler industri, tanpa selisih harga tingkatan atas.",
      },
      {
        icon: "Repeat",
        title: "Pasokan paling stabil",
        body: "Tingkatan dengan volume perdagangan terbesar, sehingga ketersediaannya paling kecil kemungkinan tersendat.",
      },
      {
        icon: "SlidersHorizontal",
        title: "Bisa disesuaikan",
        body: "Parameter dapat digeser mengikuti kebutuhan boiler, dibahas sebelum kontrak dan bukan setelah kargo berangkat.",
      },
    ],
    unggulan: false,
  },
  {
    slug: "gar-5000",
    name: "GAR 5000",
    full: "Batubara Kalori Menengah GAR 5000 kcal/kg",
    jenis: "BATUBARA",
    summary:
      "Kalori lebih tinggi dengan moisture lebih rendah, untuk yang membayar ongkos angkut per ton dan bukan per kalori.",
    description:
      "Batubara sub-bituminus dengan nilai kalor sekitar 5.000 kcal/kg basis GAR dan total moisture yang lebih rendah. Setiap ton membawa lebih banyak energi, sehingga ongkos angkut dan ruang stockpile yang dibutuhkan untuk kebutuhan energi yang sama menjadi lebih kecil.",
    icon: "Zap",
    audience: "Industri semen, smelter, ekspor regional",
    asal: "",
    specs: [
      { parameter: "Nilai kalor (GAR)", nilai: "5.000 – 5.200", satuan: "kcal/kg" },
      { parameter: "Total moisture (ARB)", nilai: "24 – 28", satuan: "%" },
      { parameter: "Kadar abu (ADB)", nilai: "maks. 8", satuan: "%" },
      { parameter: "Total sulfur (ADB)", nilai: "maks. 0,8", satuan: "%" },
      { parameter: "Ukuran", nilai: "0 – 50", satuan: "mm" },
    ],
    why: [
      {
        icon: "TrendingUp",
        title: "Energi lebih padat per ton",
        body: "Kebutuhan energi yang sama dipenuhi dengan tonase lebih kecil, sehingga ongkos angkut dan ruang stockpile ikut turun.",
      },
      {
        icon: "Droplets",
        title: "Moisture lebih rendah",
        body: "Penanganan di stockpile lebih ringan, dan kehilangan energi untuk menguapkan air di dalam boiler berkurang.",
      },
      {
        icon: "Ship",
        title: "Layak untuk ekspor regional",
        body: "Rasio kalori terhadap tonase membuat tingkatan ini masih ekonomis untuk pengapalan jarak menengah.",
      },
    ],
    unggulan: false,
  },
  {
    slug: "gar-5800",
    name: "GAR 5800",
    full: "Batubara Kalori Tinggi GAR 5800 kcal/kg",
    jenis: "BATUBARA",
    summary:
      "Tingkatan tertinggi yang rutin diperdagangkan dari Kalimantan, untuk proses yang menuntut suhu tinggi dan abu rendah.",
    description:
      "Batubara bituminus dengan nilai kalor sekitar 5.800 kcal/kg basis GAR. Kalori tinggi dengan moisture rendah membuatnya sesuai untuk proses yang menuntut suhu tinggi dan konsistensi pembakaran, termasuk smelter dan kiln semen.",
    icon: "Gem",
    audience: "Smelter, kiln semen, ekspor",
    asal: "",
    specs: [
      { parameter: "Nilai kalor (GAR)", nilai: "5.800 – 6.000", satuan: "kcal/kg" },
      { parameter: "Total moisture (ARB)", nilai: "14 – 18", satuan: "%" },
      { parameter: "Kadar abu (ADB)", nilai: "maks. 10", satuan: "%" },
      { parameter: "Total sulfur (ADB)", nilai: "maks. 1,0", satuan: "%" },
      { parameter: "Ukuran", nilai: "0 – 50", satuan: "mm" },
    ],
    why: [
      {
        icon: "Flame",
        title: "Suhu pembakaran tinggi",
        body: "Sesuai untuk kiln dan tanur yang menuntut suhu stabil di kisaran atas.",
      },
      {
        icon: "PackageCheck",
        title: "Tonase paling efisien",
        body: "Kebutuhan energi terpenuhi dengan tonase paling kecil, sehingga biaya logistik per satuan energi paling rendah.",
      },
      {
        icon: "Globe2",
        title: "Diterima pasar ekspor",
        body: "Kisaran kalori yang lazim diminta pembeli di luar negeri untuk batubara asal Indonesia.",
      },
    ],
    unggulan: false,
  },
];

/** Bilangan satu sampai sepuluh dalam kata; di atas itu memakai angka. */
const KATA_BILANGAN = [
  "Nol", "Satu", "Dua", "Tiga", "Empat", "Lima",
  "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh",
];

/**
 * Angka dalam kata, dipakai di kalimat yang menyebut jumlah. Diturunkan dari
 * data, bukan diketik, supaya tidak melenceng saat jumlahnya berubah.
 */
export const bilangan = (n: number) => KATA_BILANGAN[n] ?? String(n);

/**
 * Bidang usaha resmi sesuai NIB 1294000602642.
 *
 * Teks KBLI apa adanya, bukan bahasa pemasaran: daftar ini yang dirujuk saat
 * calon pembeli institusional memeriksa legalitas. Yang tampil ke pengunjung
 * sebagai bahasa sehari-hari adalah `serviceGroups` di bawah.
 */
export const services = [
  "KBLI 46710 — Perdagangan Besar Bahan Bakar Padat, Cair, dan Gas beserta Produk Terkait",
  "KBLI 46610 — Perdagangan Besar Bahan Bakar Padat, Cair dan Gas dan Produk YBDI",
] as const;

/**
 * Testimoni klien.
 *
 * SENGAJA KOSONG. Nama, jabatan, dan kutipan karangan adalah testimoni palsu,
 * dan pembaca situs ini adalah perusahaan yang bisa memverifikasinya. Selama
 * daftar ini kosong, section testimoni menampilkan slot bertanda.
 *
 * Isi dengan kutipan yang benar-benar diberikan, lengkap dengan izin tertulis
 * untuk menampilkan nama dan jabatannya.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Kutipan contoh untuk menilai desain, bukan kutipan siapa pun. Dirender
   *  bergaris putus-putus supaya tidak terbaca sebagai testimoni sungguhan. */
  contoh: boolean;
};

export const testimonials: Testimonial[] = [];

/**
 * "Layanan Kami" dari company profile halaman 3. Tiga kelompok, bernomor di
 * dokumen aslinya.
 *
 * `covers` adalah butir yang dicakup tiap kelompok. Ditulis pendek karena
 * dirender sebagai chip di kartu beranda: kalimat KBLI yang panjang membungkus
 * jadi tiga baris dan membuat satu kartu jauh lebih tinggi dari tetangganya.
 * Ketertelusuran ke bidang usaha resmi tetap ada, di bagian Bidang Usaha pada
 * halaman Layanan.
 */
export const serviceGroups = [
  {
    title: "Perdagangan Batubara Domestik & Internasional",
    body: "Batubara berkualitas dari berbagai sumber tambang terpercaya, dengan spesifikasi GAR yang dapat disesuaikan sesuai permintaan, untuk kebutuhan dalam negeri maupun ekspor.",
    icon: "Flame",
    covers: ["Pasar domestik", "Ekspor", "Spesifikasi GAR disesuaikan"],
  },
  {
    title: "Manajemen Logistik & Pengapalan",
    body: "Layanan logistik darat dan laut untuk memastikan pengiriman batubara berjalan dengan aman, lancar, dan efisien hingga ke lokasi tujuan.",
    icon: "Ship",
    covers: ["Hauling darat", "Tongkang & pengapalan", "Stockpile & pemuatan"],
  },
  {
    title: "Pemenuhan Kebutuhan Energi Industri",
    body: "Pasokan batubara untuk berbagai sektor industri yang membutuhkan energi berbasis batubara secara berkelanjutan.",
    icon: "Factory",
    covers: [
      "Pembangkit listrik",
      "Industri semen",
      "Smelter dan industri berat",
      "Pabrik manufaktur",
    ],
  },
] as const;

/**
 * Logo klien untuk strip kepercayaan.
 * Kosong sampai asetnya diunggah lewat CMS. Komponennya menampilkan slot
 * bertanda, bukan logo karangan.
 */
export const clientLogos: { name: string; src: string }[] = [];

/**
 * Klien yang disebut di company profile halaman 5.
 *
 * Nama saja, tanpa logo: logonya ada di dokumen itu tetapi belum diunggah
 * sebagai berkas, dan menautkan logo pihak lain dari sumber luar berarti
 * gambarnya bisa berubah atau hilang tanpa sepengetahuan siapa pun.
 * Unggah logonya lewat /admin/media, lalu sambungkan di /admin/mitra.
 */
export const klienAwal = [
  { nama: "PT Pupuk Indonesia", sektor: "Industri Pupuk" },
  { nama: "PT Pupuk Sriwidjaja Palembang", sektor: "Industri Pupuk" },
  { nama: "PT Pupuk Kujang", sektor: "Industri Pupuk" },
  { nama: "PT Pupuk Kalimantan Timur", sektor: "Industri Pupuk" },
  { nama: "PT Energi Unggul Persada", sektor: "Energi" },
  { nama: "PT Petrokimia Gresik", sektor: "Manufaktur" },
] as const;

/**
 * Satu orang di perusahaan. `photo` sengaja opsional: selama kosong, halaman
 * menampilkan slot bertanda dengan inisial, bukan menyembunyikan orangnya.
 */
export type Orang = {
  name: string;
  role: string;
  photo?: string;
  /** Hanya dipakai kartu pimpinan. Kosong = kartu tampil tanpa paragraf. */
  bio?: string;
};

/**
 * Struktur organisasi, dari company profile halaman 6.
 *
 * `photo` sengaja TIDAK diisi. Ini nama orang sungguhan: potret stok yang
 * ditempelkan pada nama seseorang akan terbaca sebagai wajah orang itu, dan
 * itu keliru dengan cara yang tidak bisa dibela. Unggah foto aslinya lewat
 * /admin/media lalu sambungkan di /admin/tim, atau biarkan kartunya tampil
 * dengan inisial.
 */
export const leadership: Orang[] = [
  { name: "Ari Aswin", role: "Komisaris Utama" },
  { name: "Fathiah Olpah Siara", role: "Direktur Utama" },
  { name: "Lussius Edwin Suwarna", role: "Direktur Keuangan" },
];

/**
 * Anggota tim di luar jajaran direksi.
 *
 * Kosong: company profile hanya memuat struktur organisasi tingkat direksi.
 * Tambahkan lewat /admin/tim bila memang ada yang ingin ditampilkan.
 */
export const team: Orang[] = [];

/**
 * "Proyek Kami".
 *
 * Kosong. Company profile halaman 6 memuat sepuluh foto operasi tanpa satu pun
 * keterangan lokasi, tahun, atau klien — dan menuliskan keterangan sendiri di
 * bawah foto orang lain berarti mengarang riwayat pekerjaan.
 *
 * Unggah fotonya lewat /admin/media, lalu buat entrinya beserta keterangan
 * yang benar. Selama kosong, bagian ini menampilkan slot bertanda.
 */
export const proyekAwal: {
  judul: string;
  lokasi?: string;
  tahun?: string;
  ringkas?: string;
}[] = [];

export type BlokArtikel =
  | { jenis: "paragraf"; teks: string }
  | { jenis: "subjudul"; teks: string }
  | { jenis: "sorotan"; teks: string }
  | { jenis: "daftar"; butir: string[] };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  /** Naskah lengkap. Kosong berarti halaman memakai NASKAH_CONTOH. */
  body?: BlokArtikel[];
  cover?: string;
};

/**
 * Artikel.
 *
 * Kosong. Tidak ada satu pun tulisan di dokumen sumber, dan artikel karangan
 * yang membawa nama perusahaan jauh lebih merugikan daripada halaman artikel
 * yang masih kosong.
 */
export const articles: Article[] = [];

/**
 * Kategori artikel yang ditanam sebagai data induk.
 *
 * Ditanam meski belum ada artikelnya: penyuntingan artikel mewajibkan kategori,
 * jadi tanpa ini tulisan pertama tidak bisa disimpan sama sekali.
 */
export const kategoriAwal = [
  { nama: "Pasar Batubara", slug: "pasar-batubara" },
  { nama: "Operasional", slug: "operasional" },
  { nama: "Regulasi", slug: "regulasi" },
  { nama: "Perusahaan", slug: "perusahaan" },
] as const;

export const NASKAH_CONTOH: BlokArtikel[] = [
  {
    jenis: "paragraf",
    teks: "Naskah artikel ini belum diisi. Yang tampil sekarang adalah contoh untuk menilai tata letaknya, bukan tulisan yang sebenarnya.",
  },
  { jenis: "subjudul", teks: "Bagian dengan subjudul" },
  {
    jenis: "paragraf",
    teks: "Setiap artikel disusun dari blok: paragraf, subjudul, sorotan, dan daftar. Blok itu yang menjaga tampilannya tetap konsisten tanpa perlu ada yang mengatur gaya satu per satu.",
  },
  {
    jenis: "sorotan",
    teks: "Blok sorotan untuk kalimat yang perlu berdiri sendiri.",
  },
  {
    jenis: "daftar",
    butir: [
      "Butir pertama dalam daftar.",
      "Butir kedua, untuk menguji jarak antar barisnya.",
      "Butir ketiga.",
    ],
  },
];

export const naskahArtikel = (a: Article) => a.body ?? NASKAH_CONTOH;

/** Kategori yang benar-benar dipakai artikel, bukan daftar yang diketik ulang. */
export const kategoriArtikel = () =>
  [...new Set(articles.map((a) => a.category))].sort((a, b) =>
    a.localeCompare(b, "id"),
  );

/**
 * Alur dari permintaan pertama sampai kargo diterima.
 *
 * Tombol "Minta Penawaran" adalah lompatan gelap kalau pembaca tidak tahu apa
 * yang terjadi sesudahnya, dan keraguan itu yang menahan orang mengklik.
 *
 * PERIKSA: ini rangkaian yang lazim dalam perdagangan batubara, bukan catatan
 * proses perusahaan yang sebenarnya. Cocokkan dengan cara kerja tim sebelum
 * halaman ini tayang.
 */
export const langkahMulai = [
  {
    title: "Permintaan dan spesifikasi",
    body: "Anda menyebut kebutuhan kalori, tonase, jadwal, dan titik serah. Dari situ kami tahu tingkatan mana yang cocok dan tambang mana yang bisa memasoknya.",
  },
  {
    title: "Penawaran dan hasil uji",
    body: "Penawaran dikirim beserta hasil uji laboratorium dari kargo yang dimaksud, bukan spesifikasi umum. Perbedaan parameter dibahas di tahap ini, bukan setelah kapal berangkat.",
  },
  {
    title: "Kontrak dan dokumen asal barang",
    body: "Kontrak memuat parameter yang disepakati beserta toleransinya. Dokumen legalitas dan asal barang diserahkan bersamaan, supaya audit internal Anda tidak tersendat di kemudian hari.",
  },
  {
    title: "Pemuatan dan pengapalan",
    body: "Pemuatan diawasi surveyor independen. Anda menerima laporan muat dan perkiraan sandar, lalu diperbarui bila jadwalnya bergeser.",
  },
  {
    title: "Serah terima dan penyelesaian",
    body: "Kargo diserahkan di titik yang disepakati, dengan hasil uji bongkar sebagai dasar penyelesaian akhir bila kontraknya mensyaratkan.",
  },
] as const;

/**
 * Pertanyaan yang berlaku untuk semua tingkatan, ditulis sekali di sini.
 *
 * PERIKSA: jawaban soal harga, tonase minimum, dan lama pengiriman sengaja
 * tidak menyebut angka, karena angkanya memang belum ada di dokumen sumber.
 * Kalau perusahaan punya kisaran yang boleh disebut, menyebutnya akan jauh
 * lebih meyakinkan daripada kalimat ini.
 */
export const faqUmum = [
  {
    q: "Apakah spesifikasinya bisa disesuaikan?",
    a: "Bisa. Kalori, total moisture, abu, sulfur, dan ukuran dibahas mengikuti kebutuhan boiler atau proses Anda, lalu dituangkan sebagai parameter kontrak beserta toleransinya.",
  },
  {
    q: "Berapa tonase minimum per pengiriman?",
    a: "Bergantung pada titik serah dan moda angkutnya. Tonase minimum kami sebutkan bersama penawaran, setelah lokasi tujuan dan jadwalnya jelas.",
  },
  {
    q: "Bagaimana kualitasnya dipastikan?",
    a: "Melalui uji laboratorium sebelum pemuatan dan pengawasan surveyor independen saat muat. Hasilnya diserahkan sebagai bagian dari dokumen kargo, bukan atas permintaan.",
  },
  {
    q: "Dokumen apa saja yang menyertai kargo?",
    a: "Dokumen asal barang, hasil uji laboratorium, dan dokumen pengangkutan sesuai ketentuan yang berlaku. Kelengkapan ini yang menentukan kargo bisa lolos audit internal pembeli.",
  },
  {
    q: "Apakah melayani ekspor?",
    a: "Ya. Perdagangan domestik maupun ekspor dilayani, dengan tingkatan kalori yang menyesuaikan pasar tujuan.",
  },
  {
    q: "Bagaimana kalau spesifikasi yang diterima tidak sesuai kontrak?",
    a: "Kontrak memuat toleransi beserta mekanisme penyesuaian harga atau penolakan kargo. Dasarnya hasil uji bongkar, bukan penilaian sepihak salah satu pihak.",
  },
] as const;

/**
 * "Keunggulan Kami" dari company profile halaman 4. Lima butir.
 *
 * Ini alasan tingkat perusahaan, berlaku untuk seluruh tingkatan komoditas —
 * berbeda dari `why` di tiap produk, yang bicara tentang tingkatan itu sendiri.
 */
export const alasanKami = [
  {
    icon: "BadgeCheck",
    title: "Kualitas batubara terjamin",
    body: "Batubara hanya diambil dari sumber tambang yang telah melalui proses seleksi. Setiap pasokan memiliki spesifikasi yang sesuai standar industri dan dapat disesuaikan dengan kebutuhan klien.",
  },
  {
    icon: "Clock",
    title: "Pengiriman tepat waktu & efisien",
    body: "Didukung sistem logistik darat dan laut yang terintegrasi, proses pengiriman berlangsung tepat waktu, efisien, dan minim gangguan.",
  },
  {
    icon: "Network",
    title: "Jaringan penambang & mitra logistik yang luas",
    body: "Kerja sama dengan berbagai tambang dan mitra transportasi terpercaya memungkinkan kelancaran suplai dalam berbagai kondisi operasional.",
  },
  {
    icon: "FileCheck",
    title: "Legalitas lengkap & kepatuhan regulasi",
    body: "Setiap transaksi dan pengiriman dijalankan dengan legalitas yang jelas dan mematuhi seluruh peraturan yang berlaku, memberikan rasa aman bagi setiap mitra bisnis.",
  },
  {
    icon: "Headset",
    title: "Layanan profesional & responsif",
    body: "Tim yang terdiri dari tenaga ahli berpengalaman, siap memberikan solusi secara cepat, akurat, dan responsif terhadap setiap kebutuhan.",
  },
] as const;

/**
 * Tonggak perjalanan perusahaan.
 *
 * PERIKSA. Hanya butir 2021 dan 2026 yang berpijak pada dokumen: keduanya dari
 * NIB 1294000602642 (terbit 24 Juni 2021, perubahan ke-1 pada 6 Agustus 2026)
 * dan alamat kantor di company profile. Tonggak di antaranya belum ada pada
 * saya, dan mengarangnya berarti menulis riwayat perusahaan orang lain.
 *
 * Tambahkan tonggak yang sebenarnya lewat /admin/halaman.
 */
export const perjalanan = [
  {
    tahun: "2021",
    judul: "Perusahaan berdiri",
    body: `${company.legalName} memperoleh NIB pada 24 Juni 2021 sebagai perusahaan perdagangan besar bahan bakar padat.`,
  },
  {
    tahun: "2026",
    judul: "Kantor pusat di Jakarta",
    body: "Kantor pusat berkedudukan di Treasury Tower, District 8 SCBD, Jakarta Selatan, dengan kantor cabang di Samarinda yang berdekatan dengan sumber tambang.",
  },
] as const;

export const footerLinks = {
  perusahaan: [
    { label: "Tentang Kami", href: "/tentang-kami" },
    { label: "Visi & Misi", href: "/tentang-kami#visi-misi" },
    { label: "Keunggulan", href: "/tentang-kami#keunggulan" },
    { label: "Struktur Organisasi", href: "/tentang-kami#tim" },
  ],
  /**
   * Jangkar ke tiap blok di halaman Layanan, bukan halaman tersendiri.
   * Id-nya dihasilkan dari urutan blok itu sendiri (layanan-1, layanan-2, …),
   * jadi menambah kelompok layanan di CMS tidak membuat tautan ini menunjuk
   * jangkar yang tidak ada — yang keempat tinggal ditambahkan di sini.
   */
  layanan: [
    { label: "Perdagangan Batubara", href: "/layanan#layanan-1" },
    { label: "Logistik & Pengapalan", href: "/layanan#layanan-2" },
    { label: "Energi Industri", href: "/layanan#layanan-3" },
    { label: "Spesifikasi", href: "/layanan#spesifikasi" },
  ],
};
