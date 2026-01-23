import { Module } from '@nestjs/common';
import { NotificacaoModule } from './notificacoes/notificacao.module';
import { ConsultaImeiModule } from './consultas-imei/consulta-imei.module';

@Module({
  imports: [NotificacaoModule, ConsultaImeiModule],
})
export class ComunicacaoModule {}