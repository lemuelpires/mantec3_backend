import { PartialType } from '@nestjs/mapped-types';
import { CreateCompatibilidadeProdutoDto } from './create-compatibilidade-produto.dto';

export class UpdateCompatibilidadeProdutoDto extends PartialType(CreateCompatibilidadeProdutoDto) {}
