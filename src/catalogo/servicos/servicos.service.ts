import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Servico, ServicoDocument } from './schemas/servico.schema';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';

@Injectable()
export class ServicosService {
  constructor(
    @InjectModel(Servico.name) private servicoModel: Model<ServicoDocument>,
  ) {}

  create(createServicoDto: CreateServicoDto) {
    const servicoData: any = { ...createServicoDto };
    if (createServicoDto.precoPadrao) {
      servicoData.precoPadrao = Types.Decimal128.fromString(createServicoDto.precoPadrao);
    }
    const createdServico = new this.servicoModel(servicoData);
    return createdServico.save();
  }

  findAll() {
    return this.servicoModel.find().exec();
  }

  findOne(id: string) {
    return this.servicoModel.findById(id).exec();
  }

  update(id: string, updateServicoDto: UpdateServicoDto) {
    const updateData: any = { ...updateServicoDto };
    if (updateServicoDto.precoPadrao) {
      updateData.precoPadrao = Types.Decimal128.fromString(updateServicoDto.precoPadrao);
    }
    return this.servicoModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  remove(id: string) {
    return this.servicoModel.findByIdAndDelete(id).exec();
  }
}
