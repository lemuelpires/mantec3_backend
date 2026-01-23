import { PartialType } from '@nestjs/mapped-types';
import { CreateLogEventoDto } from './create-log-evento.dto';

export class UpdateLogEventoDto extends PartialType(CreateLogEventoDto) {}