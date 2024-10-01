import { Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { PrismaService } from 'nestjs-prisma';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from 'src/config/minio.config';
import { ProdutoEstado } from '@prisma/client';

@Injectable()
export class ProdutosService {

  constructor(private prisma: PrismaService) { }

  create(createProdutoDto: CreateProdutoDto) {
    return this.prisma.produto.create({
      data: createProdutoDto
    });
  }

  async deleteImage(filename: string) {
    const bucket = process.env.NODE_ENV === 'production' ? 'prd' : 'hml';
    const key = filename.split('/').pop(); 

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      await s3Client.send(command);
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
      throw new Error('Erro ao deletar imagem');
    }
  }

  async deleteImageByProdutoId(produtoId: number) {
    const produto = await this.findOne(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado na base de dados');
    }

    await this.deleteImage(produto.foto);
  }

  findAll() {
    return this.prisma.produto.findMany();
  }

  findAllActives() {
    return this.prisma.produto.findMany({
      where: {
        ativo: true
      },
      orderBy : {
        nome: 'asc'
      }
    });
  }

  findOne(id: number) {
    return this.prisma.produto.findUnique({
      where: {
        id
      }
    });
  }

  async update(id: number, updateProdutoDto: {
    nome?: string;
    patrimonio?: string;
    categoriaId?: number; 
    estado?: ProdutoEstado;
    foto?: string;
    ativo?: boolean;
  }) {
    return this.prisma.produto.update({
      where: { id: id },
      data: updateProdutoDto,
    });
  }

  async remove(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (produto && produto.foto) {
      await this.deleteImage(produto.foto);
    }

    return this.prisma.produto.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
