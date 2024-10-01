import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';

export const ROUNDS_OF_HASHING = 10;

@Injectable()
export class UsuariosService {

  constructor(private prisma: PrismaService) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.senha, ROUNDS_OF_HASHING);
    return this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        senha: hashedPassword
      }
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        cpf: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: {
        id
      }
    });
  }

  findAllActive() {
    return this.prisma.usuario.findMany({
      where: {
        ativo: true
      }
    });
  }

  findAllInactive() {
    return this.prisma.usuario.findMany({
      where: {
        ativo: false
      }
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    let hashedPassword: string

    if (updateUsuarioDto.senha) {
      const currentUser = await this.prisma.usuario.findUnique({
        where: { id },
        select: { senha: true }
      });

      if(currentUser.senha != updateUsuarioDto.senha) {
        hashedPassword = await bcrypt.hash(updateUsuarioDto.senha, ROUNDS_OF_HASHING);
        updateUsuarioDto.senha = hashedPassword
      }
     }

    return this.prisma.usuario.update({
      where: {
        id
      },
      data: updateUsuarioDto
    });
  }

  remove(id: number) {
    return this.prisma.usuario.update({
      where: {
        id
      },
      data: {
        ativo: false
      }
    });
  }
}
