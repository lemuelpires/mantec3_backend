export class CreateTermosRecebimentoDto {
  recebimentoEquipamentoId: string;
  texto: string;
  assinado?: boolean;
  metodoAssinatura?: string;
  dataAssinatura?: Date;
}