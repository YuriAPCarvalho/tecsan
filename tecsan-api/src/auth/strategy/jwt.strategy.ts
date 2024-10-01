import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { TOKEN_SECRET } from '../auth.module';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    
  constructor(private usersService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: TOKEN_SECRET,
    });
  }

  async validate(payload: { usuarioId: number }) {
    const user = await this.usersService.findOne(payload.usuarioId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}