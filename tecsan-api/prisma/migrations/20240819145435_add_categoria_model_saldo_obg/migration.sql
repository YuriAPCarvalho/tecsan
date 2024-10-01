/*
  Warnings:

  - Made the column `categoriaId` on table `Saldo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Saldo" DROP CONSTRAINT "Saldo_categoriaId_fkey";

-- AlterTable
ALTER TABLE "Saldo" ALTER COLUMN "categoriaId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Saldo" ADD CONSTRAINT "Saldo_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
