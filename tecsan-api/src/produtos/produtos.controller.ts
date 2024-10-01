import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from '../config/multer.config';
import { ProdutoEstado } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('produtos')
@UseGuards(AuthGuard('jwt'))
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async create(

    @UploadedFile() file: Express.Multer.File & { key?: string }, @Body() envelope: { nome: string; patrimonio: string; categoriaId: string; estado: string; ativo: string }
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo não encontrado');
    }

    if (!envelope) {
      throw new BadRequestException('Dados do produto não encontrados');
    }

    const { nome, patrimonio, categoriaId, estado, ativo } = envelope

    const categoriaIdNumber = Number(categoriaId);
    const ativoBoolean = ativo === 'true';

    try {
      const fotoUrl = `${process.env.MINIO_ENDPOINT}/${process.env.BUCKET}/${file.key}`;

      const produto = await this.produtosService.create({
        nome,
        patrimonio,
        categoriaId: categoriaIdNumber,
        estado: ProdutoEstado[estado as keyof typeof ProdutoEstado],
        foto: fotoUrl,
        ativo: ativoBoolean,
      });
      return produto;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.produtosService.findAll();
  }

  @Get('ativo')
  findAllActives() {
    return this.produtosService.findAllActives();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('foto', multerOptions))
  async update(
  @Param('id') id: string, 
  @UploadedFile() file: Express.Multer.File & { key?: string },
  @Body() envelope: { nome?: string; patrimonio?: string; categoriaId?: string; estado?: string; ativo?: string }
) {
  if (!id) {
    throw new BadRequestException('ID do produto não fornecido');
  }

  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    throw new BadRequestException('ID do produto deve ser um número válido');
  }

  const categoriaIdNumber = envelope.categoriaId ? Number(envelope.categoriaId) : undefined;
  const ativoBoolean = envelope.ativo !== undefined ? envelope.ativo === 'true' : undefined;

  try {
    const produto = await this.produtosService.findOne(idNumber); 
    if (!produto) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }

    const updatedProduto = await this.produtosService.update(idNumber, { 
      nome: envelope.nome || produto.nome,
      patrimonio: envelope.patrimonio || produto.patrimonio,
      categoriaId: categoriaIdNumber !== undefined ? categoriaIdNumber : produto.categoriaId,
      estado: envelope.estado ? ProdutoEstado[envelope.estado as keyof typeof ProdutoEstado] : produto.estado,
      foto: file && file.key
        ? `${process.env.MINIO_ENDPOINT}/${process.env.BUCKET}/${file.key}`
        : produto.foto,
      ativo: ativoBoolean !== undefined ? ativoBoolean : produto.ativo,
    });

    return updatedProduto;
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw new HttpException('Erro ao atualizar produto', HttpStatus.BAD_REQUEST);
  }
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtosService.remove(+id);
  }
}
