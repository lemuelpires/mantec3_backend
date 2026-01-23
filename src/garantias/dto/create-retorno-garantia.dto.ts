export class CreateRetornoGarantiaDto {
  garantiaId: string;
  tipoRetorno: string;
  produtoSubstitutoId?: string;
  valorCredito?: number;
  dataRetorno: Date;
  observacoes?: string;
}