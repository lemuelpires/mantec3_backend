import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateNotificacaoDto {
  @IsNotEmpty()
  empresaId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  tipo: string;

  @IsNotEmpty()
  @IsString()
  destino: string;

  @IsNotEmpty()
  @IsString()
  mensagem: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}