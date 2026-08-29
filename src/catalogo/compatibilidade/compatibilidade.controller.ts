import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompatibilidadeService } from './compatibilidade.service';
import { CreateCompatibilidadeProdutoDto } from './dto/create-compatibilidade-produto.dto';
import { UpdateCompatibilidadeProdutoDto } from './dto/update-compatibilidade-produto.dto';
import { CreateAparelhoModeloDto } from './dto/create-aparelho-modelo.dto';
import { UpdateAparelhoModeloDto } from './dto/update-aparelho-modelo.dto';
import { CreateCompatibilidadeModeloDto } from './dto/create-compatibilidade-modelo.dto';
import { UpdateCompatibilidadeModeloDto } from './dto/update-compatibilidade-modelo.dto';
import { ImportCompatibilidadePeliculasDto } from './dto/import-compatibilidade-peliculas.dto';
import { ClassificarProdutosCompatibilidadeDto } from './dto/classificar-produtos-compatibilidade.dto';
import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { RequireEvento } from '../../common/decorators/require-evento.decorator';
import { EVENTOS_NEGOCIO } from '../../permissoes/matriz-permissoes';

@Controller('compatibilidade')
export class CompatibilidadeController {
  constructor(private readonly compatibilidadeService: CompatibilidadeService) {}

  @Post()
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  create(@Body() createDto: CreateCompatibilidadeProdutoDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.create(createDto, user?.empresaId);
  }

  @Get()
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_CONSULTAR)
  findAll(@CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.findAll(user?.empresaId);
  }

  @Get('produto/:produtoId')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_CONSULTAR)
  findAllByProduto(@Param('produtoId') produtoId: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.findAllByProduto(produtoId, user?.empresaId);
  }

  @Post('peliculas/importar')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  importarCompatibilidadePeliculas(@Body() importDto: ImportCompatibilidadePeliculasDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.importarCompatibilidadePeliculas(importDto, user?.empresaId);
  }

  @Post('produtos/classificar')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  classificarProdutos(@Body() dto: ClassificarProdutosCompatibilidadeDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.classificarProdutosExistentes(user?.empresaId ?? dto.empresaId);
  }

  @Post('modelos')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  createModelo(@Body() createDto: CreateAparelhoModeloDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.createModelo(createDto, user?.empresaId);
  }

  @Get('modelos')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_CONSULTAR)
  findAllModelos(@Query('empresaId') empresaId?: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.findAllModelos(user?.empresaId ?? empresaId);
  }

  @Get('modelos/:id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_CONSULTAR)
  findOneModelo(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.findOneModelo(id, user?.empresaId);
  }

  @Patch('modelos/:id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  updateModelo(@Param('id') id: string, @Body() updateDto: UpdateAparelhoModeloDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.updateModelo(id, updateDto, user?.empresaId);
  }

  @Delete('modelos/:id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  removeModelo(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.removeModelo(id, user?.empresaId);
  }

  @Post('modelos-relacoes')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  createCompatibilidadeModelo(@Body() createDto: CreateCompatibilidadeModeloDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.createCompatibilidadeModelo(createDto, user?.empresaId);
  }

  @Get('modelos-relacoes')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_CONSULTAR)
  findAllCompatibilidadesModelo(@Query('empresaId') empresaId?: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.findAllCompatibilidadesModelo(user?.empresaId ?? empresaId);
  }

  @Get('modelos-relacoes/:id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_CONSULTAR)
  findOneCompatibilidadeModelo(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.findOneCompatibilidadeModelo(id, user?.empresaId);
  }

  @Patch('modelos-relacoes/:id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  updateCompatibilidadeModelo(@Param('id') id: string, @Body() updateDto: UpdateCompatibilidadeModeloDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.updateCompatibilidadeModelo(id, updateDto, user?.empresaId);
  }

  @Delete('modelos-relacoes/:id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  removeCompatibilidadeModelo(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.removeCompatibilidadeModelo(id, user?.empresaId);
  }

  @Get('peliculas/sugestoes')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_CONSULTAR)
  getSugestoesPeliculas(
    @Query('empresaId') empresaId?: string,
    @Query('marca') marca?: string,
    @Query('modelo') modelo?: string,
    @Query('origemTipo') origemTipo?: string,
    @Query('origemId') origemId?: string,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.compatibilidadeService.getSugestoesPeliculas({ empresaId: user?.empresaId ?? empresaId, marca, modelo, origemTipo, origemId });
  }

  @Get(':id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_CONSULTAR)
  findOne(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.findOne(id, user?.empresaId);
  }

  @Patch(':id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  update(@Param('id') id: string, @Body() updateDto: UpdateCompatibilidadeProdutoDto, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.update(id, updateDto, user?.empresaId);
  }

  @Delete(':id')
  @RequireEvento(EVENTOS_NEGOCIO.CATALOGO_GERENCIAR)
  remove(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
    return this.compatibilidadeService.remove(id, user?.empresaId);
  }
}
