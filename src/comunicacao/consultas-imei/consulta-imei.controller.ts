import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsultaImeiService } from './consulta-imei.service';
import { CreateConsultaImeiDto } from './dto/create-consulta-imei.dto';
import { UpdateConsultaImeiDto } from './dto/update-consulta-imei.dto';

@Controller('consulta-imei')
export class ConsultaImeiController {
  constructor(private readonly consultaImeiService: ConsultaImeiService) {}

  @Post()
  create(@Body() createConsultaImeiDto: CreateConsultaImeiDto) {
    return this.consultaImeiService.create(createConsultaImeiDto);
  }

  @Get()
  findAll() {
    return this.consultaImeiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultaImeiService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsultaImeiDto: UpdateConsultaImeiDto) {
    return this.consultaImeiService.update(id, updateConsultaImeiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultaImeiService.remove(id);
  }
}