export class CreateClienteDto {
  empresaId: string;
  nome: string;
  cpfCnpj: string;
  telefone?: string;
  email?: string;
  endereco?: any;
  ativo?: boolean;
}
