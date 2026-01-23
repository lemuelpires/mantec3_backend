import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditoriaService } from './auditoria.service';
import { AuditoriaController } from './auditoria.controller';
import { LogEvento, LogEventoSchema } from './schemas/log-evento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LogEvento.name, schema: LogEventoSchema }]),
  ],
  controllers: [AuditoriaController],
  providers: [AuditoriaService],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}
