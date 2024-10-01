import { Module } from '@nestjs/common';
import { TransferenciasService } from './transferencias.service';
import { TransferenciasController } from './transferencias.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [TransferenciasController],
  providers: [TransferenciasService],
  imports: [PrismaModule],
})
export class TransferenciasModule {}
