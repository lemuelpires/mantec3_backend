import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CondicoesEquipamentoDocument = CondicoesEquipamento & Document;

@Schema({ collection: 'condicoesEquipamento' })
export class CondicoesEquipamento {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'RecebimentoEquipamento', required: true })
  recebimentoEquipamentoId: Types.ObjectId;

  @Prop({ required: true })
  categoria: string;

  @Prop({ required: true })
  tipo: string;

  @Prop({ required: true })
  severidade: string;

  @Prop()
  observacoes: string;
}

export const CondicoesEquipamentoSchema = SchemaFactory.createForClass(CondicoesEquipamento);