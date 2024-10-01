import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InventariosService } from './inventarios.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Inventarios')
@UseGuards(AuthGuard('jwt'))
@Controller('inventarios')
export class InventariosController {
  constructor(private readonly inventariosService: InventariosService) {}

  @Post()
  async registrarInventario(
    @Body() inventarioDtos: CreateInventarioDto[],
  ) {
    return this.inventariosService.registrarInventario(inventarioDtos);
  }

  @Get()
  findAll() {
    return this.inventariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventarioDto: UpdateInventarioDto) {
    return this.inventariosService.update(+id, updateInventarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventariosService.remove(+id);
  }
}
