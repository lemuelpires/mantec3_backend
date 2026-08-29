import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsultaImeiService } from './consulta-imei.service';
import { CreateConsultaImeiDto } from './dto/create-consulta-imei.dto';
import { UpdateConsultaImeiDto } from './dto/update-consulta-imei.dto';
import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { RequireEvento } from '../../common/decorators/require-evento.decorator';
import { EVENTOS_NEGOCIO } from '../../permissoes/matriz-permissoes';

@Controller('consulta-imei')
export class ConsultaImeiController {
  constructor(private readonly consultaImeiService: ConsultaImeiService) {}

  @Post()
  @RequireEvento(EVENTOS_NEGOCIO.CONSULTA_IMEI_GERENCIAR)
  create(@Body() createConsultaImeiDto: CreateConsultaImeiDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.consultaImeiService.create(createConsultaImeiDto, user?.empresaId);
  }

  @Get()
  @RequireEvento(EVENTOS_NEGOCIO.CONSULTA_IMEI_CONSULTAR)
  findAll(@CurrentUser() user?: CurrentUserPayload) {
    return this.consultaImeiService.findAll(user?.empresaId);
  }

  @Get(':id')
  @RequireEvento(EVENTOS_NEGOCIO.CONSULTA_IMEI_CONSULTAR)
  findOne(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.consultaImeiService.findOne(id, user?.empresaId);
  }

  @Patch(':id')
  @RequireEvento(EVENTOS_NEGOCIO.CONSULTA_IMEI_GERENCIAR)
  update(@Param('id') id: string, @Body() updateConsultaImeiDto: UpdateConsultaImeiDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.consultaImeiService.update(id, updateConsultaImeiDto, user?.empresaId);
  }

  @Delete(':id')
  @RequireEvento(EVENTOS_NEGOCIO.CONSULTA_IMEI_GERENCIAR)
  remove(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.consultaImeiService.remove(id, user?.empresaId);
  }
}
