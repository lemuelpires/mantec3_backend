import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type RetornoGarantiaDocument = RetornoGarantia & Document;

@Schema({ collection: 'retornoGarantia' })
export class RetornoGarantia {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Garantia', required: true })
  garantiaId: Types.ObjectId;

  @Prop({ required: true })
  tipoRetorno: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Produto' })
  produtoSubstitutoId: Types.ObjectId;

  @Prop()
  valorCredito: number;

  @Prop({ required: true })
  dataRetorno: Date;

  @Prop()
  observacoes: string;
}

export const RetornoGarantiaSchema = SchemaFactory.createForClass(RetornoGarantia);