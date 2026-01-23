import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ServicoDocument = Servico & Document;

@Schema({ timestamps: true })
export class Servico {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Empresa', required: true })
  empresaId: Types.ObjectId;

  @Prop({ required: true })
  nome: string;

  @Prop()
  descricao: string;

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  precoPadrao: Types.Decimal128;

  @Prop()
  tempoEstimado: number;

  @Prop({ default: true })
  ativo: boolean;
}

export const ServicoSchema = SchemaFactory.createForClass(Servico);
