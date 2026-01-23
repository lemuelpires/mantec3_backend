import { PartialType } from '@nestjs/mapped-types';
import { CreateMidiasRecebimentoDto } from './create-midias-recebimento.dto';

export class UpdateMidiasRecebimentoDto extends PartialType(CreateMidiasRecebimentoDto) {}