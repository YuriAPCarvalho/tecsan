import { Injectable } from '@nestjs/common';
import { CreateSaldoDto } from './dto/create-saldo.dto';
import { UpdateSaldoDto } from './dto/update-saldo.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SaldosService {

  constructor(private readonly prisma: PrismaService) {}

  create(createSaldoDto: CreateSaldoDto) {
    return this.prisma.saldo.create({ data: createSaldoDto });
  }


  findOne(id: number) {
    return this.prisma.saldo.findUnique({
      where: {
        id
      }
    });
  }

  async findAll(categoriaId?: number, fazendaId?: number, estoqueId?: number, produtoId?: number) {
    const where: any = {};
    if (categoriaId !== undefined) where.categoriaId = categoriaId;
    if (fazendaId !== undefined) where.fazendaId = fazendaId;
    if (estoqueId !== undefined) where.estoqueId = estoqueId;
    if (produtoId !== undefined) where.produtoId = produtoId;

    return this.prisma.saldo.findMany({
      where,
      include: {
        fazenda: {
          select: { nome: true },
        },
        estoque: {
          select: { nome: true },
        },
        produto: {
          select: { nome: true },
        },
        categoria: {
          select: { nome: true },
      },
    },
      orderBy: [
        { produto: { nome: 'asc' } },
        { estoque: { nome: 'asc' } },
        { fazenda: { nome: 'asc' } }
      ]
    });
  }

  update(id: number, updateSaldoDto: UpdateSaldoDto) {
    return this.prisma.saldo.update({
      where: { id },
      data: updateSaldoDto,
    });
  }

  remove(id: number) {
    return this.prisma.saldo.delete({
      where: { id },
    });
  }
}
