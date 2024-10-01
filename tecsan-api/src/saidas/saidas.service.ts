import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaidaDto } from './dto/create-saida.dto';
import { UpdateSaidaDto } from './dto/update-saida.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SaidasService {

  constructor (private prisma: PrismaService) { }

  async create(createSaidaDto: CreateSaidaDto) {
    const { 
      produtoId, 
      estoqueId, 
      fazendaId, 
      quantidade, 
      usuarioId, 
      ativo 
    } = createSaidaDto;
  
    const saldoExistente = await this.prisma.saldo.findFirst({
      where: {
        produtoId,
        estoqueId,
        fazendaId,
      },
    });
  
    if (!saldoExistente || saldoExistente.saldo < quantidade) {
      throw new NotFoundException ('Não é possível realizar a saida: Saldo do produto insuficiente!');
    }
  
    const novaSaida = await this.prisma.$transaction(async (prisma) => {
      const saida = await prisma.saida.create({
        data: {
          produtoId,
          estoqueId,
          fazendaId,
          quantidade,
          usuarioId,
          ativo,
        },
      });
  
      const saldoAtualizado = await prisma.saldo.update({
        where: { id: saldoExistente.id },
        data: { saldo: saldoExistente.saldo - quantidade },
      });
  
      return { saida, saldoAtualizado };
    });
  
    return novaSaida;
  }

  findAll() {
    return this.prisma.saida.findMany({
      include: {
        produto: true,
        estoque: true,
        fazenda: true,
        usuario: true,
      },
    });
    

  }

  findOne(id: number) {
    return this.prisma.saida.findUnique({
      where : { 
        id 
      }
    });
  }

  update(id: number, updateSaidaDto: UpdateSaidaDto) {
    return `Rota não implementada`;	
  }

  async remove(id: number) {
    const saida = await this.prisma.saida.findUnique({
      where: { id },
    });
  
    if (!saida) {
      throw new NotFoundException(`Saída #${id} não encontrada`);
    }
  
    const { produtoId, estoqueId, fazendaId, quantidade } = saida;
  
    const saldoExistente = await this.prisma.saldo.findFirst({
      where: {
        produtoId,
        estoqueId,
        fazendaId,
      },
    });
  
    if (!saldoExistente) {
      throw new NotFoundException(`Saldo não encontrado para o produto ${produtoId}, estoque ${estoqueId}, fazenda ${fazendaId}`);
    }
  
    if (saldoExistente.saldo < quantidade) {
      throw new NotFoundException(`Saldo insuficiente para o produto ${produtoId}, estoque ${estoqueId}, fazenda ${fazendaId}`);
    }
  
    const result = await this.prisma.$transaction(async (prisma) => {
      const saldoAtualizado = await prisma.saldo.update({
        where: { id: saldoExistente.id },
        data: { saldo: saldoExistente.saldo + quantidade },
      });
  
      const saidaRemovida = await prisma.saida.delete({
        where: { id },
      });
  
      return { saidaRemovida, saldoAtualizado };
    });
  
    return result;
  }
}




