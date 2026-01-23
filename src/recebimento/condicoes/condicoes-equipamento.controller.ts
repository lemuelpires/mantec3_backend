import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CondicoesEquipamentoService } from './condicoes-equipamento.service';
import { CreateCondicoesEquipamentoDto } from './dto/create-condicoes-equipamento.dto';
import { UpdateCondicoesEquipamentoDto } from './dto/update-condicoes-equipamento.dto';

@Controller('condicoes-equipamento')
export class CondicoesEquipamentoController {
  constructor(private readonly condicoesEquipamentoService: CondicoesEquipamentoService) {}

  @Post()
  create(@Body() createCondicoesEquipamentoDto: CreateCondicoesEquipamentoDto) {
    return this.condicoesEquipamentoService.create(createCondicoesEquipamentoDto);
  }

  @Get()
  findAll() {
    return this.condicoesEquipamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.condicoesEquipamentoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCondicoesEquipamentoDto: UpdateCondicoesEquipamentoDto) {
    return this.condicoesEquipamentoService.update(id, updateCondicoesEquipamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.condicoesEquipamentoService.remove(id);
  }
}