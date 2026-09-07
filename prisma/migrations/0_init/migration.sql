-- CreateTable
CREATE TABLE `pesan_masuk` (
    `id` CHAR(36) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telepon` VARCHAR(191) NULL,
    `organisasi` VARCHAR(191) NULL,
    `pesan` TEXT NOT NULL,
    `produk` VARCHAR(191) NULL,
    `halaman` VARCHAR(191) NULL,
    `kampanye` VARCHAR(191) NULL,
    `status` ENUM('BARU', 'DIPROSES', 'SELESAI') NOT NULL DEFAULT 'BARU',
    `catatan` TEXT NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NULL,
    `dihapus_pada` DATETIME(3) NULL,

    INDEX `pesan_masuk_dibuat_pada_idx`(`dibuat_pada`),
    INDEX `pesan_masuk_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media` (
    `id` CHAR(36) NOT NULL,
    `kunci` VARCHAR(191) NULL,
    `url` VARCHAR(500) NOT NULL,
    `alt` VARCHAR(300) NOT NULL,
    `tipe` VARCHAR(191) NOT NULL,
    `lebar` INTEGER NULL,
    `tinggi` INTEGER NULL,
    `ukuran` INTEGER NOT NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dihapus_pada` DATETIME(3) NULL,

    UNIQUE INDEX `media_kunci_key`(`kunci`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori_artikel` (
    `id` CHAR(36) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dihapus_pada` DATETIME(3) NULL,

    UNIQUE INDEX `kategori_artikel_nama_key`(`nama`),
    UNIQUE INDEX `kategori_artikel_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artikel` (
    `id` CHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(300) NOT NULL,
    `ringkas` VARCHAR(300) NOT NULL,
    `isi` JSON NOT NULL,
    `status` ENUM('DRAF', 'TERBIT') NOT NULL DEFAULT 'DRAF',
    `unggulan` BOOLEAN NOT NULL DEFAULT false,
    `kategori_id` CHAR(36) NOT NULL,
    `terbit_pada` DATETIME(3) NULL,
    `sampul_id` CHAR(36) NULL,
    `seo_judul` VARCHAR(191) NULL,
    `seo_deskripsi` VARCHAR(300) NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    UNIQUE INDEX `artikel_slug_key`(`slug`),
    INDEX `artikel_status_terbit_pada_idx`(`status`, `terbit_pada`),
    INDEX `artikel_kategori_id_idx`(`kategori_id`),
    INDEX `artikel_unggulan_idx`(`unggulan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produk` (
    `id` CHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nama_panjang` VARCHAR(300) NOT NULL,
    `jenis` ENUM('BATUBARA', 'MINERAL') NOT NULL DEFAULT 'BATUBARA',
    `ringkas` VARCHAR(300) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `ikon` VARCHAR(191) NOT NULL,
    `peruntukan` VARCHAR(300) NOT NULL,
    `asal` TEXT NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('DRAF', 'TERBIT') NOT NULL DEFAULT 'DRAF',
    `unggulan` BOOLEAN NOT NULL DEFAULT false,
    `spesifikasi` JSON NOT NULL,
    `keunggulan` JSON NOT NULL,
    `galeri` JSON NOT NULL,
    `langkah` JSON NOT NULL,
    `sampul_id` CHAR(36) NULL,
    `seo_judul` VARCHAR(191) NULL,
    `seo_deskripsi` VARCHAR(300) NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    UNIQUE INDEX `produk_slug_key`(`slug`),
    INDEX `produk_status_urutan_idx`(`status`, `urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anggota_tim` (
    `id` CHAR(36) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `kelompok` ENUM('PIMPINAN', 'TIM') NOT NULL DEFAULT 'TIM',
    `bio` TEXT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `foto_id` CHAR(36) NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    INDEX `anggota_tim_kelompok_urutan_idx`(`kelompok`, `urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mitra` (
    `id` CHAR(36) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `sektor` VARCHAR(191) NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `logo_id` CHAR(36) NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perusahaan` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'tunggal',
    `nama` VARCHAR(191) NOT NULL,
    `nama_legal` VARCHAR(191) NOT NULL,
    `tagline` VARCHAR(300) NOT NULL,
    `berdiri` INTEGER NOT NULL,
    `intro` TEXT NOT NULL,
    `telepon` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(300) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `visi` TEXT NOT NULL,
    `sejarah` TEXT NOT NULL,
    `latar_belakang` TEXT NOT NULL,
    `diubah_pada` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kantor` (
    `id` CHAR(36) NOT NULL,
    `jenis` ENUM('PUSAT', 'CABANG') NOT NULL DEFAULT 'CABANG',
    `nama` VARCHAR(191) NOT NULL,
    `alamat` TEXT NOT NULL,
    `alamat_singkat` VARCHAR(300) NOT NULL,
    `telepon` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `maps_cid` VARCHAR(191) NOT NULL DEFAULT '',
    `maps_lat` DOUBLE NOT NULL DEFAULT 0,
    `maps_lng` DOUBLE NOT NULL DEFAULT 0,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    INDEX `kantor_urutan_idx`(`urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `beranda` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'tunggal',
    `pita_tag` VARCHAR(191) NOT NULL,
    `pita_teks` VARCHAR(300) NOT NULL,
    `pita_tautan` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(500) NOT NULL,
    `intro` TEXT NOT NULL,
    `cta_utama_label` VARCHAR(191) NOT NULL,
    `cta_utama_label_pendek` VARCHAR(191) NOT NULL,
    `cta_utama_href` VARCHAR(191) NOT NULL,
    `cta_kedua_label` VARCHAR(191) NOT NULL,
    `cta_kedua_label_pendek` VARCHAR(191) NOT NULL,
    `cta_kedua_href` VARCHAR(191) NOT NULL,
    `manifesto` TEXT NOT NULL,
    `foto_satu_id` CHAR(36) NULL,
    `foto_dua_id` CHAR(36) NULL,
    `diubah_pada` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statistik` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'tunggal',
    `jumlah_klien` INTEGER NOT NULL,
    `diubah_pada` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seo_halaman` (
    `jalur` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NULL,
    `deskripsi` VARCHAR(300) NULL,
    `diubah_pada` DATETIME(3) NOT NULL,

    PRIMARY KEY (`jalur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blok_konten` (
    `id` CHAR(36) NOT NULL,
    `jenis` ENUM('NILAI', 'MISI', 'ALASAN', 'LANGKAH', 'FAQ') NOT NULL,
    `ikon` VARCHAR(191) NULL,
    `judul` VARCHAR(300) NOT NULL,
    `isi` TEXT NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    INDEX `blok_konten_jenis_urutan_idx`(`jenis`, `urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perjalanan` (
    `id` CHAR(36) NOT NULL,
    `tahun` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(300) NOT NULL,
    `isi` TEXT NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    INDEX `perjalanan_urutan_idx`(`urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proyek` (
    `id` CHAR(36) NOT NULL,
    `judul` VARCHAR(300) NOT NULL,
    `lokasi` VARCHAR(191) NULL,
    `tahun` VARCHAR(191) NULL,
    `ringkas` TEXT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `foto_id` CHAR(36) NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    INDEX `proyek_urutan_idx`(`urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimoni` (
    `id` CHAR(36) NOT NULL,
    `kutipan` TEXT NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `peran` VARCHAR(191) NOT NULL,
    `organisasi` VARCHAR(191) NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `contoh` BOOLEAN NOT NULL DEFAULT false,
    `foto_id` CHAR(36) NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    INDEX `testimoni_urutan_idx`(`urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `layanan` (
    `id` CHAR(36) NOT NULL,
    `nama` VARCHAR(300) NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    UNIQUE INDEX `layanan_nama_key`(`nama`),
    INDEX `layanan_urutan_idx`(`urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grup_layanan` (
    `id` CHAR(36) NOT NULL,
    `ikon` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(300) NOT NULL,
    `isi` TEXT NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `cakupan` JSON NOT NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    INDEX `grup_layanan_urutan_idx`(`urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `image` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `session_token_key`(`token`),
    INDEX `session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `id` VARCHAR(191) NOT NULL,
    `issuer` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `idToken` TEXT NULL,
    `accessTokenExpiresAt` DATETIME(3) NULL,
    `refreshTokenExpiresAt` DATETIME(3) NULL,
    `scope` TEXT NULL,
    `password` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `account_userId_idx`(`userId`),
    UNIQUE INDEX `account_issuer_accountId_key`(`issuer`, `accountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `verification_identifier_idx`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MitraProduk` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_MitraProduk_AB_unique`(`A`, `B`),
    INDEX `_MitraProduk_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `artikel` ADD CONSTRAINT `artikel_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_artikel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artikel` ADD CONSTRAINT `artikel_sampul_id_fkey` FOREIGN KEY (`sampul_id`) REFERENCES `media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produk` ADD CONSTRAINT `produk_sampul_id_fkey` FOREIGN KEY (`sampul_id`) REFERENCES `media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anggota_tim` ADD CONSTRAINT `anggota_tim_foto_id_fkey` FOREIGN KEY (`foto_id`) REFERENCES `media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mitra` ADD CONSTRAINT `mitra_logo_id_fkey` FOREIGN KEY (`logo_id`) REFERENCES `media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `beranda` ADD CONSTRAINT `beranda_foto_satu_id_fkey` FOREIGN KEY (`foto_satu_id`) REFERENCES `media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `beranda` ADD CONSTRAINT `beranda_foto_dua_id_fkey` FOREIGN KEY (`foto_dua_id`) REFERENCES `media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proyek` ADD CONSTRAINT `proyek_foto_id_fkey` FOREIGN KEY (`foto_id`) REFERENCES `media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testimoni` ADD CONSTRAINT `testimoni_foto_id_fkey` FOREIGN KEY (`foto_id`) REFERENCES `media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MitraProduk` ADD CONSTRAINT `_MitraProduk_A_fkey` FOREIGN KEY (`A`) REFERENCES `mitra`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MitraProduk` ADD CONSTRAINT `_MitraProduk_B_fkey` FOREIGN KEY (`B`) REFERENCES `produk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

