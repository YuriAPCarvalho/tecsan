import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Categoria 1' })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  nome: string;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'O campo ativo deve ser um valor booleano.' })
  ativo: boolean;
}