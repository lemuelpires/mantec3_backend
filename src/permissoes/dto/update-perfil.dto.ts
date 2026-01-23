import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdatePerfilDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissoes?: string[];
}
