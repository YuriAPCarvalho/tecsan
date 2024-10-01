import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FazendasService } from './fazendas.service';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('fazendas')
@UseGuards(AuthGuard('jwt'))
@Controller('fazendas')
export class FazendasController {
  constructor(private readonly fazendasService: FazendasService) {}

  @Post()
  create(@Body() createFazendaDto: CreateFazendaDto) {
    return this.fazendasService.create(createFazendaDto);
  }

  @Get()
  findAll() {
    return this.fazendasService.findAll();
  }

  @Get('ativo')
  findAllActives() {
    return this.fazendasService.findAllActives();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fazendasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFazendaDto: UpdateFazendaDto) {
    return this.fazendasService.update(+id, updateFazendaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fazendasService.remove(+id);
  }
}
