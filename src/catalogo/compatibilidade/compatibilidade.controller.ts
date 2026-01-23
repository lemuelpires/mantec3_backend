import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompatibilidadeService } from './compatibilidade.service';
import { CreateCompatibilidadeProdutoDto } from './dto/create-compatibilidade-produto.dto';
import { UpdateCompatibilidadeProdutoDto } from './dto/update-compatibilidade-produto.dto';

@Controller('compatibilidade')
export class CompatibilidadeController {
  constructor(private readonly compatibilidadeService: CompatibilidadeService) {}

  @Post()
  create(@Body() createDto: CreateCompatibilidadeProdutoDto) {
    return this.compatibilidadeService.create(createDto);
  }

  @Get()
  findAll() {
    return this.compatibilidadeService.findAll();
  }

  @Get('produto/:produtoId')
  findAllByProduto(@Param('produtoId') produtoId: string) {
    return this.compatibilidadeService.findAllByProduto(produtoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.compatibilidadeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCompatibilidadeProdutoDto) {
    return this.compatibilidadeService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.compatibilidadeService.remove(id);
  }
}
