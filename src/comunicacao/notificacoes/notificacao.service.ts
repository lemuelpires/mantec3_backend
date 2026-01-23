import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notificacao, NotificacaoDocument } from './notificacao.schema';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from './dto/update-notificacao.dto';

@Injectable()
export class NotificacaoService {
  constructor(
    @InjectModel(Notificacao.name) private notificacaoModel: Model<NotificacaoDocument>,
  ) {}

  async create(createNotificacaoDto: CreateNotificacaoDto): Promise<Notificacao> {
    const createdNotificacao = new this.notificacaoModel(createNotificacaoDto);
    return createdNotificacao.save();
  }

  async findAll(): Promise<Notificacao[]> {
    return this.notificacaoModel.find().exec();
  }

  async findOne(id: string) {
    return this.notificacaoModel.findById(id).exec();
  }

  async update(id: string, updateNotificacaoDto: UpdateNotificacaoDto) {
    return this.notificacaoModel.findByIdAndUpdate(id, updateNotificacaoDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.notificacaoModel.findByIdAndDelete(id).exec();
  }
}