import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateConsultaImeiDto {
  @IsNotEmpty()
  empresaId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  imei: string;

  @IsNotEmpty()
  @IsString()
  resultado: string;
}