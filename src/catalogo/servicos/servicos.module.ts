import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicosService } from './servicos.service';
import { ServicosController } from './servicos.controller';
import { Servico, ServicoSchema } from './schemas/servico.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Servico.name, schema: ServicoSchema }]),
  ],
  controllers: [ServicosController],
  providers: [ServicosService],
  exports: [ServicosService],
})
export class ServicosModule {}
