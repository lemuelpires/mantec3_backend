import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ProdutoDocument = Produto & Document;

@Schema({ timestamps: { createdAt: 'criadoEm' } })
export class Produto {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Empresa', required: true })
  empresaId: Types.ObjectId;

  @Prop({ required: true })
  nome: string;

  @Prop()
  descricao: string;

  @Prop()
  codigoInterno: string;

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  precoVenda: Types.Decimal128;

  @Prop({ default: true })
  ativo: boolean;
}

export const ProdutoSchema = SchemaFactory.createForClass(Produto);
