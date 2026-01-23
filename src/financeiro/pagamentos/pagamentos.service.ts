import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pagamento, PagamentoDocument } from './schemas/pagamento.schema';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

@Injectable()
export class PagamentosService {
  constructor(
    @InjectModel(Pagamento.name) private pagamentoModel: Model<PagamentoDocument>,
  ) {}

  create(createPagamentoDto: CreatePagamentoDto) {
    const pagamentoData: any = { ...createPagamentoDto };
    if (createPagamentoDto.valor) {
      pagamentoData.valor = Types.Decimal128.fromString(createPagamentoDto.valor);
    }
    const createdPagamento = new this.pagamentoModel(pagamentoData);
    return createdPagamento.save();
  }

  findAll() {
    return this.pagamentoModel.find().exec();
  }

  findOne(id: string) {
    return this.pagamentoModel.findById(id).exec();
  }

  update(id: string, updatePagamentoDto: UpdatePagamentoDto) {
    const updateData: any = { ...updatePagamentoDto };
    if (updatePagamentoDto.valor) {
      updateData.valor = Types.Decimal128.fromString(updatePagamentoDto.valor);
    }
    return this.pagamentoModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  remove(id: string) {
    return this.pagamentoModel.findByIdAndDelete(id).exec();
  }
}