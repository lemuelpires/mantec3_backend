import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type TermosRecebimentoDocument = TermosRecebimento & Document;

@Schema({ collection: 'termosRecebimento' })
export class TermosRecebimento {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'RecebimentoEquipamento', required: true })
  recebimentoEquipamentoId: Types.ObjectId;

  @Prop({ required: true })
  texto: string;

  @Prop({ default: false })
  assinado: boolean;

  @Prop()
  metodoAssinatura: string;

  @Prop()
  dataAssinatura: Date;
}

export const TermosRecebimentoSchema = SchemaFactory.createForClass(TermosRecebimento);