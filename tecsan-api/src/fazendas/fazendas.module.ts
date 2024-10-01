import { Module } from '@nestjs/common';
import { FazendasService } from './fazendas.service';
import { FazendasController } from './fazendas.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [FazendasController],
  providers: [FazendasService],
  imports: [PrismaModule],
})
export class FazendasModule {}
