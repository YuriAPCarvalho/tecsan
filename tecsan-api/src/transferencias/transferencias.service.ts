import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransferenciaDto } from './dto/create-transferencia.dto';
import { UpdateTransferenciaDto } from './dto/update-transferencia.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TransferenciasService {
  constructor(private prisma: PrismaService) {}

  async create(createTransferenciaDto: CreateTransferenciaDto) {
    const {
      produtoId,
      estoqueOrigemId,
      fazendaOrigemId,
      estoqueDestinoId,
      fazendaDestinoId,
      quantidade,
      usuarioId,
      ativo,
    } = createTransferenciaDto;

    const [saldoOrigemExistente, saldoDestinoExistente] = await Promise.all([
      this.prisma.saldo.findFirst({
        where: {
          produtoId,
          estoqueId: estoqueOrigemId,
          fazendaId: fazendaOrigemId,
        },
      }),
      this.prisma.saldo.findFirst({
        where: {
          produtoId,
          estoqueId: estoqueDestinoId,
          fazendaId: fazendaDestinoId,
        },
      }),
    ]);

    if (!saldoOrigemExistente) {
      throw new BadRequestException('Saldo não encontrado para o estoque de origem');
    }

    if (saldoOrigemExistente.saldo < quantidade) {
      throw new BadRequestException('Estoque de origem não possui saldo suficiente');
    }

    if (fazendaOrigemId === fazendaDestinoId && estoqueOrigemId === estoqueDestinoId) {
      throw new BadRequestException('Não é possível realizar transferência para a mesma fazenda e estoque.');
    }

    await this.prisma.$transaction(async (prisma) => {
      if (!saldoDestinoExistente) {
        await prisma.saldo.create({
          data: {
            produtoId,
            estoqueId: estoqueDestinoId,
            fazendaId: fazendaDestinoId,
            categoriaId: saldoOrigemExistente.categoriaId,
            saldo: quantidade,
            ativo,
          },
        });
      }

      await prisma.transferencia.create({
        data: {
          produtoId,
          estoqueOrigemId,
          fazendaOrigemId,
          estoqueDestinoId,
          fazendaDestinoId,
          quantidade,
          usuarioId,
          ativo,
        },
      });

      await prisma.saldo.update({
        where: { id: saldoOrigemExistente.id },
        data: { saldo: saldoOrigemExistente.saldo - quantidade },
      });

      if (saldoDestinoExistente) {
        await prisma.saldo.update({
          where: { id: saldoDestinoExistente.id },
          data: { saldo: saldoDestinoExistente.saldo + quantidade },
        });
      }
    });

    return { message: 'Transferência realizada com sucesso' };
  }

  findAll() {
    return this.prisma.transferencia.findMany({

      include: {
        produto: true,
        estoqueOrigem: true,
        fazendaOrigem: true,
        estoqueDestino: true,
        fazendaDestino: true,
        usuario: true,
      },
    });
  }

  findOne(id: number) {
    const transferencia = this.prisma.transferencia.findUnique({
      where: { id },
    });

    if (!transferencia) {
      throw new NotFoundException('Transferência não encontrada');
    }

    return transferencia;
  }

  update(id: number, updateTransferenciaDto: UpdateTransferenciaDto) {
    throw new BadRequestException('Rota não implementada!');
  }

  async remove(id: number) {
    const transferencia = await this.prisma.transferencia.findUnique({
      where: { id },
    });

    if (!transferencia) {
      throw new NotFoundException('Transferência não encontrada');
    }

    const {
      produtoId,
      estoqueOrigemId,
      fazendaOrigemId,
      estoqueDestinoId,
      fazendaDestinoId,
      quantidade,
    } = transferencia;

    const [saldoOrigemExistente, saldoDestinoExistente] = await Promise.all([
      this.prisma.saldo.findFirst({
        where: {
          produtoId,
          estoqueId: estoqueOrigemId,
          fazendaId: fazendaOrigemId,
        },
      }),
      this.prisma.saldo.findFirst({
        where: {
          produtoId,
          estoqueId: estoqueDestinoId,
          fazendaId: fazendaDestinoId,
        },
      }),
    ]);

    if (!saldoOrigemExistente || !saldoDestinoExistente) {
      throw new NotFoundException('Saldo não encontrado para a origem ou destino');
    }

    if (saldoDestinoExistente.saldo < quantidade) {
      throw new BadRequestException('Estoque de destino não possui saldo suficiente');
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.transferencia.delete({
        where: { id },
      });

      await prisma.saldo.update({
        where: { id: saldoOrigemExistente.id },
        data: { saldo: saldoOrigemExistente.saldo + quantidade },
      });

      await prisma.saldo.update({
        where: { id: saldoDestinoExistente.id },
        data: { saldo: saldoDestinoExistente.saldo - quantidade },
      });
    });

    return { message: 'Transferência removida com sucesso' };
  }
}
