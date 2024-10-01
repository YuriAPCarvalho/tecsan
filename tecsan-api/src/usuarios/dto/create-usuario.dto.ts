import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, IsBoolean, Matches } from "class-validator";

export class CreateUsuarioDto {

    @ApiProperty({
        description: 'O e-mail do usuário.',
        example: 'usuario@exemplo.com'
    })
    @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
    @IsString({ message: 'O e-mail deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo e-mail não pode estar vazio.' })
    email: string;

    @ApiProperty({
        description: 'O nome do usuário.',
        example: 'João da Silva'
    })
    @IsString({ message: 'O nome deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
    nome: string;

    @ApiProperty({
        description: 'O CPF do usuário.',
        example: '12345678901'
    })
    @IsString({ message: 'O CPF deve ser uma string.' })
    @IsNotEmpty({ message: 'O campo CPF não pode estar vazio.' })
    @Matches(/^\d{11}$/, { message: 'O CPF deve ter exatamente 11 dígitos.' })
    cpf: string;

    @ApiProperty({
        description: 'A senha do usuário.',
        example: 'senha123'
    })
    @IsString({ message: 'A senha deve ser uma string.' })
    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
    senha: string;

    @ApiProperty({
        description: 'Status de atividade do usuário.',
        example: true
    })
    @IsBoolean({ message: 'O status ativo deve ser um valor booleano.' })
    ativo: boolean;

}
