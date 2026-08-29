import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CondicoesEquipamentoService } from './condicoes-equipamento.service';
import { CreateCondicoesEquipamentoDto } from './dto/create-condicoes-equipamento.dto';
import { UpdateCondicoesEquipamentoDto } from './dto/update-condicoes-equipamento.dto';
import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { RequireEvento } from '../../common/decorators/require-evento.decorator';
import { EVENTOS_NEGOCIO } from '../../permissoes/matriz-permissoes';

@Controller('condicoes-equipamento')
export class CondicoesEquipamentoController {
  constructor(private readonly condicoesEquipamentoService: CondicoesEquipamentoService) {}

  @Post()
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_EDITAR)
  create(@Body() createCondicoesEquipamentoDto: CreateCondicoesEquipamentoDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.condicoesEquipamentoService.create(createCondicoesEquipamentoDto, user?.empresaId);
  }

  @Get()
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_CONSULTAR)
  findAll(@CurrentUser() user?: CurrentUserPayload) {
    return this.condicoesEquipamentoService.findAll(user?.empresaId);
  }

  @Get(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_CONSULTAR)
  findOne(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.condicoesEquipamentoService.findOne(id, user?.empresaId);
  }

  @Patch(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_EDITAR)
  update(@Param('id') id: string, @Body() updateCondicoesEquipamentoDto: UpdateCondicoesEquipamentoDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.condicoesEquipamentoService.update(id, updateCondicoesEquipamentoDto, user?.empresaId);
  }

  @Delete(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_REMOVER)
  remove(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.condicoesEquipamentoService.remove(id, user?.empresaId);
  }
}
