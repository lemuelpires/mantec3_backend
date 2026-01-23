import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecebimentoEquipamentoService } from './recebimento-equipamento.service';
import { RecebimentoEquipamentoController } from './recebimento-equipamento.controller';
import { RecebimentoEquipamento, RecebimentoEquipamentoSchema } from './recebimento-equipamento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RecebimentoEquipamento.name, schema: RecebimentoEquipamentoSchema }]),
  ],
  controllers: [RecebimentoEquipamentoController],
  providers: [RecebimentoEquipamentoService],
  exports: [RecebimentoEquipamentoService],
})
export class RecebimentoEquipamentoModule {}