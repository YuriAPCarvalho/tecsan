import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [PrismaModule],
  exports: [UsuariosService]
})
export class UsuariosModule {}
