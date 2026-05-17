-- CreateTable
CREATE TABLE `UserChatThread` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'Chat',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserChatThread_userId_idx`(`userId`),
    INDEX `UserChatThread_updatedAt_idx`(`updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add threadId to messages (nullable first for backfill)
ALTER TABLE `UserChatMessage` ADD COLUMN `threadId` VARCHAR(191) NULL;
CREATE INDEX `UserChatMessage_threadId_idx` ON `UserChatMessage`(`threadId`);

-- Backfill: create a single thread per user from existing messages
INSERT INTO `UserChatThread` (`id`, `userId`, `title`, `createdAt`, `updatedAt`)
SELECT UUID(), `userId`,
  CONCAT('Chat ', DATE_FORMAT(MIN(`createdAt`), '%Y-%m-%d %H:%i')),
  MIN(`createdAt`),
  MAX(`createdAt`)
FROM `UserChatMessage`
GROUP BY `userId`;

UPDATE `UserChatMessage` AS m
JOIN `UserChatThread` AS t ON t.`userId` = m.`userId`
SET m.`threadId` = t.`id`
WHERE m.`threadId` IS NULL;

-- Enforce not-null and foreign keys
ALTER TABLE `UserChatMessage` MODIFY `threadId` VARCHAR(191) NOT NULL;

ALTER TABLE `UserChatThread`
  ADD CONSTRAINT `UserChatThread_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `UserChatMessage`
  ADD CONSTRAINT `UserChatMessage_threadId_fkey`
  FOREIGN KEY (`threadId`) REFERENCES `UserChatThread`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
