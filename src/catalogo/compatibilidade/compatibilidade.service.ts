import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CompatibilidadeProduto,
  CompatibilidadeProdutoDocument,
} from './schemas/compatibilidade-produto.schema';
import { CreateCompatibilidadeProdutoDto } from './dto/create-compatibilidade-produto.dto';
import { UpdateCompatibilidadeProdutoDto } from './dto/update-compatibilidade-produto.dto';

@Injectable()
export class CompatibilidadeService {
  constructor(
    @InjectModel(CompatibilidadeProduto.name)
    private compatibilidadeModel: Model<CompatibilidadeProdutoDocument>,
  ) {}

  create(createDto: CreateCompatibilidadeProdutoDto) {
    const created = new this.compatibilidadeModel(createDto);
    return created.save();
  }

  findAll() {
    return this.compatibilidadeModel.find().exec();
  }

  // Find all compatibilities for a given product
  findAllByProduto(produtoId: string) {
    return this.compatibilidadeModel.find({ produtoId }).exec();
  }

  findOne(id: string) {
    return this.compatibilidadeModel.findById(id).exec();
  }

  update(id: string, updateDto: UpdateCompatibilidadeProdutoDto) {
    return this.compatibilidadeModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.compatibilidadeModel.findByIdAndDelete(id).exec();
  }
}
