import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Perfil, PerfilDocument } from './schemas/perfil.schema';
import {
  UsuarioPerfil,
  UsuarioPerfilDocument,
} from './schemas/usuario-perfil.schema';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfisService {
  constructor(
    @InjectModel(Perfil.name)
    private perfilModel: Model<PerfilDocument>,
    @InjectModel(UsuarioPerfil.name)
    private usuarioPerfilModel: Model<UsuarioPerfilDocument>,
  ) {}

  // Perfil CRUD
  createPerfil(createPerfilDto: CreatePerfilDto) {
    const createdPerfil = new this.perfilModel(createPerfilDto);
    return createdPerfil.save();
  }

  findAllPerfis() {
    return this.perfilModel.find().exec();
  }

  findOnePerfil(id: string) {
    return this.perfilModel.findById(id).exec();
  }

  updatePerfil(id: string, updatePerfilDto: UpdatePerfilDto) {
    return this.perfilModel
      .findByIdAndUpdate(id, updatePerfilDto, { new: true })
      .exec();
  }

  removePerfil(id: string) {
    // Also remove associations
    this.usuarioPerfilModel.deleteMany({ perfilId: id }).exec();
    return this.perfilModel.findByIdAndDelete(id).exec();
  }

  // User-Perfil assignment
  assignPerfilToUsuario(usuarioId: string, perfilId: string) {
    const newAssignment = new this.usuarioPerfilModel({ usuarioId, perfilId });
    return newAssignment.save();
  }

  findPerfisOfUsuario(usuarioId: string) {
    return this.usuarioPerfilModel.find({ usuarioId }).populate('perfilId').exec();
  }

  removePerfilFromUsuario(usuarioId: string, perfilId: string) {
    return this.usuarioPerfilModel
      .deleteOne({ usuarioId, perfilId })
      .exec();
  }
}
