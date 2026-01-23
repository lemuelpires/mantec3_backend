import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type MidiasRecebimentoDocument = MidiasRecebimento & Document;

@Schema({ collection: 'midiasRecebimento', timestamps: { createdAt: 'criadoEm' } })
export class MidiasRecebimento {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'RecebimentoEquipamento', required: true })
  recebimentoEquipamentoId: Types.ObjectId;

  @Prop({ required: true })
  tipo: string;

  @Prop({ required: true })
  urlArquivo: string;

  @Prop()
  descricao: string;
}

export const MidiasRecebimentoSchema = SchemaFactory.createForClass(MidiasRecebimento);