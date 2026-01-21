import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsEmail()
  email?: string;

  @IsString()
  telefone?: string;
}
