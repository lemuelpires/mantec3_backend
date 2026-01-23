import { PartialType } from '@nestjs/mapped-types';
import { CreateRecebimentoEquipamentoDto } from './create-recebimento-equipamento.dto';

export class UpdateRecebimentoEquipamentoDto extends PartialType(CreateRecebimentoEquipamentoDto) {}