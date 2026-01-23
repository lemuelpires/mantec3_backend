import { PartialType } from '@nestjs/mapped-types';
import { CreateItensUtilizadosOSDto } from './create-itens-utilizados-os.dto';

export class UpdateItensUtilizadosOSDto extends PartialType(CreateItensUtilizadosOSDto) {}