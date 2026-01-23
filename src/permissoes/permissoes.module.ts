import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Perfil, PerfilSchema } from './schemas/perfil.schema';
import {
  UsuarioPerfil,
  UsuarioPerfilSchema,
} from './schemas/usuario-perfil.schema';
import { PerfisService } from './perfis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Perfil.name, schema: PerfilSchema },
      { name: UsuarioPerfil.name, schema: UsuarioPerfilSchema },
    ]),
  ],
  providers: [PerfisService],
  exports: [PerfisService],
})
export class PermissoesModule {}
