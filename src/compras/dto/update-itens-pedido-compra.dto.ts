import { PartialType } from '@nestjs/mapped-types';
import { CreateItensPedidoCompraDto } from './create-itens-pedido-compra.dto';

export class UpdateItensPedidoCompraDto extends PartialType(CreateItensPedidoCompraDto) {}