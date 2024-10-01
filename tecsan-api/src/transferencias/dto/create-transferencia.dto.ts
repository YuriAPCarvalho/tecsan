import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean, IsNotEmpty, Min } from 'class-validator';

export class CreateTransferenciaDto {
    
    @ApiProperty({
        description: 'ID do produto.',
        example: 1,
    })
    @IsInt({ message: 'O ID do produto deve ser um número inteiro.' })
    @Min(1, { message: 'O campo produto não pode ser vazio.' })
    @IsNotEmpty({ message: 'O campo produto não pode estar vazio.' })
    produtoId: number;
    
    @ApiProperty({
        description: 'ID do estoque de origem.',
        example: 1,
    })
    @IsInt({ message: 'O ID do estoque de origem deve ser um número inteiro.' })
    @Min(1, { message: 'O campo estoque de origem não pode ser vazio.' })
    @IsNotEmpty({ message: 'O campo estoque de origem não pode estar vazio.' })
    estoqueOrigemId: number;
    
    @ApiProperty({
        description: 'ID da fazenda de origem.',
        example: 1,
    })
    @IsInt({ message: 'O ID da fazenda de origem deve ser um número inteiro.' })
    @Min(1, { message: 'O campo fazenda de origem não pode ser vazio.' })
    @IsNotEmpty({ message: 'O campo fazenda de origem não pode estar vazio.' })
    fazendaOrigemId: number;
    
    @ApiProperty({
        description: 'ID do estoque de destino.',
        example: 2,
    })
    @IsInt({ message: 'O ID do estoque de destino deve ser um número inteiro.' })
    @Min(1, { message: 'O campo estoque de destino não pode ser vazio.' })
    @IsNotEmpty({ message: 'O campo estoque de destino não pode estar vazio.' })
    estoqueDestinoId: number;
    
    @ApiProperty({
        description: 'ID da fazenda de destino.',
        example: 2,
    })
    @IsInt({ message: 'O ID da fazenda de destino deve ser um número inteiro.' })
    @Min(1, { message: 'O campo fazenda de destino não pode ser vazio.' })
    @IsNotEmpty({ message: 'O campo fazenda de destino não pode estar vazio.' })
    fazendaDestinoId: number;
    
    @ApiProperty({
        description: 'Quantidade transferida.',
        example: 30,
    })
    @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'O campo quantidade não pode estar vazio.' })
    quantidade: number;
    
    @ApiProperty({
        description: 'ID do usuário que gerencia a transferência.',
        example: 1,
    })
    @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
    @IsNotEmpty({ message: 'O campo usuário não pode estar vazio.' })
    usuarioId: number;
    
    @ApiProperty({
        description: 'Status de atividade da transferência.',
        example: true,
    })
    @IsBoolean({ message: 'O campo ativo deve ser um valor booleano.' })
    ativo: boolean = true;
}
