import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Servico, ServicoDocument } from './schemas/servico.schema';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { centavosParaDecimal128, dinheiroParaCentavos } from '../../financeiro/financeiro-adm/financeiro-adm.types';

@Injectable()
export class ServicosService {
  constructor(
    @InjectModel(Servico.name) private servicoModel: Model<ServicoDocument>,
  ) {}

  create(createServicoDto: CreateServicoDto, empresaId?: string) {
    try {
      const servicoData: any = { ...createServicoDto };
      if (empresaId) {
        servicoData.empresaId = empresaId;
      }
      if (
        createServicoDto.precoPadrao !== undefined &&
        createServicoDto.precoPadrao !== null &&
        createServicoDto.precoPadrao !== ''
      ) {
        try {
          servicoData.precoPadrao = centavosParaDecimal128(this.parseValorNaoNegativoCentavos(createServicoDto.precoPadrao, 'precoPadrao'));
        } catch (err) {
          throw new BadRequestException('precoPadrao inválido');
        }
      }
      const createdServico = new this.servicoModel(servicoData);
      return createdServico.save();
    } catch (error) {
      throw error;
    }
  }

  findAll(empresaId?: string) {
    return this.servicoModel.find(this.getEmpresaQuery(empresaId, { ativo: { $ne: false } })).exec();
  }

  findOne(id: string, empresaId?: string) {
    return this.servicoModel.findOne(this.getEmpresaQuery(empresaId, { _id: id })).exec();
  }

  update(id: string, updateServicoDto: UpdateServicoDto, empresaId?: string) {
    const updateData: any = { ...updateServicoDto };
    delete updateData.empresaId;
    if (
      updateServicoDto.precoPadrao !== undefined &&
      updateServicoDto.precoPadrao !== null &&
      updateServicoDto.precoPadrao !== ''
    ) {
      try {
        updateData.precoPadrao = centavosParaDecimal128(this.parseValorNaoNegativoCentavos(updateServicoDto.precoPadrao, 'precoPadrao'));
      } catch (err) {
        throw new BadRequestException('precoPadrao inválido');
      }
    }
    return this.servicoModel
      .findOneAndUpdate(this.getEmpresaQuery(empresaId, { _id: id }), updateData, { new: true })
      .exec();
  }

  remove(id: string, empresaId?: string) {
    return this.servicoModel
      .findOneAndUpdate(this.getEmpresaQuery(empresaId, { _id: id }), { ativo: false }, { new: true })
      .exec();
  }

  private getEmpresaQuery(empresaId?: string, base: Record<string, unknown> = {}) {
    return empresaId ? { ...base, empresaId } : base;
  }

  private parseValorNaoNegativoCentavos(value: unknown, campo: string) {
    const centavos = dinheiroParaCentavos(value);
    if (!Number.isFinite(centavos) || centavos < 0) {
      throw new BadRequestException(`${campo} invalido.`);
    }

    return centavos;
  }
}
