import { Module } from '@nestjs/common';
import { SaldosService } from './saldos.service';
import { SaldosController } from './saldos.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [SaldosController],
  providers: [SaldosService],
  imports: [PrismaModule],
})
export class SaldosModule {}
