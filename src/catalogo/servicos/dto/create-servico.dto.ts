export class CreateServicoDto {
  empresaId: string;
  nome: string;
  descricao?: string;
  precoPadrao?: string;
  tempoEstimado?: number;
  ativo?: boolean;
}
