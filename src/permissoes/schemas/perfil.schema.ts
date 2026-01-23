import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PerfilDocument = Perfil & Document;

@Schema()
export class Perfil {
  @Prop({ required: true, unique: true })
  nome: string;

  @Prop([String])
  permissoes: string[];
}

export const PerfilSchema = SchemaFactory.createForClass(Perfil);
