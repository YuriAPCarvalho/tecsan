import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CategoriasService {

  constructor(private prisma: PrismaService) { }

  create(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({
      data: createCategoriaDto
    }); 
  }

  findAll() {
    return this.prisma.categoria.findMany();
  }

  findAllActives() {
    return this.prisma.categoria.findMany({
      where: {
        ativo: true
      },
      orderBy : {
        id: 'asc'
      } 
    });
  }

  findOne(id: number) {
    return this.prisma.categoria.findUnique({
      where: {
        id
      }
    }); 
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return this.prisma.categoria.update({
      where: {
        id
      },
      data: updateCategoriaDto
    });
  }

  remove(id: number) {
    return this.prisma.categoria.update({
      where: {
        id
      },
      data: {
        ativo: false
      }
    });
  }
}
