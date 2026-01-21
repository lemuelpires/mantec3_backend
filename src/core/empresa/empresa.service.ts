import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Empresa, EmpresaDocument } from './schemas/empresa.schema';
import { CreateEmpresaDto } from './dto/create-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectModel(Empresa.name)
    private empresaModel: Model<EmpresaDocument>,
  ) {}

  create(data: CreateEmpresaDto) {
    return this.empresaModel.create(data);
  }

  findAll() {
    return this.empresaModel.find();
  }
}
