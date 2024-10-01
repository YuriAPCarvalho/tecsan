import { ApiProperty } from '@nestjs/swagger';
import { ProdutoEstado } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProdutoDto {
  @ApiProperty({ example: 'Produto 1' })
  @IsString({ message: 'O nome do produto deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  nome: string;

  @ApiProperty({ example: '123456' })
  @IsString({ message: 'O patrimônio deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo patrimônio não pode estar vazio.' })
  patrimonio: string;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'O ID da categoria deve ser um número inteiro.' })
  @Min(1, { message: 'O campo categoria não pode ser vazio.' })
  @IsNotEmpty({ message: 'O campo categoria não pode estar vazio.' })
  categoriaId: number;

  @ApiProperty({ example: 'novo' })
  @IsEnum(ProdutoEstado, { message: 'O estado do produto deve ser um valor válido.' })
  @IsNotEmpty({ message: 'O campo estado não pode estar vazio.' })
  estado: ProdutoEstado;

  @ApiProperty({ example: 'url/da/foto.jpg' })
  @IsString({ message: 'A URL da foto deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo foto não pode estar vazio.' })
  foto: string;
  
  @ApiProperty({ example: true })
  @IsBoolean({ message: 'O campo ativo deve ser um valor booleano.' })
  ativo: boolean = true;
}