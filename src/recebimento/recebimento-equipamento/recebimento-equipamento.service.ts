import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecebimentoEquipamento, RecebimentoEquipamentoDocument } from './recebimento-equipamento.schema';
import { CreateRecebimentoEquipamentoDto } from './dto/create-recebimento-equipamento.dto';
import { UpdateRecebimentoEquipamentoDto } from './dto/update-recebimento-equipamento.dto';

@Injectable()
export class RecebimentoEquipamentoService {
  constructor(
    @InjectModel(RecebimentoEquipamento.name) private recebimentoEquipamentoModel: Model<RecebimentoEquipamentoDocument>,
  ) {}

  create(createRecebimentoEquipamentoDto: CreateRecebimentoEquipamentoDto) {
    const createdRecebimentoEquipamento = new this.recebimentoEquipamentoModel(createRecebimentoEquipamentoDto);
    return createdRecebimentoEquipamento.save();
  }

  findAll() {
    return this.recebimentoEquipamentoModel.find().exec();
  }

  findOne(id: string) {
    return this.recebimentoEquipamentoModel.findById(id).exec();
  }

  update(id: string, updateRecebimentoEquipamentoDto: UpdateRecebimentoEquipamentoDto) {
    return this.recebimentoEquipamentoModel.findByIdAndUpdate(id, updateRecebimentoEquipamentoDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.recebimentoEquipamentoModel.findByIdAndDelete(id).exec();
  }
}