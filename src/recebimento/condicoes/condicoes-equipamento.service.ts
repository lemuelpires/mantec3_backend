import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CondicoesEquipamento, CondicoesEquipamentoDocument } from './condicoes-equipamento.schema';
import { CreateCondicoesEquipamentoDto } from './dto/create-condicoes-equipamento.dto';
import { UpdateCondicoesEquipamentoDto } from './dto/update-condicoes-equipamento.dto';

@Injectable()
export class CondicoesEquipamentoService {
  constructor(
    @InjectModel(CondicoesEquipamento.name) private condicoesEquipamentoModel: Model<CondicoesEquipamentoDocument>,
  ) {}

  create(createCondicoesEquipamentoDto: CreateCondicoesEquipamentoDto) {
    const createdCondicoesEquipamento = new this.condicoesEquipamentoModel(createCondicoesEquipamentoDto);
    return createdCondicoesEquipamento.save();
  }

  findAll() {
    return this.condicoesEquipamentoModel.find().exec();
  }

  findOne(id: string) {
    return this.condicoesEquipamentoModel.findById(id).exec();
  }

  update(id: string, updateCondicoesEquipamentoDto: UpdateCondicoesEquipamentoDto) {
    return this.condicoesEquipamentoModel.findByIdAndUpdate(id, updateCondicoesEquipamentoDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.condicoesEquipamentoModel.findByIdAndDelete(id).exec();
  }
}