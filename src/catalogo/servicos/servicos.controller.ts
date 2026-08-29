import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { RequireEvento } from '../../common/decorators/require-evento.decorator';
import { EVENTOS_NEGOCIO } from '../../permissoes/matriz-permissoes';

@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Post()
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  create(@Body() createServicoDto: CreateServicoDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.servicosService.create(createServicoDto, user?.empresaId);
  }

  @Get()
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_CONSULTAR)
  findAll(@CurrentUser() user?: CurrentUserPayload) {
    return this.servicosService.findAll(user?.empresaId);
  }

  @Get(':id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_CONSULTAR)
  findOne(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.servicosService.findOne(id, user?.empresaId);
  }

  @Patch(':id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  update(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.servicosService.update(id, updateServicoDto, user?.empresaId);
  }

  @Delete(':id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  remove(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.servicosService.remove(id, user?.empresaId);
  }
}
