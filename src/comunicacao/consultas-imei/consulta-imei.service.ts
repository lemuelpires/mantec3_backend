import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsultaImei, ConsultaImeiDocument } from './consulta-imei.schema';
import { CreateConsultaImeiDto } from './dto/create-consulta-imei.dto';
import { UpdateConsultaImeiDto } from './dto/update-consulta-imei.dto';

@Injectable()
export class ConsultaImeiService {
  constructor(
    @InjectModel(ConsultaImei.name) private consultaImeiModel: Model<ConsultaImeiDocument>,
  ) {}

  async create(createConsultaImeiDto: CreateConsultaImeiDto): Promise<ConsultaImei> {
    const createdConsultaImei = new this.consultaImeiModel(createConsultaImeiDto);
    return createdConsultaImei.save();
  }

  async findAll(): Promise<ConsultaImei[]> {
    return this.consultaImeiModel.find().exec();
  }

  async findOne(id: string) {
    return this.consultaImeiModel.findById(id).exec();
  }

  async update(id: string, updateConsultaImeiDto: UpdateConsultaImeiDto) {
    return this.consultaImeiModel.findByIdAndUpdate(id, updateConsultaImeiDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.consultaImeiModel.findByIdAndDelete(id).exec();
  }
}