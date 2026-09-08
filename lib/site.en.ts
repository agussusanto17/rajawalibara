/**
 * Naskah bahasa Inggris, cerminan lib/site.ts.
 *
 * Berkas ini menampung copy statis. Konten yang bisa diedit lewat CMS punya
 * kolom EN sendiri di basis data (lihat prisma/schema.prisma); isi di sini
 * yang ditanam ke kolom itu saat seed, sekaligus menjadi cadangan bila
 * kolomnya masih kosong.
 *
 * Setiap ekspor diikat ke bentuk padanannya di site.ts lewat `Teks<>`. Tipe
 * itu melebarkan literal menjadi string tetapi mempertahankan kuncinya, jadi
 * menambah satu field di site.ts tanpa menerjemahkannya di sini membuat
 * build gagal. Dua bahasa yang melenceng diam-diam adalah cara paling umum
 * situs dwibahasa membusuk.
 *
 * Yang TIDAK diterjemahkan, dan itu disengaja:
 *   - nama orang, nama perusahaan, dan alamat fisik — itu penanda, bukan teks;
 *   - kode KBLI — klasifikasi resmi Indonesia, angkanya tetap, hanya
 *     keterangannya yang dialihbahasakan;
 *   - istilah dagang batubara (GAR, ARB, ADB, total moisture) — sudah bahasa
 *     Inggris di kontrak aslinya.
 *
 * Yang WAJIB berubah dan mudah terlewat: format angka. Indonesia menulis
 * "4.200" dan "0,3"; Inggris menulis "4,200" dan "0.3". Salah titik-koma di
 * tabel spesifikasi mengubah 0,3% jadi 3‰ di mata pembaca asing.
 */

import type { Teks } from "./bahasa";
import type { Orang, Product } from "./site";
import * as id from "./site";

/* ========================================================================= */
/* PERUSAHAAN                                                                */
/* ========================================================================= */

export const company: Teks<typeof id.company> = {
  name: "Rajawali Bara",
  legalName: "PT Rajawali Bara Yudha Perkasa",
  tagline: "Fueling progress with efficiency, precision, and professionalism",
  nib: "1294000602642",
  founded: 2021,
  clientCount: 6,
  intro:
    "Coal trading for power plants, cement producers, smelters, and manufacturers — with specifications matched to what you actually burn.",
  phone: "081347242614",
  phoneHref: "tel:+6281347242614",
  whatsappHref: "https://wa.me/6281347242614",
  email: "ptrajawalibyp@gmail.com",
  vision:
    "To become a leading and trusted coal trading company in Indonesia, contributing to national and international energy supply on a sustainable basis.",
  history:
    "PT Rajawali Bara Yudha Perkasa was established in 2021 as a coal trading company, with its head office in Jakarta and a branch office in Samarinda, East Kalimantan — close to the mines it draws from.",
  background:
    "The company operates as an energy partner committed to professionalism, sustainability, and regulatory compliance. Backed by experience and a wide network across mining, logistics, and marketing, coal is delivered efficiently, on schedule, and to the specification the market requires.",
};

/**
 * Nama kantor diterjemahkan; alamatnya tidak.
 *
 * Alamat fisik dipakai orang untuk sampai ke tempatnya — kurir, tamu, dan
 * aplikasi peta membacanya dalam bahasa aslinya. Menerjemahkan "Jl." menjadi
 * "St." membuat alamat yang tidak bisa dicari. Yang dialihbahasakan hanya
 * keterangan wilayahnya, karena itu memang untuk pembaca.
 */
/**
 * `jenis` dipersempit kembali ke union aslinya.
 *
 * `Teks<>` melebarkan setiap literal string menjadi `string` — benar untuk
 * kalimat yang diterjemahkan, salah untuk penanda enum seperti PUSAT/CABANG
 * yang harus tetap dua nilai itu saja. Tanpa penyempitan ini, tipe Kantor di
 * lib/konten.ts menolak naskah cadangan bahasa Inggris.
 */
type KantorNaskah = Omit<Teks<typeof id.kantor>[number], "jenis"> & {
  jenis: "PUSAT" | "CABANG";
};

export const kantor: KantorNaskah[] = [
  {
    jenis: "PUSAT",
    nama: "Head Office",
    alamat:
      "Treasury Tower Lantai 17 Unit M, District 8 SCBD, Jl. Senopati Dalam No. 8B, Senayan, Jakarta Selatan 12190",
    alamatSingkat: "SCBD, South Jakarta",
    telepon: null,
    email: null,
    mapsCid: "",
    urutan: 0,
  },
  {
    jenis: "CABANG",
    nama: "Samarinda Branch Office",
    alamat:
      "Jl. Kadrie Oening No. 07 RT. 21, Kelurahan Air Hitam, Kecamatan Samarinda Ulu, Samarinda, Kalimantan Timur 75124",
    alamatSingkat: "Samarinda, East Kalimantan",
    telepon: company.phone,
    email: company.email,
    mapsCid: "",
    urutan: 1,
  },
];

/* ========================================================================= */
/* BERANDA                                                                   */
/* ========================================================================= */

export const beranda: Teks<typeof id.beranda> = {
  pitaTag: `Since ${company.founded}`,
  pitaTeks: "Domestic & export coal trading",
  pitaTautan: "/tentang-kami",
  judul: "Your [[reliable and professional]] energy partner",
  intro: company.intro,
  ctaUtamaLabel: "See What We Do",
  ctaUtamaLabelPendek: "Services",
  ctaUtamaHref: "/layanan",
  ctaKeduaLabel: "Company Profile",
  ctaKeduaLabelPendek: "Profile",
  ctaKeduaHref: "/tentang-kami",
  manifesto:
    "We supply quality coal from screened mine sources, with specifications adjustable to what you require. Backed by integrated land and sea logistics, shipments arrive on schedule and with few surprises.",
  fotoSatu: "/foto/beranda-1.webp",
  fotoDua: "/foto/beranda-2.webp",
};

export const misi: Teks<typeof id.misi> = [
  "Supply coal of the highest quality, matched to the specifications the market requires.",
  "Build long-term client partnerships on trust, reliability, and integrity.",
  "Improve logistics and distribution efficiency through a capable team and dependable systems.",
  "Comply with the environmental regulations and standards that govern every stage of operations.",
  "Keep improving our management systems, marketing, and customer service.",
];

export const values: Teks<typeof id.values> = [
  {
    title: "Efficiency",
    body: "Supply and logistics routes are kept as short as the geography allows, so cost and transit time are not passed on to the buyer without reason.",
    icon: "Gauge",
  },
  {
    title: "Precision",
    body: "The specification promised is the specification delivered. Every consignment follows the parameters agreed in the contract.",
    icon: "Target",
  },
  {
    title: "Professionalism",
    body: "Every transaction and shipment runs on clear legal standing and in compliance with prevailing regulations.",
    icon: "ShieldCheck",
  },
];

/**
 * Lima kutipan DUMMY — cerminan peringatan di site.ts.
 *
 * ================== WAJIB DIGANTI SEBELUM SITUS TAYANG ==================
 * Nama orang, jabatan, dan nama perusahaan di bawah ini KARANGAN, sama
 * seperti versi Indonesianya. Menerjemahkannya tidak membuatnya jadi benar;
 * yang terjadi justru kebohongan yang sama kini terbaca dua kali oleh dua
 * pembaca berbeda. Ganti keduanya sekaligus, atau kosongkan tabel testimoni.
 * ========================================================================
 */
export const testimoniContoh: Teks<typeof id.testimoniContoh> = [
  {
    kutipan:
      "We are not looking for the cheapest tonne. We are looking for cargo that matches the specification written into the contract. So far the assay results have lined up.",
    nama: "Bambang Setiawan",
    peran: "Procurement",
    organisasi: "PT Karya Daya Nusantara",
  },
  {
    kutipan:
      "A shipment that slips by a week means our stockpile runs thin. Communication here is clear from before loading through to berthing.",
    nama: "Rina Puspitasari",
    peran: "Head of Logistics",
    organisasi: "PT Samudra Niaga Utama",
  },
  {
    kutipan:
      "Origin and legal documents arrive complete without us having to chase them. That is what keeps our internal audit from stalling.",
    nama: "Hendra Wijaya",
    peran: "Compliance",
    organisasi: "PT Cakra Semen Perkasa",
  },
  {
    kutipan:
      "When our calorific requirement shifted mid-year, the adjustment was discussed first rather than shipped as-is.",
    nama: "Dwi Anggraini",
    peran: "Production Manager",
    organisasi: "PT Bumi Manufaktur Sejahtera",
  },
  {
    kutipan:
      "We have taken cargo from other suppliers with moisture outside the agreed limit. Here the laboratory results come before the cargo moves.",
    nama: "Yusuf Ramadhan",
    peran: "Quality Control",
    organisasi: "PT Tirta Energi Pratama",
  },
];

export const sektorMitra: Teks<typeof id.sektorMitra> = [
  "Fertilizer",
  "Energy",
  "Manufacturing",
  "Cement",
  "Smelting",
  "Mining",
  "Logistics",
];

/**
 * `href` sengaja ditulis tanpa awalan bahasa.
 *
 * Awalan /en ditambahkan saat render oleh `tautan()` di lib/bahasa.ts.
 * Menuliskannya di sini berarti setiap tautan baru harus diingat dua kali,
 * dan yang terlupa adalah tautan yang melempar pembaca Inggris kembali ke
 * halaman Indonesia di tengah kunjungan.
 */
export const nav: Teks<typeof id.nav> = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/tentang-kami" },
  { label: "Services", href: "/layanan" },
  { label: "Contact", href: "/hubungi-kami" },
];

/* ========================================================================= */
/* FOTO                                                                      */
/* ========================================================================= */

export const fotoHero: Teks<typeof id.fotoHero> = [
  {
    url: id.fotoHero[0].url,
    alt: "Large mining dump truck and grader on an open-pit haul road",
    keterangan: "Fleet on the haul road",
  },
  {
    url: id.fotoHero[1].url,
    alt: "Excavator loading coal into a dump truck at the mine bench",
    keterangan: "Loading at the bench",
  },
  {
    url: id.fotoHero[2].url,
    alt: "Loaded mining dump truck crossing the haul road",
    keterangan: "Hauling to the stockpile",
  },
  {
    url: id.fotoHero[3].url,
    alt: "Bulk carrier berthed at a loading jetty",
    keterangan: "Bulk shipment",
  },
];

export const fotoLayanan: Record<string, { url: string; alt: string }> = {
  "Domestic & International Coal Trading": {
    url: id.fotoLayanan["Perdagangan Batubara Domestik & Internasional"].url,
    alt: "Coal lumps filling the frame",
  },
  "Logistics & Shipping Management": {
    url: id.fotoLayanan["Manajemen Logistik & Pengapalan"].url,
    alt: "Cargo ship berthed at a jetty with loading cranes",
  },
  "Industrial Energy Supply": {
    url: id.fotoLayanan["Pemenuhan Kebutuhan Energi Industri"].url,
    alt: "Coal-fired power station on the waterfront",
  },
};

export const fotoTentang: Teks<typeof id.fotoTentang> = [
  {
    url: id.fotoTentang[0].url,
    alt: "Mining shovel loading a large dump truck in a coal pit",
  },
  {
    url: id.fotoTentang[1].url,
    alt: "Excavator loading several dump trucks at an open-pit site",
  },
];

/* ========================================================================= */
/* RANTAI PASOK                                                              */
/* ========================================================================= */

export const rantaiPasok: Teks<typeof id.rantaiPasok> = [
  {
    tahap: "Source",
    judul: "Mine selection",
    isi: "Supplying mines are chosen on specification fit and the completeness of their origin documents, not on price alone.",
    foto: id.rantaiPasok[0].foto,
    alt: "Excavator loading a dump truck at an open-pit coal bench",
  },
  {
    tahap: "Assay",
    judul: "Laboratory analysis",
    isi: "Calorific value, total moisture, ash, and sulfur are tested before the cargo moves. Results accompany the offer rather than following it.",
    foto: id.rantaiPasok[1].foto,
    alt: "Coal sample lumps on a hessian sack",
  },
  {
    tahap: "Land",
    judul: "Hauling to stockpile",
    isi: "Transport from the pit mouth to the stockpile or loading port, through transport partners already running the route.",
    foto: id.rantaiPasok[2].foto,
    alt: "Two mining dump trucks in convoy on a haul road",
  },
  {
    tahap: "Load",
    judul: "Stockpile and loading",
    isi: "Stacking, blending where the specification demands it, then loading onto barges under independent surveyor supervision.",
    foto: id.rantaiPasok[3].foto,
    alt: "Dump truck tipping its load onto a coal stockpile",
  },
  {
    tahap: "Sea",
    judul: "Barge and vessel",
    isi: "Shipment to the agreed delivery point, with loading reports and berthing estimates updated whenever the schedule shifts.",
    foto: id.rantaiPasok[4].foto,
    alt: "Bulk carrier and cranes in a harbour basin",
  },
  {
    tahap: "Delivery",
    judul: "Discharge at the buyer",
    isi: "Handover at the buyer's site, with discharge assay results as the basis for final settlement where the contract requires it.",
    foto: id.rantaiPasok[5].foto,
    alt: "Coal-fired power station as the end user of the cargo",
  },
];

/* ========================================================================= */
/* KOMODITAS                                                                 */
/* ========================================================================= */

/**
 * Angka spesifikasinya sama persis dengan versi Indonesia, hanya formatnya
 * yang mengikuti kelaziman Inggris: pemisah ribuan koma, desimal titik.
 * Nilainya tidak boleh berbeda satu digit pun — dua bahasa yang menyebut
 * angka berlainan untuk kargo yang sama adalah sengketa kontrak, bukan salah
 * ketik.
 */
export const products: Product[] = [
  {
    slug: "gar-4200",
    name: "GAR 4200",
    full: "Low-Rank Coal GAR 4,200 kcal/kg",
    jenis: "BATUBARA",
    summary:
      "The low-calorific grade, for mine-mouth power stations and boilers designed around young coal.",
    description:
      "Sub-bituminous coal with a calorific value of roughly 4,200 kcal/kg on a GAR basis. Ash and sulfur are low, which lightens the burden of handling combustion residue, at the cost of high total moisture. This is the most economical grade per tonne, but it needs a boiler actually built for it.",
    icon: "Flame",
    audience: "Mine-mouth power stations, captive industrial generation",
    asal: "",
    specs: [
      { parameter: "Calorific value (GAR)", nilai: "4,200 – 4,400", satuan: "kcal/kg" },
      { parameter: "Total moisture (ARB)", nilai: "34 – 38", satuan: "%" },
      { parameter: "Ash content (ADB)", nilai: "max. 6", satuan: "%" },
      { parameter: "Total sulfur (ADB)", nilai: "max. 0.3", satuan: "%" },
      { parameter: "Size", nilai: "0 – 50", satuan: "mm" },
    ],
    why: [
      {
        icon: "Wallet",
        title: "Lowest energy cost per tonne",
        body: "For a boiler built to take young coal, this grade delivers the lowest cost per calorie of the four.",
      },
      {
        icon: "Wind",
        title: "Low ash and sulfur",
        body: "Ash handling and sulfur emissions are lighter, which brings residue management costs down with them.",
      },
      {
        icon: "MapPin",
        title: "Close to the source",
        body: "Supplied from East Kalimantan mines, on hauling and loading routes already running as a matter of routine.",
      },
    ],
    unggulan: false,
  },
  {
    slug: "gar-4600",
    name: "GAR 4600",
    full: "Mid-Rank Coal GAR 4,600 kcal/kg",
    jenis: "BATUBARA",
    summary:
      "The grade the domestic market asks for most: calorific enough for most industrial boilers without the price of the higher grades.",
    description:
      "Sub-bituminous coal with a calorific value of roughly 4,600 kcal/kg on a GAR basis. Its combination of calorific value and total moisture lets most industrial boilers take it without meaningful adjustment, which is why it carries the largest volume in the domestic market.",
    icon: "Factory",
    audience: "Power stations, cement plants, manufacturing",
    asal: "",
    specs: [
      { parameter: "Calorific value (GAR)", nilai: "4,600 – 4,800", satuan: "kcal/kg" },
      { parameter: "Total moisture (ARB)", nilai: "30 – 34", satuan: "%" },
      { parameter: "Ash content (ADB)", nilai: "max. 6", satuan: "%" },
      { parameter: "Total sulfur (ADB)", nilai: "max. 0.5", satuan: "%" },
      { parameter: "Size", nilai: "0 – 50", satuan: "mm" },
    ],
    why: [
      {
        icon: "Scale",
        title: "The midpoint of calorie and price",
        body: "High enough for most industrial boilers, without the premium the upper grades carry.",
      },
      {
        icon: "Repeat",
        title: "The steadiest supply",
        body: "The most heavily traded grade, which makes it the least likely to run short.",
      },
      {
        icon: "SlidersHorizontal",
        title: "Adjustable",
        body: "Parameters can be shifted to suit the boiler, settled before the contract rather than after the cargo sails.",
      },
    ],
    unggulan: false,
  },
  {
    slug: "gar-5000",
    name: "GAR 5000",
    full: "Mid-Rank Coal GAR 5,000 kcal/kg",
    jenis: "BATUBARA",
    summary:
      "Higher calorific value at lower moisture, for buyers paying freight by the tonne rather than by the calorie.",
    description:
      "Sub-bituminous coal with a calorific value of roughly 5,000 kcal/kg on a GAR basis and lower total moisture. Each tonne carries more energy, so the freight and stockpile space needed for the same energy requirement both shrink.",
    icon: "Zap",
    audience: "Cement plants, smelters, regional export",
    asal: "",
    specs: [
      { parameter: "Calorific value (GAR)", nilai: "5,000 – 5,200", satuan: "kcal/kg" },
      { parameter: "Total moisture (ARB)", nilai: "24 – 28", satuan: "%" },
      { parameter: "Ash content (ADB)", nilai: "max. 8", satuan: "%" },
      { parameter: "Total sulfur (ADB)", nilai: "max. 0.8", satuan: "%" },
      { parameter: "Size", nilai: "0 – 50", satuan: "mm" },
    ],
    why: [
      {
        icon: "TrendingUp",
        title: "Denser energy per tonne",
        body: "The same energy requirement is met with less tonnage, which brings freight and stockpile space down with it.",
      },
      {
        icon: "Droplets",
        title: "Lower moisture",
        body: "Stockpile handling is easier, and less energy is lost boiling off water inside the furnace.",
      },
      {
        icon: "Ship",
        title: "Viable for regional export",
        body: "The ratio of calorific value to tonnage keeps this grade economical over medium shipping distances.",
      },
    ],
    unggulan: false,
  },
  {
    slug: "gar-5800",
    name: "GAR 5800",
    full: "High-Rank Coal GAR 5,800 kcal/kg",
    jenis: "BATUBARA",
    summary:
      "The highest grade routinely traded out of Kalimantan, for processes that demand high temperature and low ash.",
    description:
      "Bituminous coal with a calorific value of roughly 5,800 kcal/kg on a GAR basis. High calorific value at low moisture suits it to processes that demand high temperature and consistent combustion, smelters and cement kilns among them.",
    icon: "Gem",
    audience: "Smelters, cement kilns, export",
    asal: "",
    specs: [
      { parameter: "Calorific value (GAR)", nilai: "5,800 – 6,000", satuan: "kcal/kg" },
      { parameter: "Total moisture (ARB)", nilai: "14 – 18", satuan: "%" },
      { parameter: "Ash content (ADB)", nilai: "max. 10", satuan: "%" },
      { parameter: "Total sulfur (ADB)", nilai: "max. 1.0", satuan: "%" },
      { parameter: "Size", nilai: "0 – 50", satuan: "mm" },
    ],
    why: [
      {
        icon: "Flame",
        title: "High combustion temperature",
        body: "Suited to kilns and furnaces that need a stable temperature at the upper end of the range.",
      },
      {
        icon: "PackageCheck",
        title: "The most efficient tonnage",
        body: "The energy requirement is met with the least tonnage, which gives the lowest logistics cost per unit of energy.",
      },
      {
        icon: "Globe2",
        title: "Accepted in export markets",
        body: "The calorific range overseas buyers commonly ask for in Indonesian coal.",
      },
    ],
    unggulan: false,
  },
];

const KATA_BILANGAN_EN = [
  "Zero", "One", "Two", "Three", "Four", "Five",
  "Six", "Seven", "Eight", "Nine", "Ten",
];

export const bilangan = (n: number) => KATA_BILANGAN_EN[n] ?? String(n);

/* ========================================================================= */
/* LAYANAN                                                                   */
/* ========================================================================= */

/**
 * Kode KBLI dipertahankan apa adanya.
 *
 * KBLI adalah klasifikasi baku Indonesia; angkanya yang dicocokkan pembaca
 * dengan NIB di oss.go.id. Menerjemahkan kodenya membuat rujukan itu putus,
 * jadi yang dialihbahasakan hanya keterangan di belakangnya.
 */
export const services: Teks<typeof id.services> = [
  "KBLI 46710 — Wholesale of solid, liquid, and gaseous fuels and related products",
  "KBLI 46610 — Wholesale of solid, liquid, and gaseous fuels and related products",
];

export const serviceGroups: Teks<typeof id.serviceGroups> = [
  {
    title: "Domestic & International Coal Trading",
    body: "Quality coal from a range of trusted mine sources, with GAR specifications adjustable on request, for domestic use and export alike.",
    icon: "Flame",
    covers: ["Domestic market", "Export", "Adjustable GAR specification"],
  },
  {
    title: "Logistics & Shipping Management",
    body: "Land and sea logistics that keep coal moving safely, smoothly, and efficiently through to the delivery point.",
    icon: "Ship",
    covers: ["Land hauling", "Barge & shipping", "Stockpile & loading"],
  },
  {
    title: "Industrial Energy Supply",
    body: "Coal supply for industrial sectors that depend on coal-based energy on a continuing basis.",
    icon: "Factory",
    covers: [
      "Power generation",
      "Cement plants",
      "Smelters and heavy industry",
      "Manufacturing",
    ],
  },
];

export const klienAwal: Teks<typeof id.klienAwal> = [
  { nama: "PT Pupuk Indonesia", sektor: "Fertilizer" },
  { nama: "PT Pupuk Sriwidjaja Palembang", sektor: "Fertilizer" },
  { nama: "PT Pupuk Kujang", sektor: "Fertilizer" },
  { nama: "PT Pupuk Kalimantan Timur", sektor: "Fertilizer" },
  { nama: "PT Energi Unggul Persada", sektor: "Energy" },
  { nama: "PT Petrokimia Gresik", sektor: "Manufacturing" },
];

/* ========================================================================= */
/* ORANG                                                                     */
/* ========================================================================= */

/**
 * Nama tetap; jabatan diterjemahkan.
 *
 * "Komisaris Utama" dan "Direktur Utama" adalah jabatan hukum di perseroan
 * Indonesia. Padanan yang dipakai di sini — President Commissioner dan
 * President Director — adalah istilah yang lazim di dokumen perusahaan
 * Indonesia berbahasa Inggris, bukan terjemahan harfiah.
 */
export const leadership: Orang[] = [
  { name: "Ari Aswin", role: "President Commissioner" },
  { name: "Fathiah Olpah Siara", role: "President Director" },
  { name: "Lussius Edwin Suwarna", role: "Finance Director" },
];

export const team: Orang[] = [];

export const kategoriAwal: Teks<typeof id.kategoriAwal> = [
  { nama: "Coal Market", slug: "pasar-batubara" },
  { nama: "Operations", slug: "operasional" },
  { nama: "Regulation", slug: "regulasi" },
  { nama: "Company", slug: "perusahaan" },
];

/* ========================================================================= */
/* ALUR, FAQ, ALASAN, PERJALANAN                                             */
/* ========================================================================= */

export const langkahMulai: Teks<typeof id.langkahMulai> = [
  {
    title: "Enquiry and specification",
    body: "You state the calorific value, tonnage, schedule, and delivery point you need. From there we know which grade fits and which mine can supply it.",
  },
  {
    title: "Offer and assay results",
    body: "The offer arrives with laboratory results for the cargo in question, not a generic specification. Differences in parameters are settled at this stage, not after the vessel sails.",
  },
  {
    title: "Contract and origin documents",
    body: "The contract records the agreed parameters and their tolerances. Legal and origin documents are handed over alongside it, so your internal audit does not stall months later.",
  },
  {
    title: "Loading and shipment",
    body: "Loading is supervised by an independent surveyor. You receive the loading report and berthing estimate, updated whenever the schedule shifts.",
  },
  {
    title: "Handover and settlement",
    body: "Cargo is handed over at the agreed point, with discharge assay results as the basis for final settlement where the contract requires it.",
  },
];

export const faqUmum: Teks<typeof id.faqUmum> = [
  {
    q: "Can the specification be adjusted?",
    a: "Yes. Calorific value, total moisture, ash, sulfur, and size are discussed against the needs of your boiler or process, then written into the contract along with their tolerances.",
  },
  {
    q: "What is the minimum tonnage per shipment?",
    a: "It depends on the delivery point and the transport mode. We state the minimum tonnage alongside the offer, once the destination and schedule are clear.",
  },
  {
    q: "How is quality assured?",
    a: "Through laboratory testing before loading and independent surveyor supervision during it. Results are handed over as part of the cargo documents, not on request.",
  },
  {
    q: "What documents accompany the cargo?",
    a: "Origin documents, laboratory results, and transport documentation as the prevailing rules require. That completeness is what lets the cargo clear the buyer's internal audit.",
  },
  {
    q: "Do you handle export?",
    a: "Yes. Both domestic trade and export are served, with the calorific grade matched to the destination market.",
  },
  {
    q: "What happens if the specification received does not match the contract?",
    a: "The contract sets out tolerances along with the mechanism for price adjustment or cargo rejection. The basis is the discharge assay, not one party's judgement.",
  },
];

export const alasanKami: Teks<typeof id.alasanKami> = [
  {
    icon: "BadgeCheck",
    title: "Assured coal quality",
    body: "Coal is drawn only from mine sources that have been through a screening process. Every consignment carries a specification that meets industry standards and can be matched to client requirements.",
  },
  {
    icon: "Clock",
    title: "On-time, efficient delivery",
    body: "Backed by integrated land and sea logistics, shipments run on schedule, efficiently, and with few disruptions.",
  },
  {
    icon: "Network",
    title: "A wide network of miners and logistics partners",
    body: "Working with a range of trusted mines and transport partners keeps supply moving through varying operating conditions.",
  },
  {
    icon: "FileCheck",
    title: "Complete legal standing and regulatory compliance",
    body: "Every transaction and shipment runs on clear legal standing and in compliance with all prevailing regulations, which is what lets a business partner rest easy.",
  },
  {
    icon: "Headset",
    title: "Professional, responsive service",
    body: "A team of experienced specialists, ready to answer any requirement quickly, accurately, and without being chased.",
  },
];

export const perjalanan: Teks<typeof id.perjalanan> = [
  {
    tahun: "2021",
    judul: "Company established",
    body: `${company.legalName} received its NIB on 24 June 2021 as a wholesale solid fuel trading company.`,
  },
  {
    tahun: "2026",
    judul: "Head office in Jakarta",
    body: "The head office sits at Treasury Tower, District 8 SCBD, South Jakarta, with a branch office in Samarinda close to the mine sources.",
  },
];

export const footerLinks: Teks<typeof id.footerLinks> = {
  perusahaan: [
    { label: "About Us", href: "/tentang-kami" },
    { label: "Vision & Mission", href: "/tentang-kami#visi-misi" },
    { label: "What Sets Us Apart", href: "/tentang-kami#keunggulan" },
    { label: "Organisation", href: "/tentang-kami#tim" },
  ],
  layanan: [
    { label: "Coal Trading", href: "/layanan#layanan-1" },
    { label: "Logistics & Shipping", href: "/layanan#layanan-2" },
    { label: "Industrial Energy", href: "/layanan#layanan-3" },
    { label: "Specifications", href: "/layanan#spesifikasi" },
  ],
};
