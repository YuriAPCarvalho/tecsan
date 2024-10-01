import { Injectable } from '@nestjs/common';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class InventariosService {

  constructor(private readonly prisma: PrismaService) { }

  create(createInventarioDto: CreateInventarioDto) {
    return this.prisma.inventario.create({ data: createInventarioDto });
  }

  async registrarInventario(inventarioDtos: CreateInventarioDto[]) {

    return this.prisma.$transaction(async (prisma) => {
      for (const dto of inventarioDtos) {
        const saldo = await prisma.saldo.findFirst({
          where: {
            fazendaId: dto.fazendaId,
            estoqueId: dto.estoqueId,
            produtoId: dto.produtoId,
          },
        });

        if (!saldo) {
          throw new Error(`Saldo não encontrado para o produto ${dto.produtoId}`);
        }

        const quantidadeAnterior = saldo.saldo;

        await prisma.inventario.create({
          data: {
            fazendaId: dto.fazendaId,
            estoqueId: dto.estoqueId,
            produtoId: dto.produtoId,
            quantidadeAnterior,
            quantidadeAtual: dto.quantidadeAtual,
            usuarioId: dto.usuarioId,
          },
        });

        await prisma.saldo.update({
          where: { id: saldo.id },
          data: { saldo: dto.quantidadeAtual },
        });
      }

      return { message: 'Inventário registrado com sucesso' };
    });
  }

  findAll() {
    return this.prisma.inventario.findMany({
      include: {
        usuario: true
      }
    });
  }

  findOne(id: number) {
    return this.prisma.inventario.findUnique({
      where: { id },
    });
  }

  update(id: number, updateInventarioDto: UpdateInventarioDto) {
    return this.prisma.inventario.update({
      where: { id },
      data: updateInventarioDto,
    });
  }

  remove(id: number) {
    return this.prisma.inventario.delete({
      where: { id },
    });
  }
}
