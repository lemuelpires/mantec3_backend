import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ComponentesAusentes, ComponentesAusentesDocument } from './componentes-ausentes.schema';
import { CreateComponentesAusentesDto } from './dto/create-componentes-ausentes.dto';
import { UpdateComponentesAusentesDto } from './dto/update-componentes-ausentes.dto';

@Injectable()
export class ComponentesAusentesService {
  constructor(
    @InjectModel(ComponentesAusentes.name) private componentesAusentesModel: Model<ComponentesAusentesDocument>,
  ) {}

  create(createComponentesAusentesDto: CreateComponentesAusentesDto) {
    const createdComponentesAusentes = new this.componentesAusentesModel(createComponentesAusentesDto);
    return createdComponentesAusentes.save();
  }

  findAll() {
    return this.componentesAusentesModel.find().exec();
  }

  findOne(id: string) {
    return this.componentesAusentesModel.findById(id).exec();
  }

  update(id: string, updateComponentesAusentesDto: UpdateComponentesAusentesDto) {
    return this.componentesAusentesModel.findByIdAndUpdate(id, updateComponentesAusentesDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.componentesAusentesModel.findByIdAndDelete(id).exec();
  }
}