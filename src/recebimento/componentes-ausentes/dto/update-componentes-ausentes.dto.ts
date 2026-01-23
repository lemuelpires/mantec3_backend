import { PartialType } from '@nestjs/mapped-types';
import { CreateComponentesAusentesDto } from './create-componentes-ausentes.dto';

export class UpdateComponentesAusentesDto extends PartialType(CreateComponentesAusentesDto) {}