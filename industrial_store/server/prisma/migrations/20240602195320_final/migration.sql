/*
  Warnings:

  - You are about to drop the column `characteristicsId` on the `Buyer` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Buyer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `surname` on the `Buyer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Manufacturer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `totalAmount` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `name` on the `Seller` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `surname` on the `Seller` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Supplier` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the `BuyerCharacteristics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaleItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ageGroup` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profitPercentage` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `day` on the `WorkSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startTime` on the `WorkSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `WorkSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "BuyerCharacteristics" DROP CONSTRAINT "BuyerCharacteristics_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_saleId_fkey";

-- DropIndex
DROP INDEX "Buyer_characteristicsId_key";

-- AlterTable
ALTER TABLE "Buyer" DROP COLUMN "characteristicsId",
ADD COLUMN     "ageGroup" VARCHAR(50) NOT NULL,
ADD COLUMN     "gender" VARCHAR(10) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "surname" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Manufacturer" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "profitPercentage" DECIMAL(5,2) NOT NULL,
ADD COLUMN     "role" VARCHAR(50) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "surname" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "WorkSchedule" DROP COLUMN "day",
ADD COLUMN     "day" TIMESTAMP(3) NOT NULL,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" VARCHAR(5) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" VARCHAR(5) NOT NULL;

-- DropTable
DROP TABLE "BuyerCharacteristics";

-- DropTable
DROP TABLE "SaleItem";

-- CreateTable
CREATE TABLE "Salary" (
    "id" SERIAL NOT NULL,
    "workingHours" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "salesAmount" INTEGER NOT NULL,
    "salary" INTEGER,
    "month" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
