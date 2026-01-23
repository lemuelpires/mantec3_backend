import { PartialType } from '@nestjs/mapped-types';
import { CreateItensVendaDto } from './create-itens-venda.dto';

export class UpdateItensVendaDto extends PartialType(CreateItensVendaDto) {}