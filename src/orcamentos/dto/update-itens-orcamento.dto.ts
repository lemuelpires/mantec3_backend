import { PartialType } from '@nestjs/mapped-types';
import { CreateItensOrcamentoDto } from './create-itens-orcamento.dto';

export class UpdateItensOrcamentoDto extends PartialType(CreateItensOrcamentoDto) {}