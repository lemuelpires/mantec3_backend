import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultaImeiDto } from './create-consulta-imei.dto';

export class UpdateConsultaImeiDto extends PartialType(CreateConsultaImeiDto) {}