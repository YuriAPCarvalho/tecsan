import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SaidasService } from './saidas.service';
import { CreateSaidaDto } from './dto/create-saida.dto';
import { UpdateSaidaDto } from './dto/update-saida.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Saidas')
@UseGuards(AuthGuard('jwt'))
@Controller('saidas')
export class SaidasController {
  constructor(private readonly saidasService: SaidasService) {}

  @Post()
  create(@Body() createSaidaDto: CreateSaidaDto) {
    return this.saidasService.create(createSaidaDto);
  }

  @Get()
  findAll() {
    return this.saidasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saidasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaidaDto: UpdateSaidaDto) {
    return this.saidasService.update(+id, updateSaidaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saidasService.remove(+id);
  }
}
