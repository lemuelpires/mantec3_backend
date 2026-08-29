import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Orcamento, OrcamentoDocument } from './schemas/orcamento.schema';
import { ItensOrcamento, ItensOrcamentoDocument } from './schemas/itens-orcamento.schema';
import { CreateOrcamentoDto } from './dto/create-orcamento.dto';
import { UpdateOrcamentoDto } from './dto/update-orcamento.dto';
import { CreateItensOrcamentoDto } from './dto/create-itens-orcamento.dto';
import { UpdateItensOrcamentoDto } from './dto/update-itens-orcamento.dto';
import { assertCanEditOrcamento, assertCanTransitionOrcamento } from './state/orcamento.transitions';
import { ORCAMENTO_STATUS, isOrcamentoStatus } from './state/orcamento.states';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AUDITORIA_ENTIDADES, AUDITORIA_EVENTOS } from '../auditoria/auditoria-eventos';
import { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { OsService } from '../ordens-servico/os.service';
import { OS_STATUS } from '../ordens-servico/state/os.states';
import { centavosParaDecimal128, dinheiroParaCentavos } from '../financeiro/financeiro-adm/financeiro-adm.types';

@Injectable()
export class OrcamentosService {
  constructor(
    @InjectModel(Orcamento.name) private orcamentoModel: Model<OrcamentoDocument>,
    @InjectModel(ItensOrcamento.name) private itensOrcamentoModel: Model<ItensOrcamentoDocument>,
    private readonly auditoriaService: AuditoriaService,
    private readonly osService: OsService,
  ) {}

  async create(createOrcamentoDto: CreateOrcamentoDto, user?: CurrentUserPayload) {
    const empresaId = this.getEmpresaIdPermitida(createOrcamentoDto.empresaId, user?.empresaId);
    const usuarioId = user?.id || user?._id || user?.sub || createOrcamentoDto.criadoPor;
    if (!isOrcamentoStatus(createOrcamentoDto.status)) {
      throw new BadRequestException(`Status de orcamento invalido: ${createOrcamentoDto.status}`);
    }

    const totais = this.calcularTotaisOrcamento((createOrcamentoDto as { itens?: any[] }).itens, createOrcamentoDto);
    const orcamentoData: Record<string, unknown> = {
      ...createOrcamentoDto,
      empresaId,
      criadoPor: usuarioId,
      subtotal: centavosParaDecimal128(totais.subtotalCentavos),
      descontos: centavosParaDecimal128(totais.descontosCentavos),
      total: centavosParaDecimal128(totais.totalCentavos),
    };
    const createdOrcamento = new this.orcamentoModel(orcamentoData);
    const saved = await createdOrcamento.save();

    await this.auditoriaService.registrarEventoNegocio({
      empresaId,
      usuarioId,
      tipoEvento: AUDITORIA_EVENTOS.ORCAMENTO_CRIADO,
      entidade: AUDITORIA_ENTIDADES.ORCAMENTO,
      entidadeId: saved._id as Types.ObjectId,
      dados: {
        status: createOrcamentoDto.status,
        clienteId: createOrcamentoDto.clienteId,
        total: totais.totalCentavos / 100,
      },
    });

    return saved;
  }

  findAll(empresaId?: string) {
    this.assertEmpresaInformada(empresaId);
    return this.orcamentoModel
      .find({ empresaId })
      .populate('empresaId', 'nomeFantasia razaoSocial')
      .populate('clienteId', 'nome cpfCnpj')
      .populate('recebimentoEquipamentoId', 'tipoEquipamento marca modelo imeiOuSerial')
      .populate('criadoPor', 'nome email')
      .exec();
  }

  findOne(id: string, empresaId?: string) {
    this.assertEmpresaInformada(empresaId);
    return this.orcamentoModel
      .findOne({ _id: id, empresaId })
      .populate('empresaId', 'nomeFantasia razaoSocial')
      .populate('clienteId', 'nome cpfCnpj')
      .populate('recebimentoEquipamentoId', 'tipoEquipamento marca modelo imeiOuSerial')
      .populate('criadoPor', 'nome email')
      .exec();
  }

  async update(id: string, updateOrcamentoDto: UpdateOrcamentoDto, empresaId?: string) {
    this.assertEmpresaInformada(empresaId);
    const orcamento = await this.orcamentoModel.findOne({ _id: id, empresaId }).exec();
    if (!orcamento) {
      throw new NotFoundException('Orcamento nao encontrado.');
    }

    const nextStatus = updateOrcamentoDto.status;
    const hasNonStatusChanges = Object.keys(updateOrcamentoDto).some((key) => key !== 'status');

    if (nextStatus) {
      assertCanTransitionOrcamento(orcamento.status, nextStatus);
    }

    if (hasNonStatusChanges) {
      assertCanEditOrcamento(orcamento.status);
    }

    const updateData: Record<string, unknown> = { ...updateOrcamentoDto, empresaId };
    delete updateData.subtotal;
    delete updateData.total;
    delete updateData.descontos;

    if (updateOrcamentoDto.descontos !== undefined) {
      const itensAtuais = await this.itensOrcamentoModel.find({ orcamentoId: id }).lean().exec();
      const totais = this.calcularTotaisOrcamento(itensAtuais, {
        descontos: updateOrcamentoDto.descontos,
        subtotal: orcamento.subtotal?.toString(),
        total: orcamento.total?.toString(),
      });
      updateData.subtotal = centavosParaDecimal128(totais.subtotalCentavos);
      updateData.descontos = centavosParaDecimal128(totais.descontosCentavos);
      updateData.total = centavosParaDecimal128(totais.totalCentavos);
    }
    const updated = await this.orcamentoModel.findOneAndUpdate({ _id: id, empresaId }, updateData, { new: true }).exec();

    if (nextStatus && nextStatus !== orcamento.status) {
      await this.auditoriaService.registrarEventoNegocio({
        empresaId: orcamento.empresaId,
        usuarioId: orcamento.criadoPor,
        tipoEvento: this.getOrcamentoAuditEvent(nextStatus),
        entidade: AUDITORIA_ENTIDADES.ORCAMENTO,
        entidadeId: orcamento._id as Types.ObjectId,
        dados: {
          statusAnterior: orcamento.status,
          statusAtual: nextStatus,
        },
      });
    }

    return updated;
  }

  async remove(id: string, empresaId?: string) {
    this.assertEmpresaInformada(empresaId);
    const orcamento = await this.orcamentoModel.findOne({ _id: id, empresaId }).exec();
    if (!orcamento) {
      throw new NotFoundException('Orcamento nao encontrado.');
    }

    assertCanEditOrcamento(orcamento.status);
    return this.orcamentoModel.findOneAndUpdate({ _id: id, empresaId }, { status: ORCAMENTO_STATUS.CANCELADO }, { new: true }).exec();
  }

  async gerarOrdemServico(id: string, user?: CurrentUserPayload) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Orcamento invalido.');
    }

    const orcamento = await this.orcamentoModel.findById(id).exec();
    if (!orcamento) {
      throw new NotFoundException('Orcamento nao encontrado.');
    }

    if (user?.empresaId && String(orcamento.empresaId) !== user.empresaId) {
      throw new UnauthorizedException('Orcamento nao pertence a empresa do usuario.');
    }

    if (orcamento.status !== ORCAMENTO_STATUS.APROVADO) {
      throw new BadRequestException('Apenas orcamento aprovado pode gerar ordem de servico.');
    }

    const existente = await this.osService.findByOrcamento(id, user?.empresaId);
    if (existente) {
      return existente;
    }

    const tecnicoId = user?.id || user?._id || user?.sub || String(orcamento.criadoPor);

    return this.osService.create({
      empresaId: String(orcamento.empresaId),
      clienteId: String(orcamento.clienteId),
      tecnicoId,
      orcamentoId: id,
      recebimentoEquipamentoId: String(orcamento.recebimentoEquipamentoId),
      statusOperacional: OS_STATUS.ABERTA,
      prioridade: 'normal',
      dataEntrada: new Date().toISOString(),
    }, user?.empresaId);
  }

  async createItem(createItensOrcamentoDto: CreateItensOrcamentoDto, empresaId?: string) {
    await this.assertOrcamentoCanReceiveItem(createItensOrcamentoDto.orcamentoId, empresaId);

    const itemData: Record<string, unknown> = {
      ...createItensOrcamentoDto,
      valorUnitario: centavosParaDecimal128(this.parseValorCentavos(createItensOrcamentoDto.valorUnitario, 'valorUnitario')),
      totalItem: centavosParaDecimal128(this.calcularTotalItemCentavos(createItensOrcamentoDto)),
    };
    const createdItem = new this.itensOrcamentoModel(itemData);
    const saved = await createdItem.save();
    await this.recalcularTotaisOrcamento(createItensOrcamentoDto.orcamentoId);
    return saved;
  }

  async findAllItems(empresaId?: string) {
    const orcamentoIds = await this.getOrcamentoIdsDaEmpresa(empresaId);
    return this.itensOrcamentoModel.find({ orcamentoId: { $in: orcamentoIds } }).exec();
  }

  async findItemsByOrcamento(orcamentoId: string, empresaId?: string) {
    await this.assertOrcamentoDaEmpresa(orcamentoId, empresaId);
    return this.itensOrcamentoModel.find({ orcamentoId }).exec();
  }

  async findOneItem(id: string, empresaId?: string) {
    const item = await this.itensOrcamentoModel.findById(id).exec();
    if (!item) {
      return null;
    }

    await this.assertOrcamentoDaEmpresa(item.orcamentoId.toString(), empresaId);
    return item;
  }

  async updateItem(id: string, updateItensOrcamentoDto: UpdateItensOrcamentoDto, empresaId?: string) {
    const item = await this.itensOrcamentoModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Item de orcamento nao encontrado.');
    }

    await this.assertOrcamentoCanReceiveItem(item.orcamentoId.toString(), empresaId);
    if (updateItensOrcamentoDto.orcamentoId) {
      await this.assertOrcamentoCanReceiveItem(updateItensOrcamentoDto.orcamentoId, empresaId);
    }

    const updateData: Record<string, unknown> = { ...updateItensOrcamentoDto };
    const quantidade = updateItensOrcamentoDto.quantidade ?? item.quantidade;
    const valorUnitario = updateItensOrcamentoDto.valorUnitario ?? item.valorUnitario?.toString();
    updateData.valorUnitario = centavosParaDecimal128(this.parseValorCentavos(valorUnitario, 'valorUnitario'));
    updateData.totalItem = centavosParaDecimal128(this.calcularTotalItemCentavos({ quantidade, valorUnitario }));

    const updated = await this.itensOrcamentoModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    await this.recalcularTotaisOrcamento(item.orcamentoId.toString());
    if (updateItensOrcamentoDto.orcamentoId && updateItensOrcamentoDto.orcamentoId !== item.orcamentoId.toString()) {
      await this.recalcularTotaisOrcamento(updateItensOrcamentoDto.orcamentoId);
    }
    return updated;
  }

  async removeItem(id: string, empresaId?: string) {
    const item = await this.itensOrcamentoModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Item de orcamento nao encontrado.');
    }

    const orcamentoId = item.orcamentoId.toString();
    await this.assertOrcamentoCanReceiveItem(orcamentoId, empresaId);
    const removed = await this.itensOrcamentoModel.findByIdAndDelete(id).exec();
    await this.recalcularTotaisOrcamento(orcamentoId);
    return removed;
  }

  private async assertOrcamentoCanReceiveItem(orcamentoId: string, empresaId?: string) {
    const orcamento = await this.assertOrcamentoDaEmpresa(orcamentoId, empresaId);

    assertCanEditOrcamento(orcamento.status);
  }

  private async assertOrcamentoDaEmpresa(orcamentoId: string, empresaId?: string) {
    this.assertEmpresaInformada(empresaId);
    const orcamento = await this.orcamentoModel.findOne({ _id: orcamentoId, empresaId }).exec();
    if (!orcamento) {
      throw new NotFoundException('Orcamento nao encontrado.');
    }

    return orcamento;
  }

  private async getOrcamentoIdsDaEmpresa(empresaId?: string) {
    this.assertEmpresaInformada(empresaId);
    const orcamentos = await this.orcamentoModel.find({ empresaId }).select('_id').lean().exec();
    return orcamentos.map((orcamento) => orcamento._id);
  }

  private getEmpresaIdPermitida(inputEmpresaId: unknown, userEmpresaId?: string) {
    if (userEmpresaId) {
      if (inputEmpresaId && String(inputEmpresaId) !== String(userEmpresaId)) {
        throw new UnauthorizedException('Empresa informada nao pertence ao usuario.');
      }
      return userEmpresaId;
    }

    if (!inputEmpresaId) {
      throw new UnauthorizedException('Empresa do orcamento nao informada.');
    }

    return String(inputEmpresaId);
  }

  private assertEmpresaInformada(empresaId?: string): asserts empresaId is string {
    if (!empresaId) {
      throw new UnauthorizedException('Empresa do usuario nao informada.');
    }
  }

  private getOrcamentoAuditEvent(status: string) {
    switch (status) {
      case ORCAMENTO_STATUS.ENVIADO:
        return AUDITORIA_EVENTOS.ORCAMENTO_ENVIADO;
      case ORCAMENTO_STATUS.APROVADO:
        return AUDITORIA_EVENTOS.ORCAMENTO_APROVADO;
      case ORCAMENTO_STATUS.REJEITADO:
      case ORCAMENTO_STATUS.REPROVADO:
        return AUDITORIA_EVENTOS.ORCAMENTO_REPROVADO;
      case ORCAMENTO_STATUS.CANCELADO:
        return AUDITORIA_EVENTOS.ORCAMENTO_CANCELADO;
      default:
        return AUDITORIA_EVENTOS.ORCAMENTO_CRIADO;
    }
  }

  private calcularTotaisOrcamento(itens: any[] | undefined, dto: { subtotal?: unknown; descontos?: unknown; total?: unknown }) {
    const subtotalCentavos = Array.isArray(itens) && itens.length > 0
      ? itens.reduce((sum, item) => sum + this.calcularTotalItemCentavos(item), 0)
      : this.parseValorCentavos(dto.subtotal ?? dto.total ?? 0, 'subtotal');
    const descontosCentavos = dto.descontos !== undefined
      ? this.parseValorCentavos(dto.descontos, 'descontos')
      : 0;

    if (subtotalCentavos < 0 || descontosCentavos < 0) {
      throw new BadRequestException('Valores do orcamento nao podem ser negativos.');
    }

    if (descontosCentavos > subtotalCentavos) {
      throw new BadRequestException('Desconto nao pode ser maior que o subtotal do orcamento.');
    }

    return {
      subtotalCentavos,
      descontosCentavos,
      totalCentavos: subtotalCentavos - descontosCentavos,
    };
  }

  private calcularTotalItemCentavos(item: { quantidade?: unknown; valorUnitario?: unknown }) {
    const quantidade = Number(item.quantidade ?? 0);
    const valorUnitarioCentavos = this.parseValorCentavos(item.valorUnitario ?? 0, 'valorUnitario');
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      throw new BadRequestException('Quantidade do item deve ser maior que zero.');
    }

    if (valorUnitarioCentavos < 0) {
      throw new BadRequestException('Valor unitario do item nao pode ser negativo.');
    }

    return Math.round(quantidade * valorUnitarioCentavos);
  }

  private parseValorCentavos(value: unknown, campo: string) {
    const centavos = dinheiroParaCentavos(value);
    if (!Number.isFinite(centavos)) {
      throw new BadRequestException(`${campo} invalido.`);
    }

    return centavos;
  }

  private async recalcularTotaisOrcamento(orcamentoId: string) {
    const orcamento = await this.orcamentoModel.findById(orcamentoId).exec();
    if (!orcamento) {
      return;
    }

    const itens = await this.itensOrcamentoModel.find({ orcamentoId }).lean().exec();
    const totais = this.calcularTotaisOrcamento(itens, {
      descontos: orcamento.descontos?.toString(),
      subtotal: orcamento.subtotal?.toString(),
    });
    await this.orcamentoModel.findByIdAndUpdate(orcamentoId, {
      subtotal: centavosParaDecimal128(totais.subtotalCentavos),
      descontos: centavosParaDecimal128(totais.descontosCentavos),
      total: centavosParaDecimal128(totais.totalCentavos),
    }).exec();
  }
}
