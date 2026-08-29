# Plano de Implementacao de Seguranca e Qualidade - Mantec ERP

Data da criacao: 2026-08-14

Este plano adapta o prompt mestre de seguranca ao contexto real do Mantec ERP. A execucao deve ser feita por fases, com validacao ao final de cada etapa.

## Regra Principal

Nao implementar tudo de uma vez.

Cada fase deve:

- Ter escopo pequeno e verificavel.
- Manter frontend e backend compilando.
- Evitar alterar comportamento de negocio sem necessidade.
- Ter teste manual ou automatizado associado.
- Registrar o que foi feito em `05_IMPLEMENTACOES_REALIZADAS.md`.

## Fase 0 - Baseline e Protecao de Configuracao

Objetivo: reduzir riscos imediatos de producao sem alterar regras de negocio.

Implementacoes:

- Restringir CORS por variavel de ambiente.
- Remover fallback inseguro de segredo em producao.
- Separar `AUTH_TOKEN_SECRET` e `PORTAL_CLIENTE_SECRET`.
- Habilitar Helmet.
- Configurar Swagger apenas fora de producao ou protegido por credencial/admin.
- Documentar variaveis obrigatorias.
- Criar validacao de ambiente na inicializacao.

Validacao:

- Backend compila.
- API sobe com variaveis validas.
- API falha claramente sem segredo obrigatorio.
- Frontend continua acessando API pelos dominios permitidos.
- Swagger nao fica aberto em producao.

Prioridade: Muito alta.

## Fase 1 - Login, Sessao e Rate Limit

Objetivo: proteger entrada do sistema e endpoints publicos.

Implementacoes:

- Adicionar rate limit global.
- Criar limite especifico para `/auth/login`.
- Criar limite especifico para `/portal-cliente/*`.
- Padronizar resposta de login invalido.
- Registrar tentativas bloqueadas sem gravar senha.
- Avaliar expiracao mais curta do token interno.
- Preparar caminho para refresh token ou renovacao controlada.

Validacao:

- Tentativas repetidas de login sao bloqueadas.
- Usuario valido ainda consegue logar.
- Portal continua funcionando dentro do limite.
- Logs nao exibem senha ou token.

Prioridade: Muito alta.

## Fase 2 - Blindagem Multiempresa e BOLA/IDOR

Objetivo: impedir acesso entre empresas por manipulacao de IDs.

Implementacoes:

- Criar helper/padrao central de escopo por empresa.
- Revisar services com `findById`, `find`, `findByIdAndUpdate` e `findByIdAndDelete`.
- Garantir que leitura, atualizacao e exclusao usem `empresaId`.
- Validar ObjectId antes de consultar.
- Padronizar erro para recurso inexistente ou fora da empresa.
- Criar testes com duas empresas e dois usuarios.

Modulos prioritarios:

- Clientes
- Recebimentos
- Orcamentos
- Ordens de servico
- Garantias
- Produtos
- Estoque
- Vendas
- Pagamentos
- Financeiro administrativo
- Auditoria

Validacao:

- Usuario da empresa A nao acessa dados da empresa B por ID.
- Listagens retornam apenas dados da empresa do usuario.
- Atualizacao e exclusao respeitam empresa.

Prioridade: Muito alta.

## Fase 3 - Permissoes por Perfil e Eventos

Objetivo: garantir que cada perfil execute apenas o que deve executar.

Implementacoes:

- Auditar todos os controllers sem `@UseGuards`.
- Padronizar `@RequiredEvento` em acoes de criacao, edicao, exclusao e transicao de status.
- Criar checklist de permissoes por perfil.
- Criar testes de permissao para perfis principais.
- Revisar telas do frontend para ocultar acoes sem permissao.

Validacao:

- Perfil sem permissao recebe 403.
- Acoes sensiveis nao aparecem para usuario sem permissao.
- Perfil administrador mantem acesso completo.

Prioridade: Alta.

## Fase 4 - Portal do Cliente Seguro

Objetivo: manter a experiencia do cliente simples, mas com controle real de seguranca.

Implementacoes:

- Criar entidade de sessao do portal no banco.
- Armazenar hash do token, nao o token puro.
- Permitir revogar link.
- Registrar criacao, acesso, aprovacao e reprovacao.
- Reduzir TTL padrao ou permitir configuracao por empresa.
- Criar protecao contra muitas tentativas invalidas.
- Garantir que PDF e orcamentos usem a sessao valida.
- Evitar expor IDs internos desnecessarios no payload publico.

Validacao:

- Link revogado deixa de abrir.
- Link expirado retorna mensagem amigavel.
- Cliente so ve seus proprios atendimentos.
- Aprovacao de orcamento registra auditoria.

Prioridade: Alta.

## Fase 5 - Uploads, Documentos e Arquivos

Objetivo: separar arquivos publicos de arquivos sensiveis.

Implementacoes:

- Classificar uploads em publicos e privados.
- Produtos podem continuar publicos quando forem imagens de catalogo.
- Anexos financeiros e midias de atendimento devem ser privados.
- Servir arquivos privados por controller autenticado.
- Validar MIME, extensao e tamanho por tipo.
- Bloquear nomes perigosos e path traversal.
- Criar limpeza segura de arquivos removidos.

Validacao:

- URL direta de anexo privado nao abre sem autenticacao.
- Upload rejeita tipo invalido.
- Produto continua exibindo imagem corretamente.
- PDF do portal continua funcionando com autorizacao por token.

Prioridade: Alta.

## Fase 6 - Logs, Auditoria e Erros

Objetivo: melhorar rastreabilidade sem vazar dados.

Implementacoes:

- Remover `console.log` de DTOs e payloads.
- Criar logger central com mascaramento.
- Padronizar campos proibidos em log: senha, token, documento, telefone completo, email completo quando desnecessario.
- Padronizar tratamento de erro global.
- Registrar eventos sensiveis no modulo de auditoria.
- Separar log tecnico de auditoria de negocio.

Validacao:

- Logs nao mostram senha, token ou payload completo.
- Erros retornam mensagem util sem stack trace em producao.
- Auditoria registra acoes criticas.

Prioridade: Media/Alta.

## Fase 7 - Frontend Seguro e Qualidade de UX

Objetivo: reduzir riscos no navegador e melhorar robustez operacional.

Implementacoes:

- Revisar armazenamento de token.
- Criar logout automatico em 401/403 conforme o caso.
- Evitar renderizacao de HTML nao confiavel.
- Adicionar politica de CSP quando possivel via servidor.
- Revisar rotas publicas e privadas.
- Melhorar code splitting para reduzir bundle principal.
- Criar mensagens amigaveis para link expirado, sem permissao e sessao encerrada.

Validacao:

- Token expirado remove sessao e orienta usuario.
- Rotas privadas nao abrem sem login.
- Portal continua publico apenas por link valido.
- Build frontend passa.

Prioridade: Media.

## Fase 8 - Dependencias, CI e Checklist Final

Objetivo: manter seguranca como rotina.

Implementacoes:

- Corrigir `npm audit` no ambiente local/CI.
- Rodar auditoria de dependencias em pipeline.
- Criar pipeline com build backend, build frontend e testes.
- Adicionar testes de seguranca prioritarios.
- Criar checklist final de go-live.

Validacao:

- CI falha quando build ou teste falha.
- Dependencias vulneraveis sao reportadas.
- Checklist final preenchido.

Prioridade: Media.

## Ordem Recomendada de Execucao

1. Fase 0 - Baseline e configuracao.
2. Fase 1 - Login e rate limit.
3. Fase 2 - Multiempresa e BOLA/IDOR.
4. Fase 3 - Permissoes.
5. Fase 4 - Portal do cliente.
6. Fase 5 - Uploads e documentos.
7. Fase 6 - Logs e auditoria.
8. Fase 7 - Frontend.
9. Fase 8 - CI e checklist final.

## Observacao de Homologacao

As fases 0, 1 e 2 devem ser homologadas com usuarios e dados de pelo menos duas empresas diferentes. Esse e o teste mais importante para um ERP multiempresa.

