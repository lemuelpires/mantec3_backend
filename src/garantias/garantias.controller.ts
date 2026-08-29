import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GarantiasService } from './garantias.service';
import { CreateGarantiaDto } from './dto/create-garantia.dto';
import { UpdateGarantiaDto } from './dto/update-garantia.dto';
import { CreateEnvioGarantiaDto } from './dto/create-envio-garantia.dto';
import { UpdateEnvioGarantiaDto } from './dto/update-envio-garantia.dto';
import { CreateRetornoGarantiaDto } from './dto/create-retorno-garantia.dto';
import { UpdateRetornoGarantiaDto } from './dto/update-retorno-garantia.dto';
import { CreateCreditoFornecedorDto } from './dto/create-credito-fornecedor.dto';
import { UpdateCreditoFornecedorDto } from './dto/update-credito-fornecedor.dto';
import { AuthTokenGuard } from '../common/guards/auth-token.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequireEvento, RequireEventoFromBody } from '../common/decorators/require-evento.decorator';
import { EVENTOS_NEGOCIO } from '../permissoes/matriz-permissoes';
import { GARANTIA_STATUS } from './state/garantia.states';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@Controller('garantias')
export class GarantiasController {
  constructor(private readonly garantiasService: GarantiasService) {}

  @Post()
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_ABRIR)
  createGarantia(@Body() createGarantiaDto: CreateGarantiaDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.createGarantia(createGarantiaDto, user?.sub, user?.empresaId);
  }

  @Get()
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_CONSULTAR)
  findAllGarantias(@CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.findAllGarantias(user?.empresaId);
  }

  @Post(':id/enviar-fornecedor')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_ENVIAR_FORNECEDOR)
  enviarFornecedor(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.updateGarantia(
      id,
      { status: GARANTIA_STATUS.ENVIADA_FORNECEDOR },
      user?.sub,
      user?.empresaId,
    );
  }

  @Post(':id/iniciar-analise')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_REGISTRAR_RETORNO)
  iniciarAnalise(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.updateGarantia(
      id,
      { status: GARANTIA_STATUS.EM_ANALISE },
      user?.sub,
      user?.empresaId,
    );
  }

  @Post(':id/aprovar')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_REGISTRAR_RETORNO)
  aprovar(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.updateGarantia(
      id,
      { status: GARANTIA_STATUS.APROVADA },
      user?.sub,
      user?.empresaId,
    );
  }

  @Post(':id/recusar')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_REGISTRAR_RETORNO)
  recusar(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.updateGarantia(
      id,
      { status: GARANTIA_STATUS.RECUSADA },
      user?.sub,
      user?.empresaId,
    );
  }

  @Post(':id/finalizar')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_FINALIZAR)
  finalizar(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.updateGarantia(
      id,
      { status: GARANTIA_STATUS.CONCLUIDA },
      user?.sub,
      user?.empresaId,
    );
  }

  @Patch(':id')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEventoFromBody('status', {
    enviada_fornecedor: EVENTOS_NEGOCIO.GARANTIA_ENVIAR_FORNECEDOR,
    em_analise: EVENTOS_NEGOCIO.GARANTIA_REGISTRAR_RETORNO,
    aprovada: EVENTOS_NEGOCIO.GARANTIA_REGISTRAR_RETORNO,
    recusada: EVENTOS_NEGOCIO.GARANTIA_REGISTRAR_RETORNO,
    concluida: EVENTOS_NEGOCIO.GARANTIA_FINALIZAR,
  }, EVENTOS_NEGOCIO.GARANTIA_FINALIZAR)
  updateGarantia(
    @Param('id') id: string,
    @Body() updateGarantiaDto: UpdateGarantiaDto,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.garantiasService.updateGarantia(id, updateGarantiaDto, user?.sub, user?.empresaId);
  }

  @Delete(':id')
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_FINALIZAR)
  removeGarantia(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.removeGarantia(id, user?.empresaId);
  }

  @Post('envios')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_ENVIAR_FORNECEDOR)
  createEnvioGarantia(@Body() createEnvioGarantiaDto: CreateEnvioGarantiaDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.createEnvioGarantia(createEnvioGarantiaDto, user?.empresaId);
  }

  @Get('envios')
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_CONSULTAR)
  findAllEnvioGarantias(@CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.findAllEnvioGarantias(user?.empresaId);
  }

  @Get('envios/:id')
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_CONSULTAR)
  findOneEnvioGarantia(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.findOneEnvioGarantia(id, user?.empresaId);
  }

  @Patch('envios/:id')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_ENVIAR_FORNECEDOR)
  updateEnvioGarantia(@Param('id') id: string, @Body() updateEnvioGarantiaDto: UpdateEnvioGarantiaDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.updateEnvioGarantia(id, updateEnvioGarantiaDto, user?.empresaId);
  }

  @Delete('envios/:id')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_ENVIAR_FORNECEDOR)
  removeEnvioGarantia(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.removeEnvioGarantia(id, user?.empresaId);
  }

  @Post('retornos')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_REGISTRAR_RETORNO)
  createRetornoGarantia(@Body() createRetornoGarantiaDto: CreateRetornoGarantiaDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.createRetornoGarantia(createRetornoGarantiaDto, user?.empresaId);
  }

  @Get('retornos')
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_CONSULTAR)
  findAllRetornoGarantias(@CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.findAllRetornoGarantias(user?.empresaId);
  }

  @Get('retornos/:id')
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_CONSULTAR)
  findOneRetornoGarantia(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.findOneRetornoGarantia(id, user?.empresaId);
  }

  @Patch('retornos/:id')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_REGISTRAR_RETORNO)
  updateRetornoGarantia(@Param('id') id: string, @Body() updateRetornoGarantiaDto: UpdateRetornoGarantiaDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.updateRetornoGarantia(id, updateRetornoGarantiaDto, user?.empresaId);
  }

  @Delete('retornos/:id')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_REGISTRAR_RETORNO)
  removeRetornoGarantia(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.removeRetornoGarantia(id, user?.empresaId);
  }

  @Post('creditos')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_FINALIZAR)
  createCreditoFornecedor(@Body() createCreditoFornecedorDto: CreateCreditoFornecedorDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.createCreditoFornecedor(createCreditoFornecedorDto, user?.empresaId);
  }

  @Get('creditos')
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_CONSULTAR)
  findAllCreditoFornecedores(@CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.findAllCreditoFornecedores(user?.empresaId);
  }

  @Get('creditos/:id')
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_CONSULTAR)
  findOneCreditoFornecedor(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.findOneCreditoFornecedor(id, user?.empresaId);
  }

  @Patch('creditos/:id')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_FINALIZAR)
  updateCreditoFornecedor(@Param('id') id: string, @Body() updateCreditoFornecedorDto: UpdateCreditoFornecedorDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.updateCreditoFornecedor(id, updateCreditoFornecedorDto, user?.empresaId);
  }

  @Delete('creditos/:id')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_FINALIZAR)
  removeCreditoFornecedor(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.removeCreditoFornecedor(id, user?.empresaId);
  }

  @Get(':id')
  @RequireEvento(EVENTOS_NEGOCIO.GARANTIA_CONSULTAR)
  findOneGarantia(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.garantiasService.findOneGarantia(id, user?.empresaId);
  }
}
