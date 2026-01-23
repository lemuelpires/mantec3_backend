import { IsString, IsNotEmpty, IsEmail, IsMongoId } from 'class-validator';

export class CreateUsuarioDto {
  @IsMongoId()
  @IsNotEmpty()
  empresaId: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  senhaHash: string; // In a real app, we'd take a password and hash it in the service.
}
