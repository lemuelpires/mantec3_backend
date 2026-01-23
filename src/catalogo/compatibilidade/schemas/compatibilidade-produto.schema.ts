import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CompatibilidadeProdutoDocument = CompatibilidadeProduto & Document;

@Schema({ timestamps: true })
export class CompatibilidadeProduto {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Produto', required: true })
  produtoId: Types.ObjectId;

  @Prop({ required: true })
  marca: string;

  @Prop({ required: true })
  modelo: string;

  @Prop()
  observacoes: string;
}

export const CompatibilidadeProdutoSchema = SchemaFactory.createForClass(CompatibilidadeProduto);
