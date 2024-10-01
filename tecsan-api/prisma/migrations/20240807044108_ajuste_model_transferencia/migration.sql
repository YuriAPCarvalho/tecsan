/*
  Warnings:

  - You are about to drop the column `produtoDestinoId` on the `Transferencia` table. All the data in the column will be lost.
  - You are about to drop the column `produtoOrigemId` on the `Transferencia` table. All the data in the column will be lost.
  - Added the required column `produtoId` to the `Transferencia` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transferencia" DROP CONSTRAINT "Transferencia_produtoDestinoId_fkey";

-- DropForeignKey
ALTER TABLE "Transferencia" DROP CONSTRAINT "Transferencia_produtoOrigemId_fkey";

-- AlterTable
ALTER TABLE "Transferencia" DROP COLUMN "produtoDestinoId",
DROP COLUMN "produtoOrigemId",
ADD COLUMN     "produtoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
