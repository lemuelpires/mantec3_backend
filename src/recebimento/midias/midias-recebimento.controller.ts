import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MidiasRecebimentoService } from './midias-recebimento.service';
import { CreateMidiasRecebimentoDto } from './dto/create-midias-recebimento.dto';
import { UpdateMidiasRecebimentoDto } from './dto/update-midias-recebimento.dto';

@Controller('midias-recebimento')
export class MidiasRecebimentoController {
  constructor(private readonly midiasRecebimentoService: MidiasRecebimentoService) {}

  @Post()
  create(@Body() createMidiasRecebimentoDto: CreateMidiasRecebimentoDto) {
    return this.midiasRecebimentoService.create(createMidiasRecebimentoDto);
  }

  @Get()
  findAll() {
    return this.midiasRecebimentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.midiasRecebimentoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMidiasRecebimentoDto: UpdateMidiasRecebimentoDto) {
    return this.midiasRecebimentoService.update(id, updateMidiasRecebimentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.midiasRecebimentoService.remove(id);
  }
}