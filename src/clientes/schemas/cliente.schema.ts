import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ClienteDocument = Cliente & Document;

@Schema({ timestamps: { createdAt: 'criadoEm' } })
export class Cliente {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Empresa', required: true })
  empresaId: Types.ObjectId;

  @Prop({ required: true })
  nome: string;

  @Prop({ required: true, unique: true })
  cpfCnpj: string;

  @Prop()
  telefone: string;

  @Prop()
  email: string;

  @Prop({ type: Object })
  endereco: any;

  @Prop({ default: true })
  ativo: boolean;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
