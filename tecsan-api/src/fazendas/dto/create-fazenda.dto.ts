import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFazendaDto {
  @ApiProperty({ example: 'Fazenda 1' })
  @IsString()
  @IsNotEmpty({ message:"O campo nome não pode estar vazio."})
  nome: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  ativo: boolean;
}