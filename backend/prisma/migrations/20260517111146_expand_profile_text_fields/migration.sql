-- AlterTable
ALTER TABLE `userchatthread` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable: ubah shortDescription ke TEXT (MySQL tidak izinkan DEFAULT pada TEXT)
ALTER TABLE `userprofile` MODIFY `shortDescription` TEXT NOT NULL;
-- Pastikan baris yang NULL diisi dulu (seharusnya tidak ada karena default lama adalah '')
UPDATE `userprofile` SET `shortDescription` = '' WHERE `shortDescription` IS NULL;
