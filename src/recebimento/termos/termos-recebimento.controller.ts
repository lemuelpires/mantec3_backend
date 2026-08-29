import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { TermosRecebimentoService } from './termos-recebimento.service';
import { CreateTermosRecebimentoDto } from './dto/create-termos-recebimento.dto';
import { UpdateTermosRecebimentoDto } from './dto/update-termos-recebimento.dto';
import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { RequireEvento } from '../../common/decorators/require-evento.decorator';
import { EVENTOS_NEGOCIO } from '../../permissoes/matriz-permissoes';

@Controller('termos-recebimento')
export class TermosRecebimentoController {
  constructor(private readonly termosRecebimentoService: TermosRecebimentoService) {}

  @Post()
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_GERAR_TERMO)
  create(
    @Body() createTermosRecebimentoDto: CreateTermosRecebimentoDto,
    @Req() req: any,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.termosRecebimentoService.create(this.comMetadadosAssinatura(createTermosRecebimentoDto, req), user);
  }

  @Get()
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_CONSULTAR)
  findAll(@CurrentUser() user?: CurrentUserPayload) {
    return this.termosRecebimentoService.findAll(user?.empresaId);
  }

  @Get(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_CONSULTAR)
  findOne(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.termosRecebimentoService.findOne(id, user?.empresaId);
  }

  @Patch(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_GERAR_TERMO)
  update(
    @Param('id') id: string,
    @Body() updateTermosRecebimentoDto: UpdateTermosRecebimentoDto,
    @Req() req: any,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.termosRecebimentoService.update(id, this.comMetadadosAssinatura(updateTermosRecebimentoDto, req), user);
  }

  @Delete(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_REMOVER)
  remove(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.termosRecebimentoService.remove(id, user?.empresaId);
  }

  private comMetadadosAssinatura<T extends CreateTermosRecebimentoDto | UpdateTermosRecebimentoDto>(dto: T, req: any): T {
    if (!dto.assinado) {
      return dto;
    }

    return {
      ...dto,
      ipAssinatura: dto.ipAssinatura || this.getClientIp(req),
      userAgentAssinatura: dto.userAgentAssinatura || req?.headers?.['user-agent'],
    };
  }

  private getClientIp(req: any) {
    return req?.ip || req?.socket?.remoteAddress;
  }
}
