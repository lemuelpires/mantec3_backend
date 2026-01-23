import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ItensUtilizadosOSDocument = ItensUtilizadosOS & Document;

@Schema({ collection: 'itensUtilizadosOS' })
export class ItensUtilizadosOS {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'OrdemServico', required: true })
  ordemServicoId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Produto', required: true })
  produtoId: Types.ObjectId;

  @Prop({ required: true })
  quantidade: number;
}

export const ItensUtilizadosOSSchema = SchemaFactory.createForClass(ItensUtilizadosOS);