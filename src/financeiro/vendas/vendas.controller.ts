import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VendasService } from './vendas.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';
import { CreateItensVendaDto } from './dto/create-itens-venda.dto';
import { UpdateItensVendaDto } from './dto/update-itens-venda.dto';

@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  // Venda routes
  @Post()
  create(@Body() createVendaDto: CreateVendaDto) {
    return this.vendasService.create(createVendaDto);
  }

  @Get()
  findAll() {
    return this.vendasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendaDto: UpdateVendaDto) {
    return this.vendasService.update(id, updateVendaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendasService.remove(id);
  }

  // ItensVenda routes
  @Post('itens')
  createItem(@Body() createItensVendaDto: CreateItensVendaDto) {
    return this.vendasService.createItem(createItensVendaDto);
  }

  @Get('itens')
  findAllItems() {
    return this.vendasService.findAllItems();
  }

  @Get('itens/:id')
  findOneItem(@Param('id') id: string) {
    return this.vendasService.findOneItem(id);
  }

  @Patch('itens/:id')
  updateItem(@Param('id') id: string, @Body() updateItensVendaDto: UpdateItensVendaDto) {
    return this.vendasService.updateItem(id, updateItensVendaDto);
  }

  @Delete('itens/:id')
  removeItem(@Param('id') id: string) {
    return this.vendasService.removeItem(id);
  }
}