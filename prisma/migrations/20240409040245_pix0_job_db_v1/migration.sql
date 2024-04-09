-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(30) NOT NULL,
    `title` VARCHAR(30) NOT NULL,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `hEmail` VARCHAR(191) NOT NULL,
    `hPhoneNumber` VARCHAR(191) NOT NULL,
    `googleId` VARCHAR(191) NULL,
    `userType` ENUM('HiringManager', 'JobSeeker', 'Both') NULL DEFAULT 'HiringManager',
    `country` VARCHAR(3) NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phoneNumber_key`(`phoneNumber`),
    UNIQUE INDEX `User_hEmail_key`(`hEmail`),
    UNIQUE INDEX `User_hPhoneNumber_key`(`hPhoneNumber`),
    UNIQUE INDEX `User_googleId_key`(`googleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoogleCredential` (
    `id` VARCHAR(15) NOT NULL,
    `userId` VARCHAR(30) NOT NULL,
    `accountId` VARCHAR(150) NOT NULL,
    `tokenId` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NULL,
    `refreshToken` VARCHAR(191) NULL,
    `refreshTokenExpiry` DATETIME(3) NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCompany` (
    `id` VARCHAR(15) NOT NULL,
    `userId` VARCHAR(30) NOT NULL,
    `regNo` VARCHAR(50) NULL,
    `name` VARCHAR(150) NULL,
    `industry` VARCHAR(60) NULL,
    `size` VARCHAR(60) NULL,
    `logoUrl` VARCHAR(255) NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_company_id_unique_constraint`(`id`),
    PRIMARY KEY (`id`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobPost` (
    `id` VARCHAR(20) NOT NULL,
    `companyId` VARCHAR(30) NOT NULL,
    `code` VARCHAR(50) NULL,
    `title` VARCHAR(150) NULL,
    `description` TEXT NULL,
    `workType` VARCHAR(30) NULL,
    `jobCategory` VARCHAR(50) NULL,
    `location` VARCHAR(100) NULL,
    `salaryFrom` FLOAT NULL,
    `salaryTo` FLOAT NULL,
    `createdBy` VARCHAR(30) NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateUpdated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `JobPost_id_key`(`id`),
    PRIMARY KEY (`id`, `companyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
