import { Module } from '@nestjs/common';
import { InventariosService } from './inventarios.service';
import { InventariosController } from './inventarios.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [InventariosController],
  providers: [InventariosService],
  imports: [PrismaModule],
})
export class InventariosModule {}
