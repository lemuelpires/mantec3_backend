import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TermosRecebimento, TermosRecebimentoDocument } from './termos-recebimento.schema';
import { CreateTermosRecebimentoDto } from './dto/create-termos-recebimento.dto';
import { UpdateTermosRecebimentoDto } from './dto/update-termos-recebimento.dto';

@Injectable()
export class TermosRecebimentoService {
  constructor(
    @InjectModel(TermosRecebimento.name) private termosRecebimentoModel: Model<TermosRecebimentoDocument>,
  ) {}

  create(createTermosRecebimentoDto: CreateTermosRecebimentoDto) {
    const createdTermosRecebimento = new this.termosRecebimentoModel(createTermosRecebimentoDto);
    return createdTermosRecebimento.save();
  }

  findAll() {
    return this.termosRecebimentoModel.find().exec();
  }

  findOne(id: string) {
    return this.termosRecebimentoModel.findById(id).exec();
  }

  update(id: string, updateTermosRecebimentoDto: UpdateTermosRecebimentoDto) {
    return this.termosRecebimentoModel.findByIdAndUpdate(id, updateTermosRecebimentoDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.termosRecebimentoModel.findByIdAndDelete(id).exec();
  }
}