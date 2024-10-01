import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { PrismaService } from 'nestjs-prisma';


@Injectable()
export class EntradasService {

  constructor (private prisma: PrismaService) { }

  async create(createEntradaDto: CreateEntradaDto) {
    const { produtoId, estoqueId, fazendaId, categoriaId, quantidade, valor, usuarioId, ativo } = createEntradaDto;
  
    const saldoExistente = await this.prisma.saldo.findFirst({
      where: { produtoId, estoqueId, fazendaId },
    });
  
    const result = await this.prisma.$transaction(async (prisma) => {
      const novaEntrada = await prisma.entrada.create({
        data: { produtoId, estoqueId, fazendaId, quantidade, valor, usuarioId, ativo },
      });
  
      let saldoAtualizadoOuNovoSaldo;
      if (saldoExistente) {
        saldoAtualizadoOuNovoSaldo = await prisma.saldo.update({
          where: { id: saldoExistente.id },
          data: { saldo: saldoExistente.saldo + quantidade },
        });
      } else {
        saldoAtualizadoOuNovoSaldo = await prisma.saldo.create({
          data: { produtoId, estoqueId, fazendaId, categoriaId, saldo: quantidade, ativo },
        });
      }
  
      return { novaEntrada, saldo: saldoAtualizadoOuNovoSaldo };
    });
  
    return result;
  }
  

  findAll() {
    return this.prisma.entrada.findMany({

      include: {
        produto: true,
        estoque: true,
        fazenda: true,
        usuario: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.entrada.findUnique({
      where: {
        id
      }
  });
}

  update(id: number, updateEntradaDto: UpdateEntradaDto) {
    return `Rota não implementada`;	
  }

  async remove(id: number) {
    const entrada = await this.prisma.entrada.findUnique({
      where: { id },
    });
  
    if (!entrada) {
      throw new NotFoundException('Entrada não encontrada');
    }
  
    const { produtoId, estoqueId, fazendaId, quantidade } = entrada;
  
    const saldoExistente = await this.prisma.saldo.findFirst({
      where: { produtoId, estoqueId, fazendaId },
    });
  
    if (!saldoExistente) {
      throw new NotFoundException(`Saldo não encontrado para o produto ${produtoId}, estoque ${estoqueId}, fazenda ${fazendaId}`);
    }
  
    if (quantidade > saldoExistente.saldo) {
      throw new NotFoundException('Não é possível remover a quantidade informada. Saldo insuficiente.');
    }
  
    const result = await this.prisma.$transaction(async (prisma) => {
      const saldoAtualizado = await prisma.saldo.update({
        where: { id: saldoExistente.id },
        data: { saldo: saldoExistente.saldo - quantidade },
      });
  
      const entradaRemovida = await prisma.entrada.delete({
        where: { id },
      });
  
      return { entradaRemovida, saldoAtualizado };
    });
  
    return result;
  }
}
