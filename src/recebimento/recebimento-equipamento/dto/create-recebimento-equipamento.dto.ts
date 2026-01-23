export class CreateRecebimentoEquipamentoDto {
  empresaId: string;
  clienteId: string;
  tipoEquipamento: string;
  marca: string;
  modelo: string;
  imeiOuSerial: string;
  dataRecebimento: Date;
  recebidoPor: string;
  observacoesGerais?: string;
  status: string;
}