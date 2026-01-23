import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OsService } from './os.service';
import { OsController } from './os.controller';
import { OrdemServico, OrdemServicoSchema } from './schemas/ordem-servico.schema';
import { ItensUtilizadosOS, ItensUtilizadosOSSchema } from './schemas/itens-utilizados-os.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrdemServico.name, schema: OrdemServicoSchema },
      { name: ItensUtilizadosOS.name, schema: ItensUtilizadosOSSchema },
    ]),
  ],
  controllers: [OsController],
  providers: [OsService],
  exports: [OsService],
})
export class OsModule {}
