import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Usuario } from 'src/usuarios/schemas/usuario.schema';
import { Perfil } from './perfil.schema';

export type UsuarioPerfilDocument = UsuarioPerfil & Document;

@Schema()
export class UsuarioPerfil {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Perfil', required: true })
  perfilId: Types.ObjectId;
}

export const UsuarioPerfilSchema = SchemaFactory.createForClass(UsuarioPerfil);

UsuarioPerfilSchema.index({ usuarioId: 1, perfilId: 1 }, { unique: true });
