import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type PortalClienteSessaoDocument = PortalClienteSessao & Document;

@Schema({ collection: 'portalClienteSessoes', timestamps: true })
export class PortalClienteSessao {
  @Prop({ required: true, unique: true, index: true })
  tokenHash: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Cliente', required: true, index: true })
  clienteId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Empresa', required: true, index: true })
  empresaId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Usuario' })
  criadoPorUsuarioId?: Types.ObjectId;

  @Prop({ type: Date, required: true, index: true })
  expiraEm: Date;

  @Prop({ type: Date })
  revogadoEm?: Date;

  @Prop()
  motivoRevogacao?: string;

  @Prop({ type: Date })
  ultimoAcessoEm?: Date;

  @Prop({ default: 0 })
  acessos: number;
}

export const PortalClienteSessaoSchema = SchemaFactory.createForClass(PortalClienteSessao);

