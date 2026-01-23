export class CreateMovimentoEstoqueDto {
  empresaId: string;
  produtoId: string;
  tipo: string;
  quantidade: number;
  origemTipo: string;
  origemId: string;
}