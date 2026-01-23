import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ComponentesAusentesDocument = ComponentesAusentes & Document;

@Schema({ collection: 'componentesAusentes' })
export class ComponentesAusentes {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'RecebimentoEquipamento', required: true })
  recebimentoEquipamentoId: Types.ObjectId;

  @Prop({ required: true })
  nomeComponente: string;

  @Prop()
  observacoes: string;
}

export const ComponentesAusentesSchema = SchemaFactory.createForClass(ComponentesAusentes);