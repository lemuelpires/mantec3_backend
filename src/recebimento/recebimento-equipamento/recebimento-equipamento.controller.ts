import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecebimentoEquipamentoService } from './recebimento-equipamento.service';
import { CreateRecebimentoEquipamentoDto } from './dto/create-recebimento-equipamento.dto';
import { UpdateRecebimentoEquipamentoDto } from './dto/update-recebimento-equipamento.dto';
import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { RequireEvento } from '../../common/decorators/require-evento.decorator';
import { EVENTOS_NEGOCIO } from '../../permissoes/matriz-permissoes';

@Controller('recebimento-equipamento')
export class RecebimentoEquipamentoController {
  constructor(private readonly recebimentoEquipamentoService: RecebimentoEquipamentoService) {}

  @Post()
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_CRIAR)
  create(
    @Body() createRecebimentoEquipamentoDto: CreateRecebimentoEquipamentoDto,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.recebimentoEquipamentoService.create(createRecebimentoEquipamentoDto, user);
  }

  @Get()
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_CONSULTAR)
  findAll(@CurrentUser() user?: CurrentUserPayload) {
    return this.recebimentoEquipamentoService.findAll(user?.empresaId);
  }

  @Get(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_CONSULTAR)
  findOne(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.recebimentoEquipamentoService.findOne(id, user?.empresaId);
  }

  @Patch(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_EDITAR)
  update(
    @Param('id') id: string,
    @Body() updateRecebimentoEquipamentoDto: UpdateRecebimentoEquipamentoDto,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.recebimentoEquipamentoService.update(id, updateRecebimentoEquipamentoDto, user);
  }

  @Delete(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_REMOVER)
  remove(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.recebimentoEquipamentoService.remove(id, user?.empresaId);
  }
}
