import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreatePerfilDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsArray()
  @IsString({ each: true })
  permissoes: string[];
}
