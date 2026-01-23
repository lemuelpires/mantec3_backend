import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type PagamentoDocument = Pagamento & Document;

@Schema({ collection: 'pagamentos' })
export class Pagamento {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Venda', required: true })
  vendaId: Types.ObjectId;

  @Prop({ required: true })
  formaPagamento: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  valor: Types.Decimal128;

  @Prop({ required: true })
  dataPagamento: Date;
}

export const PagamentoSchema = SchemaFactory.createForClass(Pagamento);