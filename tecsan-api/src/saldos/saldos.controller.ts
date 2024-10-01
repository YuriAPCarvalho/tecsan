import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { SaldosService } from './saldos.service';
import { CreateSaldoDto } from './dto/create-saldo.dto';
import { UpdateSaldoDto } from './dto/update-saldo.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Saldos')
@UseGuards(AuthGuard('jwt'))
@Controller('saldos')
export class SaldosController {
  constructor(private readonly saldosService: SaldosService) {}

  @Post()
  create(@Body() createSaldoDto: CreateSaldoDto) {
    return this.saldosService.create(createSaldoDto);
  }


  @Get()
  async findAll(
    @Query('categoriaId') categoriaId?: string,
    @Query('fazendaId') fazendaId?: string,
    @Query('estoqueId') estoqueId?: string,
    @Query('produtoId') produtoId?: string,
  ) {
    const categoriaIdNum = categoriaId ? parseInt(categoriaId, 10) : undefined;
    const fazendaIdNum = fazendaId ? parseInt(fazendaId, 10) : undefined;
    const estoqueIdNum = estoqueId ? parseInt(estoqueId, 10) : undefined;
    const produtoIdNum = produtoId ? parseInt(produtoId, 10) : undefined;

    if (
      (categoriaId && isNaN(categoriaIdNum)) ||
      (fazendaId && isNaN(fazendaIdNum)) ||
      (estoqueId && isNaN(estoqueIdNum)) ||
      (produtoId && isNaN(produtoIdNum))
    ) {
      throw new BadRequestException('Os parâmetros devem ser números válidos.');
    }

    return this.saldosService.findAll(categoriaIdNum, fazendaIdNum, estoqueIdNum, produtoIdNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saldosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaldoDto: UpdateSaldoDto) {
    return this.saldosService.update(+id, updateSaldoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saldosService.remove(+id);
  }
}
