import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotaFiscalServicoService } from './nota-fiscal-servico.service';
import { CreateNotaFiscalServicoDto } from './dto/create-nota-fiscal-servico.dto';
import { UpdateNotaFiscalServicoDto } from './dto/update-nota-fiscal-servico.dto';

@Controller('nota-fiscal-servico')
export class NotaFiscalServicoController {
  constructor(private readonly notaFiscalServicoService: NotaFiscalServicoService) {}

  @Post()
  create(@Body() createNotaFiscalServicoDto: CreateNotaFiscalServicoDto) {
    return this.notaFiscalServicoService.create(createNotaFiscalServicoDto);
  }

  @Get()
  findAll() {
    return this.notaFiscalServicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notaFiscalServicoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotaFiscalServicoDto: UpdateNotaFiscalServicoDto) {
    return this.notaFiscalServicoService.update(id, updateNotaFiscalServicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notaFiscalServicoService.remove(id);
  }
}