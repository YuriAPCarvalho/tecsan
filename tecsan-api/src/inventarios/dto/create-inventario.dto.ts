import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateInventarioDto {
  
  @ApiProperty({
    description: 'ID da fazenda relacionada.',
    example: 1,
  })
  @IsInt({ message: 'O ID da fazenda deve ser um número inteiro.' })
  @Min(1, { message: 'O campo fazenda não pode estar vazio.' })
  @IsNotEmpty({ message: 'O campo fazenda não pode estar vazio.' })
  fazendaId: number;

  @ApiProperty({
    description: 'ID do estoque relacionado.',
    example: 1,
  })
  @IsInt({ message: 'O ID do estoque deve ser um número inteiro.' })
  @Min(1, { message: 'O campo estoque não pode estar vazio.' })
  @IsNotEmpty({ message: 'O campo estoque não pode estar vazio.' })
  estoqueId: number;

  @ApiProperty({
    description: 'ID do produto relacionado.',
    example: 1,
  })
  @IsInt({ message: 'O ID do produto deve ser um número inteiro.' })
  @Min(1, { message: 'O campo produto não pode estar vazio.' })
  @IsNotEmpty({ message: 'O campo produto não pode estar vazio.' })
  produtoId: number;

  @ApiProperty({
    description: 'Quantidade anterior do produto no estoque.',
    example: 150,
  })
  @IsInt({ message: 'A quantidade anterior deve ser um número inteiro.' })
  quantidadeAnterior: number;

  @ApiProperty({
    description: 'Quantidade atual do produto no estoque.',
    example: 120,
  })
  @IsInt({ message: 'A quantidade atual deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O campo quantidade atual não pode estar vazio.' })
  quantidadeAtual: number;

  @ApiProperty({
    description: 'ID do usuário que gerencia o inventário.',
    example: 1,
  })
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
  @Min(1, { message: 'O campo usuário não pode estar vazio.' })
  @IsNotEmpty({ message: 'O campo usuário não pode estar vazio.' })
  usuarioId: number;
}
