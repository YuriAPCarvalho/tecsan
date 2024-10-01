import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsBoolean, IsNotEmpty, Min } from 'class-validator';

export class CreateEntradaDto {
    
    @ApiProperty({
        description: 'ID do produto relacionado.',
        example: 1,
    })
    @IsInt({ message: 'O ID do produto deve ser um número inteiro.' })
    @Min(1, { message: 'O campo produto não pode ser vazio.' })
    @IsNotEmpty({ message: 'O campo produto não pode estar vazio.' })
    produtoId: number;

    @ApiProperty({
        description: 'ID da categoria relacionado.',
        example: 1,
    })
    @IsInt({ message: 'O ID da categoria deve ser um número inteiro.' })
    @Min(1, { message: 'O campo categoria não pode ser vazio.' })
    @IsNotEmpty({ message: 'O campo categoria não pode estar vazio.' })
    categoriaId: number;
    
    @ApiProperty({
        description: 'ID do estoque relacionado.',
        example: 1,
    })
    @IsInt({ message: 'O ID do estoque deve ser um número inteiro.' })
    @Min(1, { message: 'O campo estoque não pode ser vazio.' })
    @IsNotEmpty({ message: 'O campo estoque não pode estar vazio.' })
    estoqueId: number;
    
    @ApiProperty({
        description: 'ID da fazenda relacionada.',
        example: 1,
    })
    @IsInt({ message: 'O ID da fazenda deve ser um número inteiro.' })
    @Min(1, { message: 'O campo fazenda não pode ser vazio.' })
    @IsNotEmpty({ message: 'O campo fazenda não pode estar vazio.' })
    fazendaId: number;
    
    @ApiProperty({
        description: 'Quantidade do produto.',
        example: 100,
    })
    @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'O campo quantidade não pode estar vazio.' })
    quantidade: number;
    
    @ApiProperty({
        description: 'Valor do produto.',
        example: 49.99,
    })
    @IsNumber({}, { message: 'O valor deve ser um número.' })
    @IsNotEmpty({ message: 'O campo valor não pode estar vazio.' })
    valor: number;
    
    @ApiProperty({
        description: 'ID do usuário que gerencia o estoque.',
        example: 1,
    })
    @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'O usuário não pode estar vazio.' })
    usuarioId: number;
    
    @ApiProperty({
        description: 'Status de atividade do produto no estoque.',
        example: true,
    })
    @IsBoolean()
    ativo: boolean = true;
  }
  