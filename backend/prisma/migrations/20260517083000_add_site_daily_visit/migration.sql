CREATE TABLE `SiteDailyVisit` (
  `id` VARCHAR(191) NOT NULL,
  `siteId` VARCHAR(191) NOT NULL,
  `visitDate` DATE NOT NULL,
  `count` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `SiteDailyVisit_siteId_visitDate_key` (`siteId`, `visitDate`),
  INDEX `SiteDailyVisit_visitDate_idx` (`visitDate`),
  CONSTRAINT `SiteDailyVisit_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `Site`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
