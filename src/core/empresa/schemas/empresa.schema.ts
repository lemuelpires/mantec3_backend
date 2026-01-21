import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmpresaDocument = Empresa & Document;

@Schema({ timestamps: true })
export class Empresa {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true, unique: true })
  cnpj: string;

  @Prop()
  email?: string;

  @Prop()
  telefone?: string;

  @Prop({ default: true })
  ativa: boolean;
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);
