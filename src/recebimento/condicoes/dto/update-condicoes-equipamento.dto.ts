import { PartialType } from '@nestjs/mapped-types';
import { CreateCondicoesEquipamentoDto } from './create-condicoes-equipamento.dto';

export class UpdateCondicoesEquipamentoDto extends PartialType(CreateCondicoesEquipamentoDto) {}