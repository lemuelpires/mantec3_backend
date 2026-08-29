import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CondicoesEquipamento, CondicoesEquipamentoDocument } from './condicoes-equipamento.schema';
import { CreateCondicoesEquipamentoDto } from './dto/create-condicoes-equipamento.dto';
import { UpdateCondicoesEquipamentoDto } from './dto/update-condicoes-equipamento.dto';
import { RecebimentoEquipamento, RecebimentoEquipamentoDocument } from '../recebimento-equipamento/recebimento-equipamento.schema';

@Injectable()
export class CondicoesEquipamentoService {
  constructor(
    @InjectModel(CondicoesEquipamento.name) private condicoesEquipamentoModel: Model<CondicoesEquipamentoDocument>,
    @InjectModel(RecebimentoEquipamento.name) private recebimentoEquipamentoModel: Model<RecebimentoEquipamentoDocument>,
  ) {}

  async create(createCondicoesEquipamentoDto: CreateCondicoesEquipamentoDto, empresaId?: string) {
    await this.assertRecebimentoDaEmpresa(createCondicoesEquipamentoDto.recebimentoEquipamentoId, empresaId);
    const createdCondicoesEquipamento = new this.condicoesEquipamentoModel(createCondicoesEquipamentoDto);
    return createdCondicoesEquipamento.save();
  }

  async findAll(empresaId?: string) {
    const recebimentoIds = await this.getRecebimentoIdsDaEmpresa(empresaId);
    return this.condicoesEquipamentoModel.find({ recebimentoEquipamentoId: { $in: recebimentoIds } }).exec();
  }

  async findOne(id: string, empresaId?: string) {
    const condicao = await this.condicoesEquipamentoModel.findById(id).exec();
    if (!condicao) {
      return null;
    }

    await this.assertRecebimentoDaEmpresa(condicao.recebimentoEquipamentoId, empresaId);
    return condicao;
  }

  async update(id: string, updateCondicoesEquipamentoDto: UpdateCondicoesEquipamentoDto, empresaId?: string) {
    const current = await this.findOne(id, empresaId);
    if (!current) {
      throw new NotFoundException('Condicao do equipamento nao encontrada.');
    }
    if (updateCondicoesEquipamentoDto.recebimentoEquipamentoId) {
      await this.assertRecebimentoDaEmpresa(updateCondicoesEquipamentoDto.recebimentoEquipamentoId, empresaId);
    }

    return this.condicoesEquipamentoModel.findByIdAndUpdate(id, updateCondicoesEquipamentoDto, { new: true }).exec();
  }

  async remove(id: string, empresaId?: string) {
    const current = await this.findOne(id, empresaId);
    if (!current) {
      throw new NotFoundException('Condicao do equipamento nao encontrada.');
    }

    return this.condicoesEquipamentoModel.findByIdAndDelete(id).exec();
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
