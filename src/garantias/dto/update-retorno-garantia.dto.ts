import { PartialType } from '@nestjs/mapped-types';
import { CreateRetornoGarantiaDto } from './create-retorno-garantia.dto';

export class UpdateRetornoGarantiaDto extends PartialType(CreateRetornoGarantiaDto) {}