import { Controller, Get } from '@nestjs/common';
import { CurrentUser, type CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { RequireEvento } from '../common/decorators/require-evento.decorator';
import {
  EVENTOS_NEGOCIO,
  listarEventosPermitidos,
  listarPermissoesInterfacePermitidas,
  normalizarPerfil,
  serializarMatrizPermissoes,
} from './matriz-permissoes';

@Controller('permissoes')
export class PermissoesController {
  @Get('me')
  getMinhasPermissoes(@CurrentUser() user: CurrentUserPayload) {
    const perfil = user.perfil ?? '';

    return {
      perfil: normalizarPerfil(perfil),
      eventos: listarEventosPermitidos(perfil),
      permissoesInterface: listarPermissoesInterfacePermitidas(perfil),
    };
  }

  @RequireEvento(EVENTOS_NEGOCIO.USUARIO_CONSULTAR)
  @Get('matriz')
  getMatriz() {
    return serializarMatrizPermissoes();
  }
}
