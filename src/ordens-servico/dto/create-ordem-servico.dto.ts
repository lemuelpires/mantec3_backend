export class CreateOrdemServicoDto {
  empresaId: string;
  clienteId: string;
  tecnicoId: string;
  orcamentoId?: string;
  recebimentoEquipamentoId: string;
  statusOperacional: string;
  prioridade: string;
  dataEntrada: Date;
  dataConclusao?: Date;
}