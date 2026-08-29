import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MidiasRecebimento, MidiasRecebimentoDocument } from './midias-recebimento.schema';
import { CreateMidiasRecebimentoDto } from './dto/create-midias-recebimento.dto';
import { UpdateMidiasRecebimentoDto } from './dto/update-midias-recebimento.dto';
import { RecebimentoEquipamento, RecebimentoEquipamentoDocument } from '../recebimento-equipamento/recebimento-equipamento.schema';

@Injectable()
export class MidiasRecebimentoService {
  constructor(
    @InjectModel(MidiasRecebimento.name) private midiasRecebimentoModel: Model<MidiasRecebimentoDocument>,
    @InjectModel(RecebimentoEquipamento.name) private recebimentoEquipamentoModel: Model<RecebimentoEquipamentoDocument>,
  ) {}

  async create(createMidiasRecebimentoDto: CreateMidiasRecebimentoDto, empresaId?: string) {
    await this.assertRecebimentoDaEmpresa(createMidiasRecebimentoDto.recebimentoEquipamentoId, empresaId);
    const createdMidiasRecebimento = new this.midiasRecebimentoModel({
      ...createMidiasRecebimentoDto,
      urlArquivo: this.normalizarUrlArquivo(createMidiasRecebimentoDto.urlArquivo),
      capturadoEm: this.toOptionalDate(createMidiasRecebimentoDto.capturadoEm),
    });
    return createdMidiasRecebimento.save();
  }

  async findAll(empresaId?: string) {
    const recebimentoIds = await this.getRecebimentoIdsDaEmpresa(empresaId);
    return this.midiasRecebimentoModel.find({ recebimentoEquipamentoId: { $in: recebimentoIds } }).exec();
  }

  async findOne(id: string, empresaId?: string) {
    const midia = await this.midiasRecebimentoModel.findById(id).exec();
    if (!midia) {
      return null;
    }

    await this.assertRecebimentoDaEmpresa(midia.recebimentoEquipamentoId, empresaId);
    return midia;
  }

  async update(id: string, updateMidiasRecebimentoDto: UpdateMidiasRecebimentoDto, empresaId?: string) {
    const current = await this.findOne(id, empresaId);
    if (!current) {
      throw new NotFoundException('Midia do recebimento nao encontrada.');
    }
    if (updateMidiasRecebimentoDto.recebimentoEquipamentoId) {
      await this.assertRecebimentoDaEmpresa(updateMidiasRecebimentoDto.recebimentoEquipamentoId, empresaId);
    }

    const updateData = {
      ...updateMidiasRecebimentoDto,
      ...(updateMidiasRecebimentoDto.urlArquivo
        ? { urlArquivo: this.normalizarUrlArquivo(updateMidiasRecebimentoDto.urlArquivo) }
        : {}),
      ...(updateMidiasRecebimentoDto.capturadoEm
        ? { capturadoEm: this.toOptionalDate(updateMidiasRecebimentoDto.capturadoEm) }
        : {}),
    };

    return this.midiasRecebimentoModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async remove(id: string, empresaId?: string) {
    const current = await this.findOne(id, empresaId);
    if (!current) {
      throw new NotFoundException('Midia do recebimento nao encontrada.');
    }

    return this.midiasRecebimentoModel.findByIdAndDelete(id).exec();
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

  private normalizarUrlArquivo(urlArquivo: string) {
    const value = String(urlArquivo ?? '').trim().replace(/\\/g, '/');
    if (!value || /^https?:\/\//i.test(value)) {
      return value;
    }

    const clean = value
      .replace(/^\/+/, '')
      .replace(/^(uploads\/)+/i, 'uploads/');

    return clean.startsWith('uploads/') ? `/${clean}` : `/uploads/${clean}`;
  }

  private toOptionalDate(value?: string) {
    if (!value) {
      return undefined;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
}
