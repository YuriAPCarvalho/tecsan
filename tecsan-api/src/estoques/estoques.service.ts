import { Injectable } from '@nestjs/common';
import { CreateEstoqueDto } from './dto/create-estoque.dto';
import { UpdateEstoqueDto } from './dto/update-estoque.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class EstoquesService {

  constructor(private prisma: PrismaService) { }

  create(createEstoqueDto: CreateEstoqueDto) {
    return this.prisma.estoque.create({
      data: createEstoqueDto
    });
  }

  findAll() {
    return this.prisma.estoque.findMany();
  }

  findAllActives() {
    return this.prisma.estoque.findMany({
      where: {
        ativo: true
      },
      orderBy : {
        id: 'asc'
      }
    });
  }

  findOne(id: number) {
    return this.prisma.estoque.findUnique({
      where: {
        id
      }
    });
  }

  update(id: number, updateEstoqueDto: UpdateEstoqueDto) {
    return this.prisma.estoque.update({
      where: {
        id
      },
      data: updateEstoqueDto
    });
  }

  remove(id: number) {
    return this.prisma.estoque.update({
      where: {
        id
      },
      data: {
        ativo: false
      }
    });
  }
}
