import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PagamentosService } from './pagamentos.service';
import { PagamentosController } from './pagamentos.controller';
import { Pagamento, PagamentoSchema } from './schemas/pagamento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pagamento.name, schema: PagamentoSchema }]),
  ],
  controllers: [PagamentosController],
  providers: [PagamentosService],
  exports: [PagamentosService],
})
export class PagamentosModule {}