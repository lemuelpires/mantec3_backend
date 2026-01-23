import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MidiasRecebimentoService } from './midias-recebimento.service';
import { MidiasRecebimentoController } from './midias-recebimento.controller';
import { MidiasRecebimento, MidiasRecebimentoSchema } from './midias-recebimento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MidiasRecebimento.name, schema: MidiasRecebimentoSchema }]),
  ],
  controllers: [MidiasRecebimentoController],
  providers: [MidiasRecebimentoService],
  exports: [MidiasRecebimentoService],
})
export class MidiasRecebimentoModule {}