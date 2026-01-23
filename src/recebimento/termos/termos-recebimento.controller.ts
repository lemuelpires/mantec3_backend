import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TermosRecebimentoService } from './termos-recebimento.service';
import { CreateTermosRecebimentoDto } from './dto/create-termos-recebimento.dto';
import { UpdateTermosRecebimentoDto } from './dto/update-termos-recebimento.dto';

@Controller('termos-recebimento')
export class TermosRecebimentoController {
  constructor(private readonly termosRecebimentoService: TermosRecebimentoService) {}

  @Post()
  create(@Body() createTermosRecebimentoDto: CreateTermosRecebimentoDto) {
    return this.termosRecebimentoService.create(createTermosRecebimentoDto);
  }

  @Get()
  findAll() {
    return this.termosRecebimentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.termosRecebimentoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTermosRecebimentoDto: UpdateTermosRecebimentoDto) {
    return this.termosRecebimentoService.update(id, updateTermosRecebimentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.termosRecebimentoService.remove(id);
  }
}