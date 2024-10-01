import { Injectable } from '@nestjs/common';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FazendasService {

  constructor(private prisma: PrismaService) { }

  create(createFazendaDto: CreateFazendaDto) {
    return this.prisma.fazenda.create({
      data: createFazendaDto
    });
  }

  findAll() {
    return this.prisma.fazenda.findMany();
  }

  findAllActives() {
    return this.prisma.fazenda.findMany({
      where: {
        ativo: true
      },
      orderBy : {
        id: 'asc'
      }
    });
  }

  findOne(id: number) {
    return this.prisma.fazenda.findUnique({
      where: {
        id
      }
    });
  }

  update(id: number, updateFazendaDto: UpdateFazendaDto) {
    return this.prisma.fazenda.update({
      where: {
        id
      },
      data: updateFazendaDto
    });
  }

  remove(id: number) {
    return this.prisma.fazenda.update({
      where: {
        id
      },
      data: {
        ativo: false
      }
    });
  }
}
