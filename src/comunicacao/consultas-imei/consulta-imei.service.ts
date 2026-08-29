import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async create(createConsultaImeiDto: CreateConsultaImeiDto, empresaId?: string): Promise<ConsultaImei> {
    const scopedEmpresaId = this.getEmpresaIdPermitida(createConsultaImeiDto.empresaId, empresaId);
    const createdConsultaImei = new this.consultaImeiModel({
      ...createConsultaImeiDto,
      empresaId: scopedEmpresaId,
    });
    return createdConsultaImei.save();
  }

  async findAll(empresaId?: string): Promise<ConsultaImei[]> {
    this.assertEmpresaInformada(empresaId);
    return this.consultaImeiModel.find({ empresaId }).exec();
  }

  async findOne(id: string, empresaId?: string) {
    this.assertEmpresaInformada(empresaId);
    return this.consultaImeiModel.findOne({ _id: id, empresaId }).exec();
  }

  async update(id: string, updateConsultaImeiDto: UpdateConsultaImeiDto, empresaId?: string) {
    this.assertEmpresaInformada(empresaId);
    return this.consultaImeiModel.findOneAndUpdate(
      { _id: id, empresaId },
      { ...updateConsultaImeiDto, empresaId },
      { new: true },
    ).exec();
  }

  async remove(id: string, empresaId?: string) {
    this.assertEmpresaInformada(empresaId);
    return this.consultaImeiModel.findOneAndDelete({ _id: id, empresaId }).exec();
  }

  private getEmpresaIdPermitida(inputEmpresaId: unknown, userEmpresaId?: string) {
    if (userEmpresaId) {
      if (inputEmpresaId && String(inputEmpresaId) !== String(userEmpresaId)) {
        throw new UnauthorizedException('Empresa informada nao pertence ao usuario.');
      }
      return userEmpresaId;
    }

    return inputEmpresaId;
  }

  private assertEmpresaInformada(empresaId?: string): asserts empresaId is string {
    if (!empresaId) {
      throw new UnauthorizedException('Empresa do usuario nao informada.');
    }
  }
}
