import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecebimentoEquipamentoService } from './recebimento-equipamento.service';
import { CreateRecebimentoEquipamentoDto } from './dto/create-recebimento-equipamento.dto';
import { UpdateRecebimentoEquipamentoDto } from './dto/update-recebimento-equipamento.dto';

@Controller('recebimento-equipamento')
export class RecebimentoEquipamentoController {
  constructor(private readonly recebimentoEquipamentoService: RecebimentoEquipamentoService) {}

  @Post()
  create(@Body() createRecebimentoEquipamentoDto: CreateRecebimentoEquipamentoDto) {
    return this.recebimentoEquipamentoService.create(createRecebimentoEquipamentoDto);
  }

  @Get()
  findAll() {
    return this.recebimentoEquipamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recebimentoEquipamentoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecebimentoEquipamentoDto: UpdateRecebimentoEquipamentoDto) {
    return this.recebimentoEquipamentoService.update(id, updateRecebimentoEquipamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recebimentoEquipamentoService.remove(id);
  }
}