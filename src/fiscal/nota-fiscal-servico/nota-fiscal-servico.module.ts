import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotaFiscalServicoService } from './nota-fiscal-servico.service';
import { NotaFiscalServicoController } from './nota-fiscal-servico.controller';
import { NotaFiscalServico, NotaFiscalServicoSchema } from './nota-fiscal-servico.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NotaFiscalServico.name, schema: NotaFiscalServicoSchema }]),
  ],
  controllers: [NotaFiscalServicoController],
  providers: [NotaFiscalServicoService],
  exports: [NotaFiscalServicoService],
})
export class NotaFiscalServicoModule {}