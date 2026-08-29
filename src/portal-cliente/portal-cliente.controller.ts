import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthTokenGuard } from '../common/guards/auth-token.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { CurrentUser, type CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { PortalClienteService } from './portal-cliente.service';
import { Public } from '../common/decorators/public.decorator';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { RequireEvento } from '../common/decorators/require-evento.decorator';
import { EVENTOS_NEGOCIO } from '../permissoes/matriz-permissoes';

@Controller('portal-cliente')
export class PortalClienteController {
  constructor(private readonly portalClienteService: PortalClienteService) {}

  @Post('clientes/:clienteId/sessao')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.CLIENTE_CONSULTAR)
  criarSessaoCliente(
    @Param('clienteId') clienteId: string,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.portalClienteService.criarSessaoCliente(clienteId, user);
  }

  @Post('sessoes/:sessaoId/revogar')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.CLIENTE_CONSULTAR)
  revogarSessaoCliente(
    @Param('sessaoId') sessaoId: string,
    @Body() body?: { motivo?: string },
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.portalClienteService.revogarSessao(sessaoId, user, body?.motivo);
  }

  @Get(':token')
  @Public()
  @RateLimit({ limit: 120, windowMs: 15 * 60 * 1000, keyPrefix: 'portal-read' })
  getPortal(@Param('token') token: string) {
    return this.portalClienteService.getPortal(token);
  }

  @Get(':token/atendimentos/:atendimentoId/pdf')
  @Public()
  @RateLimit({ limit: 60, windowMs: 15 * 60 * 1000, keyPrefix: 'portal-pdf' })
  async atendimentoPdf(
    @Param('token') token: string,
    @Param('atendimentoId') atendimentoId: string,
    @Res() res: Response,
  ) {
    const pdf = await this.portalClienteService.gerarAtendimentoPdf(token, atendimentoId);
    this.sendPdf(res, pdf, `atendimento-${atendimentoId}.pdf`);
  }

  @Post(':token/orcamentos/:orcamentoId/aprovar')
  @Public()
  @RateLimit({ limit: 30, windowMs: 15 * 60 * 1000, keyPrefix: 'portal-decision' })
  aprovarOrcamento(@Param('token') token: string, @Param('orcamentoId') orcamentoId: string) {
    return this.portalClienteService.decidirOrcamento(token, orcamentoId, 'aprovar');
  }

  @Post(':token/orcamentos/:orcamentoId/reprovar')
  @Public()
  @RateLimit({ limit: 30, windowMs: 15 * 60 * 1000, keyPrefix: 'portal-decision' })
  reprovarOrcamento(
    @Param('token') token: string,
    @Param('orcamentoId') orcamentoId: string,
    @Body() _body?: { observacao?: string },
  ) {
    return this.portalClienteService.decidirOrcamento(token, orcamentoId, 'reprovar');
  }

  private sendPdf(res: Response, pdf: Buffer, filename: string) {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Content-Length': pdf.length,
    });
    res.send(pdf);
  }
}
