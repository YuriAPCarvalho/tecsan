import { Module } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { EntradasController } from './entradas.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [EntradasController],
  providers: [EntradasService],
  imports: [PrismaModule],
})
export class EntradasModule {}
