import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransferenciasService } from './transferencias.service';
import { CreateTransferenciaDto } from './dto/create-transferencia.dto';
import { UpdateTransferenciaDto } from './dto/update-transferencia.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Transferencias')
@UseGuards(AuthGuard('jwt'))
@Controller('transferencias')
export class TransferenciasController {
  constructor(private readonly transferenciasService: TransferenciasService) {}

  @Post()
  create(@Body() createTransferenciaDto: CreateTransferenciaDto) {
    return this.transferenciasService.create(createTransferenciaDto);
  }

  @Get()
  findAll() {
    return this.transferenciasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferenciasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransferenciaDto: UpdateTransferenciaDto) {
    return this.transferenciasService.update(+id, updateTransferenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferenciasService.remove(+id);
  }
}
