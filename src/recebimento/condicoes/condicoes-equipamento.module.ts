import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CondicoesEquipamentoService } from './condicoes-equipamento.service';
import { CondicoesEquipamentoController } from './condicoes-equipamento.controller';
import { CondicoesEquipamento, CondicoesEquipamentoSchema } from './condicoes-equipamento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CondicoesEquipamento.name, schema: CondicoesEquipamentoSchema }]),
  ],
  controllers: [CondicoesEquipamentoController],
  providers: [CondicoesEquipamentoService],
  exports: [CondicoesEquipamentoService],
})
export class CondicoesEquipamentoModule {}