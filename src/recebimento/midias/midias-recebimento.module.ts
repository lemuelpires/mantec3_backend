import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MidiasRecebimentoService } from './midias-recebimento.service';
import { MidiasRecebimentoController } from './midias-recebimento.controller';
import { MidiasRecebimento, MidiasRecebimentoSchema } from './midias-recebimento.schema';
import { RecebimentoEquipamento, RecebimentoEquipamentoSchema } from '../recebimento-equipamento/recebimento-equipamento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MidiasRecebimento.name, schema: MidiasRecebimentoSchema },
      { name: RecebimentoEquipamento.name, schema: RecebimentoEquipamentoSchema },
    ]),
  ],
  controllers: [MidiasRecebimentoController],
  providers: [MidiasRecebimentoService],
  exports: [MidiasRecebimentoService],
})
export class MidiasRecebimentoModule {}
