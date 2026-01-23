import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type NotaFiscalServicoDocument = NotaFiscalServico & Document;

@Schema({ collection: 'notasFiscaisServico', timestamps: { createdAt: 'criadoEm' } })
export class NotaFiscalServico {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Venda', required: true })
  vendaId: Types.ObjectId;

  @Prop({ required: true })
  numero: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  xml: string;

  @Prop()
  pdfUrl: string;
}

export const NotaFiscalServicoSchema = SchemaFactory.createForClass(NotaFiscalServico);