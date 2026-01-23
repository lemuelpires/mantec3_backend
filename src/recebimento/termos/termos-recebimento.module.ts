import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TermosRecebimentoService } from './termos-recebimento.service';
import { TermosRecebimentoController } from './termos-recebimento.controller';
import { TermosRecebimento, TermosRecebimentoSchema } from './termos-recebimento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TermosRecebimento.name, schema: TermosRecebimentoSchema }]),
  ],
  controllers: [TermosRecebimentoController],
  providers: [TermosRecebimentoService],
  exports: [TermosRecebimentoService],
})
export class TermosRecebimentoModule {}