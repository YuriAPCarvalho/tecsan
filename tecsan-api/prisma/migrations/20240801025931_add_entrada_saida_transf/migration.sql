-- CreateTable
CREATE TABLE "Entrada" (
    "id" SERIAL NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "estoqueId" INTEGER NOT NULL,
    "fazendaId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saida" (
    "id" SERIAL NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "estoqueId" INTEGER NOT NULL,
    "fazendaId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Saida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transferencia" (
    "id" SERIAL NOT NULL,
    "produtoOrigemId" INTEGER NOT NULL,
    "estoqueOrigemId" INTEGER NOT NULL,
    "fazendaOrigemId" INTEGER NOT NULL,
    "produtoDestinoId" INTEGER NOT NULL,
    "estoqueDestinoId" INTEGER NOT NULL,
    "fazendaDestinoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transferencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FazendaToTransferencia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EstoqueToTransferencia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProdutoToTransferencia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FazendaToTransferencia_AB_unique" ON "_FazendaToTransferencia"("A", "B");

-- CreateIndex
CREATE INDEX "_FazendaToTransferencia_B_index" ON "_FazendaToTransferencia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EstoqueToTransferencia_AB_unique" ON "_EstoqueToTransferencia"("A", "B");

-- CreateIndex
CREATE INDEX "_EstoqueToTransferencia_B_index" ON "_EstoqueToTransferencia"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProdutoToTransferencia_AB_unique" ON "_ProdutoToTransferencia"("A", "B");

-- CreateIndex
CREATE INDEX "_ProdutoToTransferencia_B_index" ON "_ProdutoToTransferencia"("B");

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_estoqueId_fkey" FOREIGN KEY ("estoqueId") REFERENCES "Estoque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_fazendaId_fkey" FOREIGN KEY ("fazendaId") REFERENCES "Fazenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saida" ADD CONSTRAINT "Saida_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saida" ADD CONSTRAINT "Saida_estoqueId_fkey" FOREIGN KEY ("estoqueId") REFERENCES "Estoque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saida" ADD CONSTRAINT "Saida_fazendaId_fkey" FOREIGN KEY ("fazendaId") REFERENCES "Fazenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saida" ADD CONSTRAINT "Saida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_produtoOrigemId_fkey" FOREIGN KEY ("produtoOrigemId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_estoqueOrigemId_fkey" FOREIGN KEY ("estoqueOrigemId") REFERENCES "Estoque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_fazendaOrigemId_fkey" FOREIGN KEY ("fazendaOrigemId") REFERENCES "Fazenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_produtoDestinoId_fkey" FOREIGN KEY ("produtoDestinoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_estoqueDestinoId_fkey" FOREIGN KEY ("estoqueDestinoId") REFERENCES "Estoque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_fazendaDestinoId_fkey" FOREIGN KEY ("fazendaDestinoId") REFERENCES "Fazenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FazendaToTransferencia" ADD CONSTRAINT "_FazendaToTransferencia_A_fkey" FOREIGN KEY ("A") REFERENCES "Fazenda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FazendaToTransferencia" ADD CONSTRAINT "_FazendaToTransferencia_B_fkey" FOREIGN KEY ("B") REFERENCES "Transferencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EstoqueToTransferencia" ADD CONSTRAINT "_EstoqueToTransferencia_A_fkey" FOREIGN KEY ("A") REFERENCES "Estoque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EstoqueToTransferencia" ADD CONSTRAINT "_EstoqueToTransferencia_B_fkey" FOREIGN KEY ("B") REFERENCES "Transferencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoToTransferencia" ADD CONSTRAINT "_ProdutoToTransferencia_A_fkey" FOREIGN KEY ("A") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoToTransferencia" ADD CONSTRAINT "_ProdutoToTransferencia_B_fkey" FOREIGN KEY ("B") REFERENCES "Transferencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
