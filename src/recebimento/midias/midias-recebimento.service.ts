import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MidiasRecebimento, MidiasRecebimentoDocument } from './midias-recebimento.schema';
import { CreateMidiasRecebimentoDto } from './dto/create-midias-recebimento.dto';
import { UpdateMidiasRecebimentoDto } from './dto/update-midias-recebimento.dto';

@Injectable()
export class MidiasRecebimentoService {
  constructor(
    @InjectModel(MidiasRecebimento.name) private midiasRecebimentoModel: Model<MidiasRecebimentoDocument>,
  ) {}

  create(createMidiasRecebimentoDto: CreateMidiasRecebimentoDto) {
    const createdMidiasRecebimento = new this.midiasRecebimentoModel(createMidiasRecebimentoDto);
    return createdMidiasRecebimento.save();
  }

  findAll() {
    return this.midiasRecebimentoModel.find().exec();
  }

  findOne(id: string) {
    return this.midiasRecebimentoModel.findById(id).exec();
  }

  update(id: string, updateMidiasRecebimentoDto: UpdateMidiasRecebimentoDto) {
    return this.midiasRecebimentoModel.findByIdAndUpdate(id, updateMidiasRecebimentoDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.midiasRecebimentoModel.findByIdAndDelete(id).exec();
  }
}