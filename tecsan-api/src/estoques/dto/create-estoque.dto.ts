import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateEstoqueDto {
  @ApiProperty({ example: 'Estoque 1' })
  @IsString({ message: 'O nome do estoque deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  nome: string;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'O ID da fazenda deve ser um número inteiro.' })
  @Min(1, { message: 'O campo fazenda não pode ser vazio.' })
  @IsNotEmpty({ message: 'O campo fazenda não pode ser vazio.' })
  fazendaId: number;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'O status ativo deve ser um valor booleano.' })
  ativo: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt({ message: 'O ID do produto deve ser um número inteiro, se fornecido.' })
  produtoId?: number;
}
