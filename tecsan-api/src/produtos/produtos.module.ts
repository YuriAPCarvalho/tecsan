import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [ProdutosController],
  providers: [ProdutosService],
  imports: [PrismaModule],
})
export class ProdutosModule {}
