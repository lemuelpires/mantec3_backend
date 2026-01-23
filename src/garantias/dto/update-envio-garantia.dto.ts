import { PartialType } from '@nestjs/mapped-types';
import { CreateEnvioGarantiaDto } from './create-envio-garantia.dto';

export class UpdateEnvioGarantiaDto extends PartialType(CreateEnvioGarantiaDto) {}