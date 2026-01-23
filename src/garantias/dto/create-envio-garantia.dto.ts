export class CreateEnvioGarantiaDto {
  garantiaId: string;
  dataEnvio: Date;
  codigoRastreio?: string;
  observacoes?: string;
}