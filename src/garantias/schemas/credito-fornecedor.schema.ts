import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CreditoFornecedorDocument = CreditoFornecedor & Document;

@Schema({ collection: 'creditoFornecedor', timestamps: { createdAt: 'criadoEm' } })
export class CreditoFornecedor {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Fornecedor', required: true })
  fornecedorId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Garantia', required: true })
  garantiaId: Types.ObjectId;

  @Prop({ required: true })
  valor: number;

  @Prop({ default: false })
  utilizado: boolean;
}

export const CreditoFornecedorSchema = SchemaFactory.createForClass(CreditoFornecedor);