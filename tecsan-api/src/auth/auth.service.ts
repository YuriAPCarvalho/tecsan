import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async login(cpf: string, senha: string): Promise<AuthEntity> {
        const usuario = await this.prisma.usuario.findUnique({ where: { cpf } });

        if (!usuario) {
            throw new NotFoundException(`Nenhum usuário encontrado para o cpf: ${cpf}`);
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new UnauthorizedException('Senha inválida');
        }

        if (!usuario.ativo) {
            throw new UnauthorizedException('Usuário inativo');
        }

        const accessToken = this.jwtService.sign({ usuarioId: usuario.id }, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken = this.jwtService.sign({ usuarioId: usuario.id }, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

        return {
            accessToken,
            refreshToken,
            nome: usuario.nome,
            email: usuario.email,
            cpf: usuario.cpf,
            id: usuario.id,
        };
    }

    async refreshToken(refreshToken: string): Promise<AuthEntity> {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const usuario = await this.prisma.usuario.findUnique({ where: { id: payload.usuarioId } });

            if (!usuario) {
                throw new UnauthorizedException('Usuário não encontrado');
            }

            const newAccessToken = this.jwtService.sign({ usuarioId: usuario.id }, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

            return {
                accessToken: newAccessToken,
                refreshToken, 
                nome: usuario.nome,
                email: usuario.email,
                cpf: usuario.cpf,
                id: usuario.id,
            };
        } catch (e) {
            throw new UnauthorizedException('Refresh token inválido');
        }
    }
}
