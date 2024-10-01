import { PartialType } from '@nestjs/swagger';
import { CreateSaidaDto } from './create-saida.dto';

export class UpdateSaidaDto extends PartialType(CreateSaidaDto) {}
