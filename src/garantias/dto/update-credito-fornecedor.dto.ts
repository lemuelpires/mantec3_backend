import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditoFornecedorDto } from './create-credito-fornecedor.dto';

export class UpdateCreditoFornecedorDto extends PartialType(CreateCreditoFornecedorDto) {}