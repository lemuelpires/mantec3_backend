export class CreateOrcamentoDto {
  empresaId: string;
  clienteId: string;
  recebimentoEquipamentoId: string;
  status: string;
  validade: Date;
  subtotal: string;
  descontos?: string;
  total: string;
  observacoes?: string;
  criadoPor: string;
}