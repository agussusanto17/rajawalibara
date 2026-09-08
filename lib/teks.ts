/**
 * Teks antarmuka: judul bagian, label tombol, dan keterangan yang sebelumnya
 * ditulis langsung di dalam komponen.
 *
 * Berbeda dari lib/site.ts, isi berkas ini BUKAN konten yang bisa diedit
 * klien. Ini bagian dari rancangan halaman — judul bagian dan label tombol
 * yang berubah hanya kalau susunan halamannya berubah. Menaruhnya di CMS
 * berarti memberi tombol yang, kalau ditekan, merusak tata letak.
 *
 * Judul besar disimpan sebagai dua baris terpisah, bukan satu string dengan
 * <br/>. Pemenggalan baris bahasa Inggris jatuh di tempat yang berbeda dari
 * bahasa Indonesia, dan satu string yang dipaksa patah di posisi yang sama
 * menghasilkan baris kedua yang menggantung di salah satu bahasa.
 *
 * Versi Inggris diikat ke bentuk versi Indonesia lewat `Teks<>`: menambah
 * satu label di ID tanpa menerjemahkannya membuat build gagal.
 */

import type { Bahasa, Teks } from "./bahasa";

const ID = {
  /* ------------------------------------------------------------- Bersama */
  umum: {
    hubungiKami: "Hubungi Kami",
    kirimPesan: "Kirim Pesan",
    mintaPenawaran: "Minta Penawaran",
    bukaWhatsapp: "Buka WhatsApp",
    bukaPetunjukArah: "Buka petunjuk arah",
    tanpaBiaya: "Tanpa biaya",
    lihatSemua: "Lihat semua",
    lewatiKeKonten: "Lewati ke konten utama",
    remahRoti: "Remah roti",
    beranda: "Home",
    tagPenawaran: "Penawaran",
    tagKonsultasi: "Konsultasi",
  },

  /* -------------------------------------------------------------- Header */
  header: {
    logoKeBeranda: "Rajawali Bara, beranda",
    navUtama: "Navigasi utama",
    navMobile: "Navigasi mobile",
    bukaMenu: "Buka menu",
    tutupMenu: "Tutup menu",
    pilihBahasa: "Pilih bahasa",
    bahasaAktif: "Bahasa aktif",
  },

  /* -------------------------------------------------------------- Footer */
  footer: {
    judulPerusahaan: "Perusahaan",
    judulLayanan: "Layanan",
    judulKantor: "Kantor",
    judulKontak: "Kontak",
    judulSebutkanBaris1: "Sebutkan kebutuhan",
    judulSebutkanBaris2: "pasokan Anda.",
    dibalas: "Dibalas dalam 1×24 jam kerja.",
    kembaliKeAtas: "Kembali ke atas",
    hakCipta: "Seluruh hak dilindungi.",
  },

  /* ------------------------------------------------------------- Beranda */
  angka: {
    judulBaris1: "Dipercaya, lalu",
    judulBaris2: "dipertahankan",
    keterangan:
      "Dihitung ulang dari basis data, bukan angka yang diketik sekali lalu ditinggal.",
    mulaiDiskusi: "Mulai Diskusi",
  },

  manifesto: {
    eyebrow: "Tentang kami",
    judulBaris1: "Tim yang menjaga",
    judulBaris2: "rantai pasoknya",
    kenaliTim: "Kenali Tim Kami",
  },

  rantaiPasok: {
    eyebrow: "6 tahap",
    judulBaris1: "Dari tambang",
    judulBaris2: "sampai boiler",
    keterangan:
      "Yang dikerjakan seorang pedagang batubara terletak di antara keduanya. Ini urutannya.",
  },

  layananRingkas: {
    eyebrow: "KBLI 46710",
    judulBaris1: "Layanan",
    judulBaris2: "yang kami jalankan",
    keterangan: "Dari pemilihan tambang sampai kargo diterima di lokasi Anda.",
    rincian: "Rincian Layanan",
  },

  testimoni: {
    eyebrow: "Kutipan klien",
    contohBelumDiisi: "Contoh — belum diisi",
    judulBaris1: "Yang mereka",
    judulBaris2: "katakan",
    keterangan:
      "Dari bagian pengadaan dan operasional yang menerima kargo kami.",
  },

  klien: {
    dipercayaOleh: "Dipercaya {jumlah} perusahaan di sektor industri dan energi",
  },

  ctaBeranda: {
    eyebrow: "Tanpa biaya",
    judul: "Sebutkan kebutuhan pasokan Anda",
    isi: "Kalori, tonase, jadwal, dan titik serah. Setiap pesan dibalas dalam 1×24 jam kerja.",
  },

  /* --------------------------------------------------------- Tentang Kami */
  tentang: {
    heroEyebrow: "Sejak {tahun}",
    heroJudul: "Mitra energi yang andal dan profesional",
    heroIsi:
      "Perdagangan batubara dari sumber tambang terseleksi, dengan spesifikasi yang disesuaikan permintaan dan logistik darat serta laut yang terintegrasi.",
    faktaBerdiri: "Berdiri",
    faktaBerdiriCatatan: "24 Juni 2021",
    faktaKantor: "Kantor",
    faktaKantorCatatan: "Pusat",
    faktaKlien: "Klien",
    jumlahPerusahaan: "{jumlah} perusahaan",
    faktaKlienCatatan: "Industri, energi, manufaktur",
    lihatLayanan: "Lihat Layanan",
    tanyaWhatsapp: "Tanya lewat WhatsApp",
    nilaiJudulBaris1: "{bilangan} hal",
    nilaiJudulBaris2: "yang kami jaga",
    nilaiKeterangan:
      "Yang menentukan cara kami mengambil keputusan, bukan yang dipajang di dinding kantor.",
    alasanJudulBaris1: "Kenapa bekerja",
    alasanJudulBaris2: "dengan kami",
    alasanKeterangan: "Yang membedakan cara kami bekerja.",
    pimpinanJudul: "Yang memimpin {nama}",
    pimpinanKeterangan:
      "Yang memutuskan arah, dan ikut menanggung akibatnya.",
    timJudul: "Tim di balik operasi kami",
    timKeterangan:
      "Mereka yang mengurus pasokan, logistik, dan dokumen sampai kargo diterima.",
    perjalananBaris1: "Berdiri di Jakarta,",
    perjalananBaris2: "beroperasi dari Kalimantan",
    perjalananJudul: "Dari perdagangan pertama sampai hari ini",
    visiJudul: "Visi",
    misiJudul: "Misi",
    ctaJudul: "Mulai dari satu percakapan",
    ctaIsi:
      "Sebutkan kebutuhan kalori, tonase, dan titik serahnya. Tim kami membalas dalam 1×24 jam kerja.",
  },

  /* -------------------------------------------------------------- Layanan */
  layanan: {
    heroEyebrow: "KBLI 46710 · 46610",
    heroIsi:
      "Batubara dari sumber tambang terseleksi, diantar sampai titik serah yang Anda tentukan — dengan spesifikasi dan dokumen yang bisa diperiksa.",
    fotoBelum: "Foto belum diunggah",
    alurLangkah: "{jumlah} langkah",
    bidangUsahaBaris1: "Bidang usaha",
    bidangUsahaBaris2: "resmi",
    lampiranIsi:
      "Teks apa adanya dari lampiran NIB {nib}. Perizinan berusaha hanya berlaku untuk kode dan ruang lingkup yang tercantum di sana.",
    faqEyebrow: "Pertanyaan umum",
    spesifikasiJudulBaris1: "Spesifikasi",
    spesifikasiJudulBaris2: "yang kami pasok",
    spesifikasiKeterangan:
      "Parameter dapat digeser mengikuti kebutuhan boiler Anda, lalu dituangkan sebagai parameter kontrak beserta toleransinya.",
    spesifikasiCatatan:
      "Angka di atas adalah kisaran tipikal, bukan komitmen kontrak. Hasil uji laboratorium kargo yang bersangkutan diserahkan bersama penawaran — bukan menyusul setelah kargo berangkat.",
    spesifikasiKosongJudul: "Tabel spesifikasi sedang disiapkan",
    spesifikasiKosongIsi:
      "Sementara ini, sebutkan kebutuhan kalori, tonase, jadwal, dan titik serah Anda. Penawaran dikirim beserta hasil uji laboratorium kargo yang dimaksud, bukan spesifikasi umum.",
    alurJudulBaris1: "Dari permintaan",
    alurJudulBaris2: "sampai serah terima",
    alurEyebrow: "5 langkah",
    legalitasJudul: "Lampiran NIB",
    faqJudulBaris1: "Yang sering",
    faqJudulBaris2: "ditanyakan",
    ctaJudul: "Sebutkan spesifikasi yang Anda cari",
    ctaIsi:
      "Kalori, tonase, jadwal, dan titik serah. Setiap pesan dibalas dalam 1×24 jam kerja.",
    tabelJudul: "Perbandingan spesifikasi {jumlah} tingkatan batubara",
    kolomParameter: "Parameter",
    barisPeruntukan: "Peruntukan",
  },

  /* --------------------------------------------------------- Hubungi Kami */
  kontak: {
    heroEyebrow: "Dibalas 1×24 jam kerja",
    heroJudul: "Mulai dari kebutuhan, bukan brosur",
    heroIsi:
      "Sebutkan kebutuhan kalori, tonase, jadwal, dan titik serahnya. Penawaran dikirim beserta hasil uji laboratorium kargo yang dimaksud.",
    faktaTelepon: "Telepon / WhatsApp",
    faktaEmail: "Email",
    faktaKantor: "Kantor",
    jumlahLokasi: "{jumlah} lokasi",
    tanyaWhatsapp: "Tanya lewat WhatsApp",
    kanalBicaraJudul: "Bicara langsung",
    kanalBicaraIsi: "Cara tercepat. Kirim pesan ke {telepon}, atau telepon di jam kerja.",
    kanalEmailJudul: "Kirim email",
    kanalEmailIsi:
      "Cocok untuk kebutuhan yang perlu dijelaskan panjang atau disertai lampiran.",
    kanalKantorJudul: "Datang ke kantor",
    kanalKantorIsi:
      "{alamat}. Sebaiknya buat janji dulu agar tim yang tepat siap menemui Anda.",
    lihatDiPeta: "Lihat di peta",
    pilFormulir: "Formulir",
    formulirJudul: "Kebutuhan pasokan apa yang bisa kami bantu?",
    formulirIsi:
      "Semakin jelas spesifikasi, tonase, dan jadwalnya, semakin tepat penawaran yang bisa kami siapkan.",
    kantorJudul: "Kantor kami",
  },

  /* -------------------------------------------------------- Formulir pesan */
  formulir: {
    berhasilJudul: "Pesan Anda masuk",
    berhasilIsi:
      "Terima kasih sudah menghubungi kami. Tim kami membalas melalui email dalam 1×24 jam kerja.",
    kirimLagi: "Kirim pesan lain",
    labelNama: "Nama lengkap",
    isianNama: "Nama Anda",
    labelEmail: "Email",
    isianEmail: "nama@email.com",
    labelTelepon: "Telepon / WhatsApp",
    labelOrganisasi: "Organisasi",
    isianOrganisasi: "Nama sekolah, dinas, atau perusahaan",
    labelProduk: "Produk yang diminati",
    labelPesan: "Pesan",
    isianPesan:
      "Sebutkan kebutuhan kalori, tonase, jadwal, dan titik serah…",
    sedangMengirim: "Mengirim…",
    wajib: "wajib diisi",
    lainnya: "Lainnya",
    opsional: "(opsional)",
    isianTelepon: "08xx xxxx xxxx",
    belumMenentukan: "Belum menentukan",
    janganDiisi: "Jangan diisi",
    galatNama: "Nama wajib diisi.",
    galatEmail: "Email wajib diisi.",
    galatEmailFormat: "Format email belum benar.",
    galatTelepon: "Nomor telepon wajib diisi.",
    galatTeleponPendek: "Nomor telepon belum lengkap.",
    galatPesan: "Pesan wajib diisi.",
    galatPesanPendek: "Pesan minimal 10 karakter.",
    gagalKirim: "Pesan gagal terkirim. Silakan coba lagi.",
    gagalJaringan:
      "Tidak bisa menghubungi server. Periksa koneksi Anda, atau hubungi kami lewat WhatsApp.",
  },

  /* ------------------------------------------------------------------ 404 */
  takDitemukan: {
    judul: "Halaman tidak ditemukan",
    isi: "Halaman yang Anda cari mungkin sudah dipindahkan atau alamatnya keliru.",
    kembali: "Kembali ke beranda",
  },
} as const;

type BentukTeks = Teks<typeof ID>;

const EN: BentukTeks = {
  umum: {
    hubungiKami: "Contact Us",
    kirimPesan: "Send Message",
    mintaPenawaran: "Request a Quote",
    bukaWhatsapp: "Open WhatsApp",
    bukaPetunjukArah: "Open directions",
    tanpaBiaya: "No obligation",
    lihatSemua: "See all",
    lewatiKeKonten: "Skip to main content",
    remahRoti: "Breadcrumb",
    beranda: "Home",
    tagPenawaran: "Quote",
    tagKonsultasi: "Consultation",
  },

  header: {
    logoKeBeranda: "Rajawali Bara, home",
    navUtama: "Main navigation",
    navMobile: "Mobile navigation",
    bukaMenu: "Open menu",
    tutupMenu: "Close menu",
    pilihBahasa: "Choose language",
    bahasaAktif: "Current language",
  },

  footer: {
    judulPerusahaan: "Company",
    judulLayanan: "Services",
    judulKantor: "Offices",
    judulKontak: "Contact",
    judulSebutkanBaris1: "Tell us what you",
    judulSebutkanBaris2: "need to source.",
    dibalas: "Answered within one working day.",
    kembaliKeAtas: "Back to top",
    hakCipta: "All rights reserved.",
  },

  angka: {
    judulBaris1: "Trusted, then",
    judulBaris2: "kept",
    keterangan:
      "Recounted from the database, not a number typed once and left behind.",
    mulaiDiskusi: "Start a Conversation",
  },

  manifesto: {
    eyebrow: "About us",
    judulBaris1: "The team keeping",
    judulBaris2: "your supply moving",
    kenaliTim: "Meet Our Team",
  },

  rantaiPasok: {
    eyebrow: "6 stages",
    judulBaris1: "From the pit",
    judulBaris2: "to the boiler",
    keterangan:
      "What a coal trader actually does sits between those two points. This is the order it happens in.",
  },

  layananRingkas: {
    eyebrow: "KBLI 46710",
    judulBaris1: "What we",
    judulBaris2: "actually do",
    keterangan: "From mine selection through to cargo received at your site.",
    rincian: "Service Details",
  },

  testimoni: {
    eyebrow: "Client quotes",
    contohBelumDiisi: "Sample — not filled in yet",
    judulBaris1: "What they",
    judulBaris2: "say",
    keterangan:
      "From the procurement and operations teams that take delivery of our cargo.",
  },

  klien: {
    dipercayaOleh: "Trusted by {jumlah} companies across industry and energy",
  },

  ctaBeranda: {
    eyebrow: "No obligation",
    judul: "Tell us what you need to source",
    isi: "Calorific value, tonnage, schedule, and delivery point. Every message is answered within one working day.",
  },

  tentang: {
    heroEyebrow: "Since {tahun}",
    heroJudul: "A reliable and professional energy partner",
    heroIsi:
      "Coal trading from screened mine sources, with specifications matched to the requirement and integrated land and sea logistics behind it.",
    faktaBerdiri: "Established",
    faktaBerdiriCatatan: "24 June 2021",
    faktaKantor: "Office",
    faktaKantorCatatan: "Head office",
    faktaKlien: "Clients",
    jumlahPerusahaan: "{jumlah} companies",
    faktaKlienCatatan: "Industry, energy, manufacturing",
    lihatLayanan: "See Services",
    tanyaWhatsapp: "Ask on WhatsApp",
    nilaiJudulBaris1: "{bilangan} things",
    nilaiJudulBaris2: "we hold to",
    nilaiKeterangan:
      "What actually shapes our decisions, not what hangs framed on an office wall.",
    alasanJudulBaris1: "Why work",
    alasanJudulBaris2: "with us",
    alasanKeterangan: "What sets the way we work apart.",
    pimpinanJudul: "Who leads {nama}",
    pimpinanKeterangan:
      "The people who set the direction, and carry the consequences of it.",
    timJudul: "The team behind our operations",
    timKeterangan:
      "The people handling supply, logistics, and documents through to delivery.",
    perjalananBaris1: "Registered in Jakarta,",
    perjalananBaris2: "operating out of Kalimantan",
    perjalananJudul: "From the first trade to today",
    visiJudul: "Vision",
    misiJudul: "Mission",
    ctaJudul: "It starts with one conversation",
    ctaIsi:
      "Tell us the calorific value, tonnage, and delivery point you need. Our team replies within one working day.",
  },

  layanan: {
    heroEyebrow: "KBLI 46710 · 46610",
    heroIsi:
      "Coal from screened mine sources, delivered to the point you nominate — with specifications and documents that stand up to checking.",
    fotoBelum: "Photo not uploaded yet",
    alurLangkah: "{jumlah} steps",
    bidangUsahaBaris1: "Licensed business",
    bidangUsahaBaris2: "activities",
    lampiranIsi:
      "Reproduced verbatim from the attachment to NIB {nib}. The business licence covers only the codes and scope listed there.",
    faqEyebrow: "Common questions",
    spesifikasiJudulBaris1: "The grades",
    spesifikasiJudulBaris2: "we supply",
    spesifikasiKeterangan:
      "Parameters can be shifted to suit your boiler, then written into the contract along with their tolerances.",
    spesifikasiCatatan:
      "The figures above are typical ranges, not a contractual commitment. Laboratory results for the cargo in question are handed over with the offer — not after it has sailed.",
    spesifikasiKosongJudul: "The specification table is being prepared",
    spesifikasiKosongIsi:
      "In the meantime, tell us the calorific value, tonnage, schedule, and delivery point you need. The offer arrives with laboratory results for that cargo, not a generic specification.",
    alurJudulBaris1: "From enquiry",
    alurJudulBaris2: "to handover",
    alurEyebrow: "5 steps",
    legalitasJudul: "NIB attachment",
    faqJudulBaris1: "Frequently",
    faqJudulBaris2: "asked",
    ctaJudul: "Tell us the specification you are after",
    ctaIsi:
      "Calorific value, tonnage, schedule, and delivery point. Every message is answered within one working day.",
    tabelJudul: "Specification comparison across {jumlah} coal grades",
    kolomParameter: "Parameter",
    barisPeruntukan: "Typical use",
  },

  kontak: {
    heroEyebrow: "Answered within one working day",
    heroJudul: "Start with the requirement, not a brochure",
    heroIsi:
      "Tell us the calorific value, tonnage, schedule, and delivery point. The offer arrives with laboratory results for the cargo in question.",
    faktaTelepon: "Phone / WhatsApp",
    faktaEmail: "Email",
    faktaKantor: "Offices",
    jumlahLokasi: "{jumlah} locations",
    tanyaWhatsapp: "Ask on WhatsApp",
    kanalBicaraJudul: "Talk to us directly",
    kanalBicaraIsi: "The fastest route. Message {telepon}, or call during working hours.",
    kanalEmailJudul: "Send an email",
    kanalEmailIsi:
      "Best for requirements that need a longer explanation or come with attachments.",
    kanalKantorJudul: "Visit an office",
    kanalKantorIsi:
      "{alamat}. Do arrange an appointment first so the right team is there to meet you.",
    lihatDiPeta: "See on the map",
    pilFormulir: "Form",
    formulirJudul: "What supply requirement can we help with?",
    formulirIsi:
      "The clearer the specification, tonnage, and schedule, the more precise the offer we can put together.",
    kantorJudul: "Our offices",
  },

  formulir: {
    berhasilJudul: "Your message is in",
    berhasilIsi:
      "Thank you for getting in touch. Our team replies by email within one working day.",
    kirimLagi: "Send another message",
    labelNama: "Full name",
    isianNama: "Your name",
    labelEmail: "Email",
    isianEmail: "name@email.com",
    labelTelepon: "Phone / WhatsApp",
    labelOrganisasi: "Organisation",
    isianOrganisasi: "Your company or institution",
    labelProduk: "Grade of interest",
    labelPesan: "Message",
    isianPesan:
      "Tell us the calorific value, tonnage, schedule, and delivery point…",
    sedangMengirim: "Sending…",
    wajib: "required",
    lainnya: "Other",
    opsional: "(optional)",
    isianTelepon: "+62 8xx xxxx xxxx",
    belumMenentukan: "Not decided yet",
    janganDiisi: "Leave this blank",
    galatNama: "Name is required.",
    galatEmail: "Email is required.",
    galatEmailFormat: "That email address does not look right.",
    galatTelepon: "Phone number is required.",
    galatTeleponPendek: "That phone number looks incomplete.",
    galatPesan: "Message is required.",
    galatPesanPendek: "Message must be at least 10 characters.",
    gagalKirim: "The message could not be sent. Please try again.",
    gagalJaringan:
      "Could not reach the server. Check your connection, or reach us on WhatsApp.",
  },

  takDitemukan: {
    judul: "Page not found",
    isi: "The page you are looking for may have moved, or the address is wrong.",
    kembali: "Back to home",
  },
};

const SEMUA: Record<Bahasa, BentukTeks> = { id: ID, en: EN };

/** Naskah antarmuka untuk satu bahasa. */
export const teks = (bahasa: Bahasa): BentukTeks => SEMUA[bahasa];

/**
 * Mengisi penanda {nama} pada satu string.
 *
 * Dipakai untuk kalimat yang menyisipkan angka — jumlah klien, jumlah
 * tingkatan, lama beroperasi. Menyambungnya dengan `+` memaksa urutan kata
 * bahasa Indonesia dipakai juga di bahasa Inggris, dan angka yang jatuh di
 * tengah kalimat tidak selalu jatuh di tempat yang sama.
 */
export function isi(
  pola: string,
  nilai: Record<string, string | number>,
): string {
  return pola.replace(/\{(\w+)\}/g, (utuh, kunci) =>
    kunci in nilai ? String(nilai[kunci]) : utuh,
  );
}
