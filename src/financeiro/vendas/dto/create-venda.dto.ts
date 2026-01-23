export class CreateVendaDto {
  empresaId: string;
  clienteId: string;
  origemTipo: string;
  origemId: string;
  subtotal: string;
  descontos?: string;
  total: string;
  statusFinanceiro: string;
}