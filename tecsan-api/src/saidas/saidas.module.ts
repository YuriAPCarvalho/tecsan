import { Module } from '@nestjs/common';
import { SaidasService } from './saidas.service';
import { SaidasController } from './saidas.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [SaidasController],
  providers: [SaidasService],
  imports: [PrismaModule],
})
export class SaidasModule {}
