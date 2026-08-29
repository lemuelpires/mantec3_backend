import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ComponentesAusentes, ComponentesAusentesDocument } from './componentes-ausentes.schema';
import { CreateComponentesAusentesDto } from './dto/create-componentes-ausentes.dto';
import { UpdateComponentesAusentesDto } from './dto/update-componentes-ausentes.dto';
import { RecebimentoEquipamento, RecebimentoEquipamentoDocument } from '../recebimento-equipamento/recebimento-equipamento.schema';

@Injectable()
export class ComponentesAusentesService {
  constructor(
    @InjectModel(ComponentesAusentes.name) private componentesAusentesModel: Model<ComponentesAusentesDocument>,
    @InjectModel(RecebimentoEquipamento.name) private recebimentoEquipamentoModel: Model<RecebimentoEquipamentoDocument>,
  ) {}

  async create(createComponentesAusentesDto: CreateComponentesAusentesDto, empresaId?: string) {
    await this.assertRecebimentoDaEmpresa(createComponentesAusentesDto.recebimentoEquipamentoId, empresaId);
    const createdComponentesAusentes = new this.componentesAusentesModel(createComponentesAusentesDto);
    return createdComponentesAusentes.save();
  }

  async findAll(empresaId?: string) {
    const recebimentoIds = await this.getRecebimentoIdsDaEmpresa(empresaId);
    return this.componentesAusentesModel.find({ recebimentoEquipamentoId: { $in: recebimentoIds } }).exec();
  }

  async findOne(id: string, empresaId?: string) {
    const componente = await this.componentesAusentesModel.findById(id).exec();
    if (!componente) {
      return null;
    }

    await this.assertRecebimentoDaEmpresa(componente.recebimentoEquipamentoId, empresaId);
    return componente;
  }

  async update(id: string, updateComponentesAusentesDto: UpdateComponentesAusentesDto, empresaId?: string) {
    const current = await this.findOne(id, empresaId);
    if (!current) {
      throw new NotFoundException('Componente ausente nao encontrado.');
    }
    if (updateComponentesAusentesDto.recebimentoEquipamentoId) {
      await this.assertRecebimentoDaEmpresa(updateComponentesAusentesDto.recebimentoEquipamentoId, empresaId);
    }

    return this.componentesAusentesModel.findByIdAndUpdate(id, updateComponentesAusentesDto, { new: true }).exec();
  }

  async remove(id: string, empresaId?: string) {
    const current = await this.findOne(id, empresaId);
    if (!current) {
      throw new NotFoundException('Componente ausente nao encontrado.');
    }

    return this.componentesAusentesModel.findByIdAndDelete(id).exec();
  }

  private async getRecebimentoIdsDaEmpresa(empresaId?: string) {
    this.assertEmpresaInformada(empresaId);
    const recebimentos = await this.recebimentoEquipamentoModel.find({ empresaId }).select('_id').lean().exec();
    return recebimentos.map((recebimento) => recebimento._id);
  }

  private async assertRecebimentoDaEmpresa(recebimentoEquipamentoId: unknown, empresaId?: string) {
    this.assertEmpresaInformada(empresaId);
    const recebimento = await this.recebimentoEquipamentoModel
      .findOne({ _id: String(recebimentoEquipamentoId), empresaId })
      .select('_id')
      .lean()
      .exec();
    if (!recebimento) {
      throw new NotFoundException('Recebimento nao encontrado.');
    }
  }

  private assertEmpresaInformada(empresaId?: string): asserts empresaId is string {
    if (!empresaId) {
      throw new UnauthorizedException('Empresa do usuario nao informada.');
    }
  }
}
