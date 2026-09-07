-- CreateTable
CREATE TABLE `slide` (
    `id` CHAR(36) NOT NULL,
    `foto_id` CHAR(36) NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diubah_pada` DATETIME(3) NOT NULL,
    `dihapus_pada` DATETIME(3) NULL,

    INDEX `slide_urutan_idx`(`urutan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `slide` ADD CONSTRAINT `slide_foto_id_fkey` FOREIGN KEY (`foto_id`) REFERENCES `media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
