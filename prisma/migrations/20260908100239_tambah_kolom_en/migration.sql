-- AlterTable
ALTER TABLE `anggota_tim` ADD COLUMN `bio_en` TEXT NULL,
    ADD COLUMN `jabatan_en` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `beranda` ADD COLUMN `cta_kedua_label_en` VARCHAR(191) NULL,
    ADD COLUMN `cta_kedua_label_pendek_en` VARCHAR(191) NULL,
    ADD COLUMN `cta_utama_label_en` VARCHAR(191) NULL,
    ADD COLUMN `cta_utama_label_pendek_en` VARCHAR(191) NULL,
    ADD COLUMN `intro_en` TEXT NULL,
    ADD COLUMN `judul_en` VARCHAR(500) NULL,
    ADD COLUMN `manifesto_en` TEXT NULL,
    ADD COLUMN `pita_tag_en` VARCHAR(191) NULL,
    ADD COLUMN `pita_teks_en` VARCHAR(300) NULL;

-- AlterTable
ALTER TABLE `blok_konten` ADD COLUMN `isi_en` TEXT NULL,
    ADD COLUMN `judul_en` VARCHAR(300) NULL;

-- AlterTable
ALTER TABLE `grup_layanan` ADD COLUMN `cakupan_en` JSON NULL,
    ADD COLUMN `isi_en` TEXT NULL,
    ADD COLUMN `judul_en` VARCHAR(300) NULL;

-- AlterTable
ALTER TABLE `kantor` ADD COLUMN `alamat_en` TEXT NULL,
    ADD COLUMN `alamat_singkat_en` VARCHAR(300) NULL,
    ADD COLUMN `nama_en` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `layanan` ADD COLUMN `nama_en` VARCHAR(300) NULL;

-- AlterTable
ALTER TABLE `mitra` ADD COLUMN `sektor_en` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `perjalanan` ADD COLUMN `isi_en` TEXT NULL,
    ADD COLUMN `judul_en` VARCHAR(300) NULL;

-- AlterTable
ALTER TABLE `perusahaan` ADD COLUMN `intro_en` TEXT NULL,
    ADD COLUMN `latar_belakang_en` TEXT NULL,
    ADD COLUMN `sejarah_en` TEXT NULL,
    ADD COLUMN `tagline_en` VARCHAR(300) NULL,
    ADD COLUMN `visi_en` TEXT NULL;

-- AlterTable
ALTER TABLE `produk` ADD COLUMN `asal_en` TEXT NULL,
    ADD COLUMN `deskripsi_en` TEXT NULL,
    ADD COLUMN `keunggulan_en` JSON NULL,
    ADD COLUMN `nama_en` VARCHAR(191) NULL,
    ADD COLUMN `nama_panjang_en` VARCHAR(300) NULL,
    ADD COLUMN `peruntukan_en` VARCHAR(300) NULL,
    ADD COLUMN `ringkas_en` VARCHAR(300) NULL,
    ADD COLUMN `spesifikasi_en` JSON NULL;

-- AlterTable
ALTER TABLE `proyek` ADD COLUMN `judul_en` VARCHAR(300) NULL,
    ADD COLUMN `lokasi_en` VARCHAR(191) NULL,
    ADD COLUMN `ringkas_en` TEXT NULL;

-- AlterTable
ALTER TABLE `seo_halaman` ADD COLUMN `deskripsi_en` VARCHAR(300) NULL,
    ADD COLUMN `judul_en` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `slide` ADD COLUMN `keterangan_en` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `testimoni` ADD COLUMN `kutipan_en` TEXT NULL,
    ADD COLUMN `peran_en` VARCHAR(191) NULL;
