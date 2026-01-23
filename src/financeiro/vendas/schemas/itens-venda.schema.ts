import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ItensVendaDocument = ItensVenda & Document;

@Schema({ collection: 'itensVenda' })
export class ItensVenda {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Venda', required: true })
  vendaId: Types.ObjectId;

  @Prop({ required: true })
  tipo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  referenciaId: Types.ObjectId;

  @Prop({ required: true })
  quantidade: number;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  valorUnitario: Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  totalItem: Types.Decimal128;
}

export const ItensVendaSchema = SchemaFactory.createForClass(ItensVenda);