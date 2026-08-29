import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComponentesAusentesService } from './componentes-ausentes.service';
import { CreateComponentesAusentesDto } from './dto/create-componentes-ausentes.dto';
import { UpdateComponentesAusentesDto } from './dto/update-componentes-ausentes.dto';
import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { RequireEvento } from '../../common/decorators/require-evento.decorator';
import { EVENTOS_NEGOCIO } from '../../permissoes/matriz-permissoes';

@Controller('componentes-ausentes')
export class ComponentesAusentesController {
  constructor(private readonly componentesAusentesService: ComponentesAusentesService) {}

  @Post()
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_EDITAR)
  create(@Body() createComponentesAusentesDto: CreateComponentesAusentesDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.componentesAusentesService.create(createComponentesAusentesDto, user?.empresaId);
  }

  @Get()
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_CONSULTAR)
  findAll(@CurrentUser() user?: CurrentUserPayload) {
    return this.componentesAusentesService.findAll(user?.empresaId);
  }

  @Get(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_CONSULTAR)
  findOne(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.componentesAusentesService.findOne(id, user?.empresaId);
  }

  @Patch(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_EDITAR)
  update(@Param('id') id: string, @Body() updateComponentesAusentesDto: UpdateComponentesAusentesDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.componentesAusentesService.update(id, updateComponentesAusentesDto, user?.empresaId);
  }

  @Delete(':id')
  @RequireEvento(EVENTOS_NEGOCIO.RECEBIMENTO_REMOVER)
  remove(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.componentesAusentesService.remove(id, user?.empresaId);
  }
}
