import { PartialType } from '@nestjs/mapped-types';
import { CreateTermosRecebimentoDto } from './create-termos-recebimento.dto';

export class UpdateTermosRecebimentoDto extends PartialType(CreateTermosRecebimentoDto) {}