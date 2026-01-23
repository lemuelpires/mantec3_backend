import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GarantiasService } from './garantias.service';
import { CreateGarantiaDto } from './dto/create-garantia.dto';
import { UpdateGarantiaDto } from './dto/update-garantia.dto';
import { CreateEnvioGarantiaDto } from './dto/create-envio-garantia.dto';
import { UpdateEnvioGarantiaDto } from './dto/update-envio-garantia.dto';
import { CreateRetornoGarantiaDto } from './dto/create-retorno-garantia.dto';
import { UpdateRetornoGarantiaDto } from './dto/update-retorno-garantia.dto';
import { CreateCreditoFornecedorDto } from './dto/create-credito-fornecedor.dto';
import { UpdateCreditoFornecedorDto } from './dto/update-credito-fornecedor.dto';

@Controller('garantias')
export class GarantiasController {
  constructor(private readonly garantiasService: GarantiasService) {}

  // Garantia routes
  @Post()
  createGarantia(@Body() createGarantiaDto: CreateGarantiaDto) {
    return this.garantiasService.createGarantia(createGarantiaDto);
  }

  @Get()
  findAllGarantias() {
    return this.garantiasService.findAllGarantias();
  }

  @Get(':id')
  findOneGarantia(@Param('id') id: string) {
    return this.garantiasService.findOneGarantia(id);
  }

  @Patch(':id')
  updateGarantia(@Param('id') id: string, @Body() updateGarantiaDto: UpdateGarantiaDto) {
    return this.garantiasService.updateGarantia(id, updateGarantiaDto);
  }

  @Delete(':id')
  removeGarantia(@Param('id') id: string) {
    return this.garantiasService.removeGarantia(id);
  }

  // EnvioGarantia routes
  @Post('envios')
  createEnvioGarantia(@Body() createEnvioGarantiaDto: CreateEnvioGarantiaDto) {
    return this.garantiasService.createEnvioGarantia(createEnvioGarantiaDto);
  }

  @Get('envios')
  findAllEnvioGarantias() {
    return this.garantiasService.findAllEnvioGarantias();
  }

  @Get('envios/:id')
  findOneEnvioGarantia(@Param('id') id: string) {
    return this.garantiasService.findOneEnvioGarantia(id);
  }

  @Patch('envios/:id')
  updateEnvioGarantia(@Param('id') id: string, @Body() updateEnvioGarantiaDto: UpdateEnvioGarantiaDto) {
    return this.garantiasService.updateEnvioGarantia(id, updateEnvioGarantiaDto);
  }

  @Delete('envios/:id')
  removeEnvioGarantia(@Param('id') id: string) {
    return this.garantiasService.removeEnvioGarantia(id);
  }

  // RetornoGarantia routes
  @Post('retornos')
  createRetornoGarantia(@Body() createRetornoGarantiaDto: CreateRetornoGarantiaDto) {
    return this.garantiasService.createRetornoGarantia(createRetornoGarantiaDto);
  }

  @Get('retornos')
  findAllRetornoGarantias() {
    return this.garantiasService.findAllRetornoGarantias();
  }

  @Get('retornos/:id')
  findOneRetornoGarantia(@Param('id') id: string) {
    return this.garantiasService.findOneRetornoGarantia(id);
  }

  @Patch('retornos/:id')
  updateRetornoGarantia(@Param('id') id: string, @Body() updateRetornoGarantiaDto: UpdateRetornoGarantiaDto) {
    return this.garantiasService.updateRetornoGarantia(id, updateRetornoGarantiaDto);
  }

  @Delete('retornos/:id')
  removeRetornoGarantia(@Param('id') id: string) {
    return this.garantiasService.removeRetornoGarantia(id);
  }

  // CreditoFornecedor routes
  @Post('creditos')
  createCreditoFornecedor(@Body() createCreditoFornecedorDto: CreateCreditoFornecedorDto) {
    return this.garantiasService.createCreditoFornecedor(createCreditoFornecedorDto);
  }

  @Get('creditos')
  findAllCreditoFornecedores() {
    return this.garantiasService.findAllCreditoFornecedores();
  }

  @Get('creditos/:id')
  findOneCreditoFornecedor(@Param('id') id: string) {
    return this.garantiasService.findOneCreditoFornecedor(id);
  }

  @Patch('creditos/:id')
  updateCreditoFornecedor(@Param('id') id: string, @Body() updateCreditoFornecedorDto: UpdateCreditoFornecedorDto) {
    return this.garantiasService.updateCreditoFornecedor(id, updateCreditoFornecedorDto);
  }

  @Delete('creditos/:id')
  removeCreditoFornecedor(@Param('id') id: string) {
    return this.garantiasService.removeCreditoFornecedor(id);
  }
}