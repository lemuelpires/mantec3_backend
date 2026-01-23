import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { CreateMovimentoEstoqueDto } from './dto/create-movimento-estoque.dto';
import { UpdateMovimentoEstoqueDto } from './dto/update-movimento-estoque.dto';

@Controller('estoque')
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Post('movimentos')
  create(@Body() createMovimentoEstoqueDto: CreateMovimentoEstoqueDto) {
    return this.estoqueService.create(createMovimentoEstoqueDto);
  }

  @Get('movimentos')
  findAll() {
    return this.estoqueService.findAll();
  }

  @Get('movimentos/:id')
  findOne(@Param('id') id: string) {
    return this.estoqueService.findOne(id);
  }

  @Patch('movimentos/:id')
  update(@Param('id') id: string, @Body() updateMovimentoEstoqueDto: UpdateMovimentoEstoqueDto) {
    return this.estoqueService.update(id, updateMovimentoEstoqueDto);
  }

  @Delete('movimentos/:id')
  remove(@Param('id') id: string) {
    return this.estoqueService.remove(id);
  }
}