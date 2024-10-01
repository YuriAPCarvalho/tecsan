import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean } from 'class-validator';

export class CreateSaldoDto {
    @ApiProperty({
        description: 'ID do registro.',
        example: 1,
      })
      @IsInt()
      id: number;

      @ApiProperty({
        description: 'ID da categoria relacionada.',
        example: 1,
      })
      @IsInt()
      categoriaId: number;
    
      @ApiProperty({
        description: 'ID da fazenda relacionada.',
        example: 1,
      })
      @IsInt()
      fazendaId: number;
    
      @ApiProperty({
        description: 'ID do estoque relacionado.',
        example: 1,
      })
      @IsInt()
      estoqueId: number;
    
      @ApiProperty({
        description: 'ID do produto relacionado.',
        example: 1,
      })
      @IsInt()
      produtoId: number;
    
      @ApiProperty({
        description: 'Saldo do produto no estoque.',
        example: 100,
      })
      @IsInt()
      saldo: number;
    
      @ApiProperty({
        description: 'Status de atividade do saldo.',
        example: true,
      })
      @IsBoolean()
      ativo: boolean;
    }
