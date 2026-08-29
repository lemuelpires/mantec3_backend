import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { CreateMovimentoEstoqueDto } from './dto/create-movimento-estoque.dto';
import { UpdateMovimentoEstoqueDto } from './dto/update-movimento-estoque.dto';
import { AuthTokenGuard } from '../common/guards/auth-token.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequireEvento } from '../common/decorators/require-evento.decorator';
import { EVENTOS_NEGOCIO } from '../permissoes/matriz-permissoes';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@Controller('estoque')
@UseGuards(AuthTokenGuard, PermissionGuard)
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Post('movimentos')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.ESTOQUE_AJUSTAR)
  create(@Body() createMovimentoEstoqueDto: CreateMovimentoEstoqueDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.estoqueService.create(createMovimentoEstoqueDto, user?.id, user?.empresaId);
  }

  @Get('movimentos')
  @RequireEvento(EVENTOS_NEGOCIO.ESTOQUE_CONSULTAR)
  findAll(@CurrentUser() user?: CurrentUserPayload) {
    return this.estoqueService.findAll(user?.empresaId);
  }

  @Get('movimentos/:id')
  @RequireEvento(EVENTOS_NEGOCIO.ESTOQUE_CONSULTAR)
  findOne(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.estoqueService.findOne(id, user?.empresaId);
  }

  @Get('saldo/:produtoId')
  @RequireEvento(EVENTOS_NEGOCIO.ESTOQUE_CONSULTAR)
  getSaldoProduto(@Param('produtoId') produtoId: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.estoqueService.getSaldoProduto(produtoId, user?.empresaId);
  }

  @Get('disponibilidade')
  @RequireEvento(EVENTOS_NEGOCIO.ESTOQUE_CONSULTAR)
  getDisponibilidadeProdutos(@CurrentUser() user?: CurrentUserPayload) {
    return this.estoqueService.getDisponibilidadeProdutos(user?.empresaId);
  }

  @Get('disponibilidade/:produtoId')
  @RequireEvento(EVENTOS_NEGOCIO.ESTOQUE_CONSULTAR)
  getDisponibilidadeProduto(@Param('produtoId') produtoId: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.estoqueService.getDisponibilidadeProduto(produtoId, user?.empresaId);
  }

  @Patch('movimentos/:id')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.ESTOQUE_AJUSTAR)
  update(
    @Param('id') id: string,
    @Body() updateMovimentoEstoqueDto: UpdateMovimentoEstoqueDto,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.estoqueService.update(id, updateMovimentoEstoqueDto, user?.id, user?.empresaId);
  }

  @Delete('movimentos/:id')
  @UseGuards(AuthTokenGuard, PermissionGuard)
  @RequireEvento(EVENTOS_NEGOCIO.ESTOQUE_ESTORNAR)
  remove(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.estoqueService.remove(id, user?.id, user?.empresaId);
  }
}
