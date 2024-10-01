-- AlterTable
ALTER TABLE "Saldo" ADD COLUMN     "categoriaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Saldo" ADD CONSTRAINT "Saldo_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
