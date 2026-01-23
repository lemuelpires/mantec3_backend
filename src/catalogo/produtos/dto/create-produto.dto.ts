export class CreateProdutoDto {
  empresaId: string;
  nome: string;
  descricao?: string;
  codigoInterno?: string;
  precoVenda?: string;
  ativo?: boolean;
}
