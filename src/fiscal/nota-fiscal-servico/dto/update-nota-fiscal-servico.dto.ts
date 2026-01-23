import { PartialType } from '@nestjs/mapped-types';
import { CreateNotaFiscalServicoDto } from './create-nota-fiscal-servico.dto';

export class UpdateNotaFiscalServicoDto extends PartialType(CreateNotaFiscalServicoDto) {}