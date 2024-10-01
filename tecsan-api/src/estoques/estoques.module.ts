import { Module } from '@nestjs/common';
import { EstoquesService } from './estoques.service';
import { EstoquesController } from './estoques.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [EstoquesController],
  providers: [EstoquesService],
  imports: [PrismaModule],
})
export class EstoquesModule {}
