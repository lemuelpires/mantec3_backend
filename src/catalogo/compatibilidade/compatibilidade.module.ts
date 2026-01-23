import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompatibilidadeService } from './compatibilidade.service';
import { CompatibilidadeController } from './compatibilidade.controller';
import {
  CompatibilidadeProduto,
  CompatibilidadeProdutoSchema,
} from './schemas/compatibilidade-produto.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompatibilidadeProduto.name, schema: CompatibilidadeProdutoSchema },
    ]),
  ],
  controllers: [CompatibilidadeController],
  providers: [CompatibilidadeService],
  exports: [CompatibilidadeService],
})
export class CompatibilidadeModule {}
