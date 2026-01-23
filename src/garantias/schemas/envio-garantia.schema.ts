import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type EnvioGarantiaDocument = EnvioGarantia & Document;

@Schema({ collection: 'envioGarantia' })
export class EnvioGarantia {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Garantia', required: true })
  garantiaId: Types.ObjectId;

  @Prop({ required: true })
  dataEnvio: Date;

  @Prop()
  codigoRastreio: string;

  @Prop()
  observacoes: string;
}

export const EnvioGarantiaSchema = SchemaFactory.createForClass(EnvioGarantia);