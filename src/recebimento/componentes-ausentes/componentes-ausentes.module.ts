import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComponentesAusentesService } from './componentes-ausentes.service';
import { ComponentesAusentesController } from './componentes-ausentes.controller';
import { ComponentesAusentes, ComponentesAusentesSchema } from './componentes-ausentes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ComponentesAusentes.name, schema: ComponentesAusentesSchema }]),
  ],
  controllers: [ComponentesAusentesController],
  providers: [ComponentesAusentesService],
  exports: [ComponentesAusentesService],
})
export class ComponentesAusentesModule {}