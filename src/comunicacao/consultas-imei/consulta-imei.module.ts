import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultaImeiService } from './consulta-imei.service';
import { ConsultaImeiController } from './consulta-imei.controller';
import { ConsultaImei, ConsultaImeiSchema } from './consulta-imei.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ConsultaImei.name, schema: ConsultaImeiSchema }]),
  ],
  controllers: [ConsultaImeiController],
  providers: [ConsultaImeiService],
  exports: [ConsultaImeiService],
})
export class ConsultaImeiModule {}