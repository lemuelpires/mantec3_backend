import { Module } from '@nestjs/common';
import { VendasModule } from './vendas/vendas.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';

@Module({
  imports: [
    VendasModule,
    PagamentosModule,
  ],
})
export class FinanceiroModule {}