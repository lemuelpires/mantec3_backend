import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Venda, VendaDocument } from './schemas/venda.schema';
import { ItensVenda, ItensVendaDocument } from './schemas/itens-venda.schema';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';
import { CreateItensVendaDto } from './dto/create-itens-venda.dto';
import { UpdateItensVendaDto } from './dto/update-itens-venda.dto';

@Injectable()
export class VendasService {
  constructor(
    @InjectModel(Venda.name) private vendaModel: Model<VendaDocument>,
    @InjectModel(ItensVenda.name) private itensVendaModel: Model<ItensVendaDocument>,
  ) {}

  // Venda CRUD
  create(createVendaDto: CreateVendaDto) {
    const vendaData: any = { ...createVendaDto };
    if (createVendaDto.subtotal) {
      vendaData.subtotal = Types.Decimal128.fromString(createVendaDto.subtotal);
    }
    if (createVendaDto.descontos) {
      vendaData.descontos = Types.Decimal128.fromString(createVendaDto.descontos);
    }
    if (createVendaDto.total) {
      vendaData.total = Types.Decimal128.fromString(createVendaDto.total);
    }
    const createdVenda = new this.vendaModel(vendaData);
    return createdVenda.save();
  }

  findAll() {
    return this.vendaModel.find().exec();
  }

  findOne(id: string) {
    return this.vendaModel.findById(id).exec();
  }

  update(id: string, updateVendaDto: UpdateVendaDto) {
    const updateData: any = { ...updateVendaDto };
    if (updateVendaDto.subtotal) {
      updateData.subtotal = Types.Decimal128.fromString(updateVendaDto.subtotal);
    }
    if (updateVendaDto.descontos) {
      updateData.descontos = Types.Decimal128.fromString(updateVendaDto.descontos);
    }
    if (updateVendaDto.total) {
      updateData.total = Types.Decimal128.fromString(updateVendaDto.total);
    }
    return this.vendaModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  remove(id: string) {
    return this.vendaModel.findByIdAndDelete(id).exec();
  }

  // ItensVenda CRUD
  createItem(createItensVendaDto: CreateItensVendaDto) {
    const itemData: any = { ...createItensVendaDto };
    if (createItensVendaDto.valorUnitario) {
      itemData.valorUnitario = Types.Decimal128.fromString(createItensVendaDto.valorUnitario);
    }
    if (createItensVendaDto.totalItem) {
      itemData.totalItem = Types.Decimal128.fromString(createItensVendaDto.totalItem);
    }
    const createdItem = new this.itensVendaModel(itemData);
    return createdItem.save();
  }

  findAllItems() {
    return this.itensVendaModel.find().exec();
  }

  findOneItem(id: string) {
    return this.itensVendaModel.findById(id).exec();
  }

  updateItem(id: string, updateItensVendaDto: UpdateItensVendaDto) {
    const updateData: any = { ...updateItensVendaDto };
    if (updateItensVendaDto.valorUnitario) {
      updateData.valorUnitario = Types.Decimal128.fromString(updateItensVendaDto.valorUnitario);
    }
    if (updateItensVendaDto.totalItem) {
      updateData.totalItem = Types.Decimal128.fromString(updateItensVendaDto.totalItem);
    }
    return this.itensVendaModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  removeItem(id: string) {
    return this.itensVendaModel.findByIdAndDelete(id).exec();
  }
}