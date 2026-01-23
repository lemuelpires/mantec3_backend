import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogEvento, LogEventoDocument } from './schemas/log-evento.schema';
import { CreateLogEventoDto } from './dto/create-log-evento.dto';
import { UpdateLogEventoDto } from './dto/update-log-evento.dto';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectModel(LogEvento.name) private logEventoModel: Model<LogEventoDocument>,
  ) {}

  async create(createLogEventoDto: CreateLogEventoDto): Promise<LogEvento> {
    const createdLogEvento = new this.logEventoModel(createLogEventoDto);
    return createdLogEvento.save();
  }

  async findAll(): Promise<LogEvento[]> {
    return this.logEventoModel.find().exec();
  }

  async findOne(id: string) {
    return this.logEventoModel.findById(id).exec();
  }

  async update(id: string, updateLogEventoDto: UpdateLogEventoDto) {
    return this.logEventoModel.findByIdAndUpdate(id, updateLogEventoDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.logEventoModel.findByIdAndDelete(id).exec();
  }
}
