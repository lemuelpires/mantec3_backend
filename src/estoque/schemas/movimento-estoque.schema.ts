import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type MovimentosEstoqueDocument = MovimentosEstoque & Document;

@Schema({ collection: 'movimentosEstoque', timestamps: { createdAt: 'criadoEm' } })
export class MovimentosEstoque {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Empresa', required: true })
  empresaId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Produto', required: true })
  produtoId: Types.ObjectId;

  @Prop({ required: true })
  tipo: string;

  @Prop({ required: true })
  quantidade: number;

  @Prop({ required: true })
  origemTipo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  origemId: Types.ObjectId;
}

export const MovimentosEstoqueSchema = SchemaFactory.createForClass(MovimentosEstoque);
