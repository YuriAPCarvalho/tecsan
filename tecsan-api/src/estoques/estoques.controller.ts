import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EstoquesService } from './estoques.service';
import { CreateEstoqueDto } from './dto/create-estoque.dto';
import { UpdateEstoqueDto } from './dto/update-estoque.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('estoques')
@UseGuards(AuthGuard('jwt'))
@Controller('estoques')
export class EstoquesController {
  constructor(private readonly estoquesService: EstoquesService) {}

  @Post()
  create(@Body() createEstoqueDto: CreateEstoqueDto) {
    return this.estoquesService.create(createEstoqueDto);
  }

  @Get()
  findAll() {
    return this.estoquesService.findAll();
  }

  @Get('ativo')
  findAllActives() {
    return this.estoquesService.findAllActives();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estoquesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstoqueDto: UpdateEstoqueDto) {
    return this.estoquesService.update(+id, updateEstoqueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estoquesService.remove(+id);
  }
}
