import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Produto, ProdutoSchema } from '../../catalogo/produtos/schemas/produto.schema';
import { AnexoFinanceiro, AnexoFinanceiroSchema } from '../../financeiro/financeiro-adm/schemas/anexo-financeiro.schema';
import { MidiasRecebimento, MidiasRecebimentoSchema } from '../../recebimento/midias/midias-recebimento.schema';
import { RecebimentoEquipamento, RecebimentoEquipamentoSchema } from '../../recebimento/recebimento-equipamento/recebimento-equipamento.schema';
import { PrivateUploadsController } from './private-uploads.controller';
import { PrivateUploadsService } from './private-uploads.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Produto.name, schema: ProdutoSchema },
      { name: MidiasRecebimento.name, schema: MidiasRecebimentoSchema },
      { name: RecebimentoEquipamento.name, schema: RecebimentoEquipamentoSchema },
      { name: AnexoFinanceiro.name, schema: AnexoFinanceiroSchema },
    ]),
  ],
  controllers: [PrivateUploadsController],
  providers: [PrivateUploadsService],
})
export class PrivateUploadsModule {}
