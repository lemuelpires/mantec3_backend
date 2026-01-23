import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ConsultaImeiDocument = ConsultaImei & Document;

@Schema({ collection: 'consultaImei' })
export class ConsultaImei {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Empresa', required: true })
  empresaId: Types.ObjectId;

  @Prop({ required: true })
  imei: string;

  @Prop({ required: true })
  resultado: string;

  @Prop({ type: Date, default: Date.now })
  consultadoEm: Date;
}

export const ConsultaImeiSchema = SchemaFactory.createForClass(ConsultaImei);