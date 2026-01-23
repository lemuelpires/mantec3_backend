import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstoqueService } from './estoque.service';
import { EstoqueController } from './estoque.controller';
import { MovimentosEstoque, MovimentosEstoqueSchema } from './schemas/movimento-estoque.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MovimentosEstoque.name, schema: MovimentosEstoqueSchema }]),
  ],
  controllers: [EstoqueController],
  providers: [EstoqueService],
  exports: [EstoqueService],
})
export class EstoqueModule {}
