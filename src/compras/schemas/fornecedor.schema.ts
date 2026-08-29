import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type FornecedorDocument = Fornecedor & Document;

@Schema({ collection: 'fornecedores' })
export class Fornecedor {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Empresa', required: true })
  empresaId: Types.ObjectId;

  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  cnpj: string;

  @Prop()
  telefone: string;

  @Prop()
  whatsapp: string;

  @Prop()
  email: string;

  @Prop({ default: true })
  ativo: boolean;
}

export const FornecedorSchema = SchemaFactory.createForClass(Fornecedor);

FornecedorSchema.index({ empresaId: 1, cnpj: 1 }, { unique: true });
FornecedorSchema.index({ empresaId: 1, ativo: 1, nome: 1 });
