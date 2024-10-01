import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    cpf: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty()
    senha: string;

}