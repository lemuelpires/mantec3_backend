import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComponentesAusentesService } from './componentes-ausentes.service';
import { CreateComponentesAusentesDto } from './dto/create-componentes-ausentes.dto';
import { UpdateComponentesAusentesDto } from './dto/update-componentes-ausentes.dto';

@Controller('componentes-ausentes')
export class ComponentesAusentesController {
  constructor(private readonly componentesAusentesService: ComponentesAusentesService) {}

  @Post()
  create(@Body() createComponentesAusentesDto: CreateComponentesAusentesDto) {
    return this.componentesAusentesService.create(createComponentesAusentesDto);
  }

  @Get()
  findAll() {
    return this.componentesAusentesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.componentesAusentesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComponentesAusentesDto: UpdateComponentesAusentesDto) {
    return this.componentesAusentesService.update(id, updateComponentesAusentesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.componentesAusentesService.remove(id);
  }
}