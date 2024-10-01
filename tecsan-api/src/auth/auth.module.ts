import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'nestjs-prisma';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsuariosModule } from 'src/usuarios/usuarios.module'
import { JwtStrategy } from './strategy/jwt.strategy';

export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;
@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: TOKEN_SECRET,
      signOptions: { expiresIn: TOKEN_EXPIRES_IN },
    }),
    UsuariosModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
