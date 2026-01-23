import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimentoEstoqueDto } from './create-movimento-estoque.dto';

export class UpdateMovimentoEstoqueDto extends PartialType(CreateMovimentoEstoqueDto) {}