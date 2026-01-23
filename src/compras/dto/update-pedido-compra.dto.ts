import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoCompraDto } from './create-pedido-compra.dto';

export class UpdatePedidoCompraDto extends PartialType(CreatePedidoCompraDto) {}