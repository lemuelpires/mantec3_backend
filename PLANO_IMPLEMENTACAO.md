# PLANO DE IMPLEMENTAÇÃO - MANTEC 3.0

Data da análise: 2026-08-25  
Escopo analisado:

- Backend: `D:\Projetos\projetoMantec\BackEnd\MantecBack3.0`
- Frontend: `D:\Projetos\projetoMantec\FrontEnd\FrontMantec2.0`

Este documento é um plano técnico para orientar a próxima etapa de implementação. Nenhuma correção de produto foi aplicada durante esta análise; foram feitas apenas leituras e validações não destrutivas.

## 1. Visão geral do projeto

O Mantec 3.0 é um sistema ERP/operacional para assistência técnica, com backend em NestJS/MongoDB e frontend em React/Vite. O produto cobre uma cadeia de atendimento ampla: autenticação, empresas, usuários, clientes, catálogo, recebimento de equipamentos, orçamento, ordem de serviço, estoque, compras, vendas, pagamentos, financeiro administrativo, fiscal, garantias, comunicação, auditoria, documentos e portal do cliente.

O projeto já possui uma base funcional relevante e várias decisões positivas:

- Backend modularizado por domínio.
- Uso de DTOs e `ValidationPipe`.
- Guarda global de autenticação por token.
- Guarda global de permissões baseada em eventos quando há metadados nos endpoints.
- Separação parcial por `empresaId` em módulos centrais.
- Documentação recente de segurança em `docs\seguranca`.
- Portal do cliente com token opaco armazenado por hash e possibilidade de revogação.
- Estados de negócio modelados em orçamento, ordem de serviço e garantia.
- Frontend com rotas protegidas, interceptores de autenticação e organização por módulos.

Apesar disso, o sistema ainda não está pronto para produção. Os principais riscos estão em autorização incompleta no backend, escopo multiempresa inconsistente, arquivos sensíveis em ambiente local, uploads públicos, ausência de transações em fluxos financeiros/estoque, testes quebrados, lint quebrado, pipeline de deploy sem gates de qualidade e funcionalidades de interface ainda incompletas.

## 2. Estado atual do projeto

Classificação atual: **MVP funcional em transição para pré-produção**.

O sistema parece ter boa cobertura de módulos e fluxos, mas ainda mistura partes maduras com partes antigas ou auxiliares que não seguem o mesmo padrão de segurança e consistência. A base pode evoluir para produção sem reescrita total, desde que a próxima etapa trate primeiro os riscos P0/P1.

### Validações executadas

| Área | Validação | Resultado |
|---|---:|---|
| Backend | Compilação de produção com `tsconfig.build.json` | Passou |
| Backend | Typecheck completo | Falhou por specs desatualizadas |
| Backend | Testes unitários | Falhou: 18 suites passaram, 2 falharam; 93/97 testes passaram |
| Backend | Testes e2e | Falhou: 1 suite passou, 1 falhou; 3/5 testes passaram |
| Backend | Lint sem auto-fix | Falhou: 6198 problemas, majoritariamente formatação e regras `any`/unsafe |
| Backend | Auditoria de dependências | Não concluiu por erro de certificado |
| Frontend | Typecheck | Passou |
| Frontend | Lint | Falhou: 1 erro e 3 avisos |
| Frontend | Auditoria de dependências | Não concluiu por erro de certificado |

### Observações de repositório

- O backend possui mudanças locais já existentes em vários arquivos de segurança, autenticação, portal, catálogo, compras, garantias, recebimento e financeiro. Elas devem ser preservadas.
- O frontend possui mudanças locais já existentes em rotas, autenticação, comunicação e compatibilidade. Elas devem ser preservadas.
- O backend não possui `.dockerignore`; isso aumenta o risco de copiar `.env`, logs, `uploads`, `dist`, arquivos temporários e credenciais locais para a imagem Docker.
- O frontend possui `.dockerignore`, mas ainda usa `npm install` em vez de `npm ci` no Dockerfile.

## 3. Arquitetura identificada

### Backend

Tecnologias principais:

- NestJS 11.
- Mongoose/MongoDB.
- DTOs com `class-validator` e `class-transformer`.
- Swagger via `@nestjs/swagger`.
- Autenticação própria por token HMAC.
- Firebase Admin inicializado por credencial de ambiente para integração legada/pontual.
- Uploads com Multer e armazenamento local.

Módulos principais:

- `auth`: login, token, usuário atual.
- `usuarios`, `permissoes`, `core/empresa`: identidade, empresa e perfis.
- `clientes`: cadastro de clientes.
- `catalogo`: produtos, serviços e compatibilidade.
- `recebimento`: recebimento de equipamento, condições, componentes ausentes, mídias e termos.
- `orcamentos`: orçamentos, itens e transições de estado.
- `ordens-servico`: OS, itens utilizados, reservas e entrega.
- `estoque`: movimentos e disponibilidade.
- `compras`: fornecedores, pedidos e itens.
- `financeiro`: vendas, pagamentos e financeiro administrativo.
- `fiscal`: nota fiscal de serviço.
- `garantias`: fluxo de garantia, envios, retornos e créditos.
- `comunicacao`: templates, notificações e consulta IMEI.
- `portal-cliente`: sessão pública/revogável do cliente.
- `auditoria`: registro e consulta de eventos.
- `documentos`: geração de documentos.

### Frontend

Tecnologias principais:

- React 19.
- Vite 8.
- TypeScript.
- React Router.
- Axios.
- CSS modular/global simples.
- Lucide React.

Estrutura:

- `src/routes/routes.tsx`: definição central de rotas.
- `src/constants/navigation.ts`: navegação principal.
- `src/constants/permissions.constants.ts`: permissões de interface.
- `src/services/api`: cliente HTTP, endpoints e interceptores.
- `src/contexts/providers/AuthProvider.tsx`: sessão autenticada.
- `src/modules`: módulos de negócio alinhados ao backend.

### Infraestrutura e deploy

- Backend e frontend possuem Dockerfiles.
- Backend deploya via GitHub Actions em push para `master`.
- Frontend deploya via GitHub Actions em push para `main`.
- Deploy usa runner self-hosted e Docker Swarm.
- Pipelines atuais constroem imagens e fazem deploy, mas não executam testes/lint/auditoria como gate antes de publicar.

## 4. Principais problemas encontrados

### Segurança e autorização

1. **Autorização backend incompleta**

   A guarda de permissões só bloqueia quando o endpoint possui metadados como `@RequireEvento`. Alguns controllers não possuem `@RequireEvento`, `@RequireEventoFromBody` nem `@Public`; portanto, qualquer usuário autenticado pode chegar nesses endpoints se tiver token válido.

   Arquivos prioritários:

   - `src\catalogo\compatibilidade\compatibilidade.controller.ts`
   - `src\catalogo\produtos\produtos.controller.ts`
   - `src\catalogo\servicos\servicos.controller.ts`
   - `src\comunicacao\consultas-imei\consulta-imei.controller.ts`
   - `src\recebimento\componentes-ausentes\componentes-ausentes.controller.ts`
   - `src\recebimento\condicoes\condicoes-equipamento.controller.ts`
   - `src\recebimento\midias\midias-recebimento.controller.ts`
   - `src\recebimento\recebimento-equipamento\recebimento-equipamento.controller.ts`
   - `src\recebimento\termos\termos-recebimento.controller.ts`

2. **Escopo multiempresa inconsistente**

   Vários módulos aplicam `empresaId` corretamente, mas há serviços com `findById`, `findByIdAndUpdate`, `findByIdAndDelete` ou consultas por relacionamentos sem garantir escopo por empresa em todos os caminhos. Isso cria risco de IDOR/Broken Access Control.

   Áreas críticas:

   - Estoque.
   - Orçamentos.
   - Ordens de serviço.
   - Garantias.
   - Financeiro/pagamentos.
   - Fiscal.
   - Consulta IMEI.
   - Compatibilidade.
   - Sub-recursos de recebimento.

3. **Uploads públicos**

   O backend serve `uploads` de forma estática em `/uploads`. Isso pode expor fotos de equipamentos, anexos financeiros, documentos assinados, PDFs, assinaturas e arquivos internos sem autorização granular.

4. **Credencial Firebase Admin local**

   Existe um arquivo JSON local de credencial Firebase Admin em `src\config`. Ele não apareceu como rastreado pelo Git, mas contém material sensível no workspace. Há também código comentado antigo apontando para esse arquivo. Não reproduzir o conteúdo desse arquivo em logs, planos ou mensagens.

5. **Container backend sem proteção suficiente**

   O Dockerfile do backend não usa `.dockerignore`, usa `npm install`, copia o projeto inteiro para a imagem e executa como root. Isso aumenta risco de empacotar segredos locais, logs e uploads.

6. **Rate limit simples demais para produção**

   O limitador atual é em memória por processo. Em ambiente com múltiplas réplicas, reinício de container ou proxy mal configurado, ele não oferece proteção consistente contra força bruta e abuso.

7. **Token no localStorage**

   O frontend guarda o token em `localStorage`. Isso funciona, mas aumenta impacto em caso de XSS. O backend e o frontend ainda precisam de uma decisão explícita sobre cookies `HttpOnly/SameSite`, CSP e endurecimento de headers.

8. **Swagger e informações internas**

   Há proteção para Swagger em produção por configuração, o que é positivo. Ainda falta validar em ambiente real que ele não fica exposto acidentalmente.

### Integridade de dados

1. **Fluxos financeiros e estoque sem transações**

   Compras, vendas, pagamentos, movimentos de estoque, reservas, consumo de peças e sincronização de títulos financeiros executam várias escritas relacionadas sem transação/atomicidade. Em concorrência, isso pode gerar pagamento duplicado, estoque negativo, títulos inconsistentes ou registros órfãos.

2. **Totais monetários confiados ao frontend**

   Orçamentos, vendas, compras e itens recebem valores calculados do cliente. O backend deve recalcular totais, descontos e status financeiros com base em regras próprias e snapshots dos itens.

3. **Índices únicos globais conflitantes com multiempresa**

   Exemplos:

   - `Cliente.cpfCnpj` é único globalmente.
   - `Fornecedor.cnpj` é único globalmente, embora o serviço valide por `empresaId + cnpj`.

   Isso pode impedir que empresas diferentes cadastrem o mesmo cliente/fornecedor, ou criar inconsistências entre regra de aplicação e regra do banco.

4. **Ausência de migrações**

   Não foi identificado mecanismo claro de migrations/versionamento de schema. Para produto comercial, mudanças de índices, campos obrigatórios e correções multiempresa precisam de migração controlada.

5. **Hard delete em entidades importantes**

   Há remoções definitivas em módulos como produtos, compras, orçamentos, OS e outros. Em ERP, a regra padrão deve favorecer cancelamento, inativação ou soft delete auditável.

6. **Subdocumentos e filhos sem `empresaId`**

   Itens de orçamento/venda, mídias, condições, componentes, termos, reservas e itens de OS dependem do documento pai para escopo de empresa. Isso é aceitável, mas exige que todos os endpoints diretos validem o pai antes de ler, alterar ou excluir.

### Qualidade e manutenção

1. **Specs desatualizadas**

   Os testes falham porque alguns contratos mudaram para incluir `empresaId` e `Reflector`, mas as specs não foram atualizadas.

2. **Lint backend muito ruidoso**

   O backend tem milhares de problemas de lint, muitos de formatação/line ending e outros de tipagem insegura. Isso reduz a utilidade do lint como gate.

3. **Lint frontend falhando**

   O frontend tem um erro de hook em `AppLayout.tsx` e avisos de dependências em hooks.

4. **READMEs genéricos**

   Os READMEs ainda são quase templates de Nest/Vite. Falta documentação operacional real: setup, variáveis, segurança, deploy, testes, troubleshooting e runbooks.

5. **Pipelines sem qualidade antes do deploy**

   As GitHub Actions fazem build/deploy, mas não bloqueiam publicação com testes, lint, typecheck e auditoria.

6. **Frontend e backend duplicam permissões**

   As permissões do frontend são úteis para UX, mas não são autoridade. Há risco de divergência entre `src\constants\permissions.constants.ts` no frontend e `src\permissoes\matriz-permissoes.ts` no backend.

7. **Ações de exclusão vazias no frontend**

   Várias telas possuem `onDelete: () => {}`. Isso cria botões/ações aparentemente funcionais que não fazem nada.

### Funcionalidade e produto

1. **Go-live ainda não validado**

   O checklist de go-live em `FrontEnd\FrontMantec2.0\implantacao\checklist-go-live.md` está essencialmente pendente.

2. **Fluxos principais existem, mas precisam de homologação integrada**

   Recebimento -> orçamento -> OS -> estoque -> venda/pagamento -> garantia/portal precisa ser testado ponta a ponta com dados reais de homologação e perfis diferentes.

3. **Portal do cliente é promissor, mas precisa endurecimento**

   Sessões revogáveis e token hash são positivos. Ainda faltam validações de expiração, revogação, PDFs públicos, minimização de dados e monitoramento de abuso em produção.

4. **Financeiro administrativo é amplo e sensível**

   Relatórios, anexos, contas, categorias, títulos, movimentos, recorrências e fechamentos mensais têm alto impacto em integridade contábil. Precisam de transações, permissões detalhadas e auditoria robusta.

## 5. O que está faltando

### Bloqueadores antes de produção

- Corrigir testes unitários e e2e quebrados.
- Corrigir lint frontend e definir estratégia incremental para lint backend.
- Fechar autorização backend nos controllers sem metadados.
- Padronizar escopo multiempresa em todos os serviços sensíveis.
- Proteger uploads sensíveis por autenticação/autorização.
- Remover risco de credenciais locais e impedir empacotamento em Docker.
- Recalcular valores financeiros no backend.
- Adicionar transações/atomicidade nos fluxos financeiros, estoque, compras e OS.
- Implementar gates de CI antes de deploy.
- Validar auditoria de dependências depois de corrigir cadeia de certificado.

### Faltas importantes, mas não necessariamente bloqueadoras do primeiro hardening

- Sistema de migrations.
- Índices compostos por empresa e consultas reais.
- Soft delete/cancelamento auditável para entidades de negócio.
- Documentação operacional completa.
- Observabilidade básica: logs estruturados, health checks, métricas e alertas.
- Testes de regressão multiempresa/IDOR.
- Testes frontend de fluxos críticos.
- Revisão de UX para ações vazias e feedback consistente.

## 6. Dívidas técnicas identificadas

| Dívida | Impacto | Prioridade |
|---|---:|---:|
| Autorização depende de decorators opcionais | Alto risco de acesso indevido | P1 |
| Tenant scoping implementado caso a caso | Alto risco de vazamento entre empresas | P1 |
| Escritas relacionadas sem transação | Alto risco de dados financeiros/estoque inconsistentes | P1 |
| Uploads em pasta pública estática | Alto risco de exposição de documentos | P1 |
| Backend Docker sem `.dockerignore` e rodando como root | Alto risco operacional/segurança | P1 |
| Lint backend com milhares de erros | Reduz manutenção e confiança em CI | P1 |
| Permissões duplicadas entre front/back | Risco de divergência funcional | P2 |
| Migrations ausentes | Risco em evolução de schema | P2 |
| Índices insuficientes/inconsistentes | Risco de performance e erros multiempresa | P2 |
| READMEs genéricos | Onboarding e operação frágeis | P2 |
| Frontend com ações de exclusão no-op | UX inconsistente e risco operacional | P2 |
| Logs de debug em garantia | Pode vazar dados e poluir produção | P2 |

## 7. Riscos críticos

### Risco 1 - IDOR/Broken Access Control entre empresas

**Severidade:** Crítica  
**Probabilidade:** Alta enquanto houver endpoints diretos por ID sem empresa  
**Impacto:** Um usuário autenticado pode acessar ou alterar dados de outra empresa se descobrir IDs.

Mitigação:

- Criar padrão único de consulta por empresa.
- Exigir `CurrentUser` em endpoints sensíveis.
- Validar empresa no serviço, não apenas no controller.
- Adicionar testes de regressão tentando acessar IDs de outra empresa.

### Risco 2 - Exposição de uploads/documentos

**Severidade:** Crítica  
**Probabilidade:** Média/Alta  
**Impacto:** Vazamento de fotos, anexos financeiros, documentos assinados, PDFs, assinaturas ou dados pessoais.

Mitigação:

- Separar arquivos públicos e privados.
- Remover acesso estático irrestrito para arquivos sensíveis.
- Servir arquivos por controller autenticado e autorizado.
- Usar nomes opacos, validação de MIME real e limites por tipo.

### Risco 3 - Corrupção financeira/estoque por concorrência

**Severidade:** Crítica  
**Probabilidade:** Média em produção real  
**Impacto:** estoque negativo, pagamentos duplicados, venda quitada incorretamente, títulos inconsistentes.

Mitigação:

- Usar transações MongoDB em operações multi-documento.
- Criar invariantes no backend.
- Tornar webhooks/ações críticas idempotentes.
- Testar concorrência nos fluxos críticos.

### Risco 4 - Deploy automático sem gates

**Severidade:** Alta  
**Probabilidade:** Alta  
**Impacto:** Código com testes/lint quebrados pode ir para produção.

Mitigação:

- Separar pipeline de CI e CD.
- Exigir build, typecheck, lint e testes antes de imagem/deploy.
- Bloquear deploy se auditoria crítica falhar.

### Risco 5 - Segredos e arquivos locais em imagem

**Severidade:** Alta  
**Probabilidade:** Média  
**Impacto:** Credenciais, `.env`, uploads e logs podem entrar em imagem Docker.

Mitigação:

- Criar `.dockerignore` no backend.
- Usar multi-stage build, `npm ci` e usuário não root.
- Garantir credenciais por secrets/variáveis externas.
- Remover referências antigas a arquivos locais de credencial.

## 8. Tarefas recomendadas

Legenda:

- P0: bloqueia início seguro de implementação/homologação.
- P1: bloqueia produção.
- P2: importante para produto comercial confiável.
- P3: melhoria ou acabamento posterior.

| ID | Prioridade | Tarefa | Complexidade | Risco de mudança | Principais arquivos/áreas | Critério de aceite |
|---|---:|---|---:|---:|---|---|
| P0-001 | P0 | Atualizar specs quebradas após mudanças de assinatura com `empresaId` e `Reflector` | P | Baixo | Backend `src\**\*.spec.ts`, `test\*.e2e-spec.ts` | Unit e e2e passam localmente |
| P0-002 | P0 | Corrigir lint frontend | P | Baixo | `src\components\layout\AppLayout.tsx`, páginas de vendas e portal | `npm run lint` passa no frontend |
| P0-003 | P0 | Registrar baseline de qualidade sem alterar regras | P | Baixo | Backend/frontend | Documento curto com comandos, resultados e pendências reproduzíveis |
| P1-001 | P1 | Adicionar autorização explícita nos controllers sem `@RequireEvento` | M | Médio | Catálogo, recebimento, consulta IMEI | Usuário autenticado sem permissão recebe 403 |
| P1-002 | P1 | Padronizar escopo multiempresa em serviços sensíveis | G | Alto | Estoque, orçamentos, OS, garantias, fiscal, financeiro, recebimento filhos | Testes IDOR passam; queries incluem empresa ou validam pai |
| P1-003 | P1 | Proteger uploads sensíveis | G | Alto | `src\main.ts`, `src\common\uploads`, midias, financeiro anexos, documentos | Arquivo privado não abre sem autenticação/autorização |
| P1-004 | P1 | Endurecer Docker backend | P | Médio | `Dockerfile`, novo `.dockerignore` | Imagem não contém `.env`, uploads, logs ou credenciais; app roda sem root |
| P1-005 | P1 | Remover risco de credencial Firebase local | P | Médio | `src\config`, `src\auth\firebase\firebase.service.ts` | Nenhum código aponta para JSON local; credencial vem de secret/ADC |
| P1-006 | P1 | Recalcular valores monetários no backend | M/G | Alto | Orçamentos, vendas, compras, pagamentos | Totais enviados pelo frontend não definem total final sem validação |
| P1-007 | P1 | Adicionar transações nos fluxos financeiros/estoque | G | Alto | Vendas, pagamentos, compras, OS, estoque, financeiro adm | Operações compostas são atômicas ou possuem rollback compensável |
| P1-008 | P1 | Corrigir/estruturar lint backend incremental | M | Médio | Backend inteiro | Lint vira gate útil sem mascarar erros de segurança |
| P1-009 | P1 | Implantar CI com gates antes de deploy | M | Médio | `.github\workflows` backend/frontend | Deploy só ocorre após build, typecheck, lint e testes |
| P1-010 | P1 | Revisar rate limit e trust proxy | M | Médio | `SimpleRateLimitGuard`, bootstrap/proxy | Login e portal protegidos em múltiplas réplicas |
| P1-011 | P1 | Validar Swagger/CORS/security headers em ambiente real | P | Médio | `src\config\security.config.ts`, Nginx | Swagger fechado em produção; CORS restrito; headers presentes |
| P2-001 | P2 | Introduzir migrations/versionamento de schema | M | Médio | Backend infra/scripts | Mudanças de índice/schema rodam de forma controlada |
| P2-002 | P2 | Corrigir índices únicos multiempresa | M | Alto | Schemas de cliente/fornecedor e migração | CPF/CNPJ e CNPJ respeitam regra por empresa sem conflito |
| P2-003 | P2 | Criar índices compostos para consultas críticas | M | Médio | Schemas Mongoose | Queries por empresa/status/data usam índices adequados |
| P2-004 | P2 | Substituir hard delete por inativação/cancelamento onde necessário | M/G | Alto | Catálogo, compras, orçamentos, OS, financeiro | Exclusões preservam trilha e integridade referencial |
| P2-005 | P2 | Unificar matriz de permissões backend/frontend | M | Médio | `matriz-permissoes.ts`, `permissions.constants.ts` | Backend é fonte de verdade; front consome/espelha sem divergência |
| P2-006 | P2 | Remover ações `onDelete` vazias ou implementar fluxo real | M | Médio | List pages frontend | Nenhuma ação visível fica sem efeito |
| P2-007 | P2 | Limpar logs de debug e padronizar erros | P | Baixo | Garantia frontend, services e interceptors | Produção não registra payloads sensíveis no console |
| P2-008 | P2 | Completar documentação operacional | M | Baixo | READMEs, docs de deploy/segurança | Novo dev consegue rodar, testar e operar sem conhecimento tribal |
| P2-009 | P2 | Corrigir auditoria de dependências/certificados | P/M | Médio | Ambiente Node/NPM/CI | `npm audit --omit=dev` executa e resultado é tratado |
| P2-010 | P2 | Adicionar testes integrados por fluxo de negócio | G | Médio | Backend e frontend | Fluxos principais cobertos em homologação automatizada |
| P3-001 | P3 | Melhorar observabilidade | M | Médio | Logging, health checks, métricas | Falhas críticas ficam rastreáveis sem expor dados |
| P3-002 | P3 | Revisar performance/code splitting frontend | M | Baixo | Vite/rotas/módulos | Bundles menores e carregamento progressivo |
| P3-003 | P3 | Melhorar UX de estados vazios, carregamento e erros | M | Baixo | Frontend módulos | Usuário entende falhas e próximos passos sem suporte |

## 9. Ordem ideal de execução

### Fase 0 - Baseline e estabilização imediata

Objetivo: deixar o projeto validável e reduzir ruído antes de tocar em segurança profunda.

Tarefas:

- P0-001: atualizar specs quebradas.
- P0-002: corrigir lint frontend.
- P0-003: registrar baseline reproduzível.
- P2-009: resolver auditoria de dependências/certificados ou documentar exceção temporária controlada.

Saída esperada:

- Backend com testes unitários/e2e verdes.
- Frontend com lint/typecheck verdes.
- Auditoria de dependências executável ou bloqueio ambiental documentado.

### Fase 1 - Segurança backend e multiempresa

Objetivo: fechar riscos de acesso indevido antes de ampliar funcionalidades.

Tarefas:

- P1-001: autorização explícita nos controllers.
- P1-002: escopo multiempresa padronizado.
- P1-010: rate limit/trust proxy.
- P1-011: validação real de Swagger/CORS/headers.
- Testes de regressão IDOR por módulo crítico.

Saída esperada:

- Todo endpoint sensível exige permissão adequada.
- Usuário de uma empresa não consegue ler, alterar ou excluir dados de outra.
- Regressões de autorização bloqueadas por testes.

### Fase 2 - Arquivos, segredos e containers

Objetivo: impedir vazamento de dados e segredos.

Tarefas:

- P1-003: uploads protegidos.
- P1-004: Docker backend endurecido.
- P1-005: credencial Firebase local removida como risco.
- P2-007: logs de debug removidos.
- Headers de segurança no Nginx/frontend.

Saída esperada:

- Nenhum arquivo sensível acessível publicamente por URL direta.
- Imagens Docker não carregam segredos/artefatos locais.
- Logs e frontend não expõem payloads sensíveis.

### Fase 3 - Integridade financeira, estoque e dados

Objetivo: garantir consistência em operações que afetam dinheiro, estoque e histórico.

Tarefas:

- P1-006: recálculo backend de valores.
- P1-007: transações/atomicidade.
- P2-001: migrations.
- P2-002: índices únicos multiempresa.
- P2-003: índices compostos.
- P2-004: política de soft delete/cancelamento.

Saída esperada:

- Pagamentos, vendas, estoque e compras mantêm invariantes mesmo com concorrência.
- Banco preparado para evolução segura.
- Operações destrutivas ficam protegidas/auditáveis.

### Fase 4 - CI/CD e qualidade contínua

Objetivo: impedir que regressões cheguem a produção.

Tarefas:

- P1-008: lint backend estruturado.
- P1-009: gates de CI/CD.
- P2-010: testes integrados.
- Definir política de branch consistente entre backend e frontend.

Saída esperada:

- Pull/push com validações automáticas.
- Deploy bloqueado por falhas de qualidade.
- Branches e ambientes com regra clara.

### Fase 5 - Produto, UX e go-live

Objetivo: deixar a experiência comercial pronta e homologada.

Tarefas:

- P2-005: permissões backend/frontend unificadas.
- P2-006: ações vazias corrigidas.
- P2-008: documentação operacional.
- P3-001: observabilidade.
- P3-002: performance/frontend.
- P3-003: acabamento de UX.
- Executar checklist de go-live.

Saída esperada:

- Usuários conseguem operar fluxos críticos sem ações quebradas.
- Suporte e operação têm documentação.
- Produto pronto para homologação final com cliente.

## 10. Prioridades por impacto

### Impacto máximo em segurança

1. Autorização explícita em todos os endpoints.
2. Escopo multiempresa no backend.
3. Uploads privados.
4. Segredos fora do código/imagem.
5. Rate limit adequado para produção.

### Impacto máximo em integridade de dados

1. Transações em financeiro/estoque/compras/OS.
2. Recálculo de valores no backend.
3. Índices únicos corretos por empresa.
4. Migrations.
5. Soft delete/cancelamento auditável.

### Impacto máximo em confiabilidade

1. Testes unitários/e2e verdes.
2. CI/CD com gates.
3. Auditoria de dependências executável.
4. Logs estruturados e health checks.
5. Documentação operacional.

### Impacto máximo em experiência do usuário

1. Remover ações visíveis sem efeito.
2. Padronizar feedback de erro/sucesso.
3. Melhorar carregamento de módulos pesados.
4. Homologar fluxos por perfil.
5. Revisar mensagens de permissão negada.

## 11. Problemas que impedem produção

O produto não deve ser considerado pronto para produção enquanto persistirem os seguintes pontos:

1. Testes backend unitários/e2e falhando.
2. Lint frontend falhando.
3. Lint backend sem condição de uso como gate.
4. Endpoints autenticados sem autorização granular.
5. Consultas por ID sem garantia uniforme de empresa.
6. Uploads e anexos servidos publicamente.
7. Docker backend com risco de copiar segredos/artefatos locais.
8. Fluxos financeiros e estoque sem transação.
9. Totais financeiros aceitos do frontend como fonte de verdade.
10. Pipeline de deploy sem testes/lint antes da publicação.
11. Auditoria de dependências bloqueada por certificado.
12. Go-live checklist ainda pendente.

## 12. Problemas que podem ficar para depois

Estes itens não devem bloquear a próxima rodada de hardening, mas precisam entrar no roadmap:

- Code splitting e otimização fina de bundle.
- Melhorias visuais de telas maduras.
- Relatórios adicionais.
- Métricas avançadas e tracing distribuído.
- Refino de permissões por plano/assinatura.
- Portal do cliente com recursos extras além de consulta/aprovação.
- Internacionalização.
- Automação de treinamento/onboarding.
- Consolidação de componentes visuais duplicados.

## 13. Recomendações técnicas

### Backend

1. Transformar autorização em padrão obrigatório.

   Sugestão: endpoints protegidos devem falhar em desenvolvimento/teste quando não tiverem `@Public`, `@RequireEvento` ou outro metadado explícito. Isso reduz o risco de esquecer decorator.

2. Criar helpers de consulta multiempresa.

   Em vez de cada service montar filtros manualmente, criar funções internas para buscar por `_id + empresaId`, ou validar documento pai antes de acessar sub-recurso.

3. Adotar transações MongoDB nos fluxos críticos.

   Priorizar:

   - `PagamentosService.create/update/remove`.
   - `VendasService.create/update/remove`.
   - `ComprasService.create/updatePedidoCompra/removePedidoCompra`.
   - `OsService.reservarPeca/consumirReserva/finalizar`.
   - Movimentos de estoque.
   - Fechamento financeiro.

4. Recalcular dinheiro no backend.

   O backend deve calcular subtotal, descontos, total, total pago, saldo restante e status financeiro. O frontend pode sugerir valores para exibição, mas não deve ser fonte final.

5. Separar arquivos públicos e privados.

   - Público: assets sem dados pessoais, se existirem.
   - Privado: anexos financeiros, fotos de equipamento, termos, assinaturas, PDFs e documentos.

6. Introduzir migrations.

   Mesmo com Mongoose, usar um fluxo controlado para:

   - criar/remover índices;
   - backfill de `empresaId`;
   - ajustar unicidade;
   - migrar caminhos de uploads;
   - marcar registros removidos/inativos.

7. Revisar DTOs numéricos.

   Há validações de valor monetário por regex que permitem negativo em alguns pontos. Valores negativos só devem existir em casos de negócio explícitos, como desconto, estorno ou crédito.

8. Endurecer bootstrap.

   - Manter Swagger desligado em produção por padrão.
   - Validar CORS real em produção.
   - Configurar `trust proxy` de forma segura se estiver atrás de proxy.
   - Evitar mensagens internas em erro de produção.

### Frontend

1. Tratar permissões de frontend como UX, não segurança.

   O backend deve ser a autoridade. O frontend deve esconder ações sem permissão, mas o backend precisa bloquear.

2. Corrigir ações sem efeito.

   Telas com `onDelete: () => {}` devem ter uma destas decisões:

   - remover ação;
   - implementar fluxo com confirmação;
   - trocar por inativação/cancelamento quando hard delete não for permitido.

3. Reduzir risco do token em `localStorage`.

   Avaliar migração para cookie `HttpOnly/SameSite` ou, no mínimo, adicionar CSP, headers, redução de superfície XSS e limpeza de sessão robusta.

4. Remover logs de debug.

   Não registrar payloads de garantia, documentos, anexos ou dados pessoais no console em produção.

5. Centralizar tratamento de erro.

   Padronizar mensagens para 401, 403, validação, indisponibilidade e conflito de dados.

### Infra/DevOps

1. Backend Docker:

   - adicionar `.dockerignore`;
   - usar `npm ci`;
   - usar multi-stage build;
   - rodar como usuário não root;
   - copiar apenas `dist`, `node_modules` de produção e arquivos necessários;
   - não copiar `.env`, credenciais, uploads, logs, `src\config\*.json` sensível.

2. Frontend Docker/Nginx:

   - usar `npm ci`;
   - adicionar headers de segurança;
   - revisar usuário de execução;
   - garantir cache correto para `index.html` e assets.

3. CI/CD:

   - etapa CI antes de build de imagem;
   - deploy só após CI verde;
   - branch policy consistente;
   - secrets mínimos no runner;
   - auditoria de dependências com tratamento de exceções documentado.

## 14. Recomendações de segurança

### Checklist mínimo antes de produção

- [ ] Nenhum controller protegido sem regra explícita de autorização.
- [ ] Nenhum service crítico acessa documento por ID sem validar `empresaId` ou documento pai.
- [ ] Testes IDOR por empresa nos principais módulos.
- [ ] Uploads privados fora de rota estática pública.
- [ ] Validação de extensão, MIME real, tamanho e destino de upload.
- [ ] Nenhum segredo em repositório, imagem, log, frontend ou documentação.
- [ ] Docker backend com `.dockerignore` e usuário não root.
- [ ] CORS com allowlist real em produção.
- [ ] Swagger fechado em produção.
- [ ] Rate limit efetivo em login e portal em ambiente com proxy/réplicas.
- [ ] Headers de segurança no backend e no Nginx.
- [ ] Erros de produção sem stack trace ou detalhes internos.
- [ ] Logs sem tokens, senhas, documentos sensíveis ou payloads pessoais desnecessários.
- [ ] Auditoria de dependências executada e vulnerabilidades críticas tratadas.

### Pontos de atenção LGPD

O sistema lida com dados pessoais de clientes, telefones, e-mails, documentos, fotos de equipamentos, histórico de atendimento, assinatura e dados financeiros. Recomendações:

- Minimizar dados retornados no portal.
- Definir retenção de mídias e documentos.
- Auditar acessos a dados sensíveis.
- Garantir exclusão/inativação compatível com obrigações legais e fiscais.
- Evitar expor anexos por URL direta.
- Não registrar dados pessoais em logs de debug.

## 15. Status final

**STATUS: NÃO PRONTO PARA PRODUÇÃO**

Justificativa:

- A aplicação possui base funcional ampla e arquitetura evoluível.
- A compilação de produção do backend e o typecheck do frontend passam.
- Porém há falhas de testes, lint, autorização, escopo multiempresa, proteção de uploads, atomicidade financeira/estoque, pipeline e auditoria de dependências.
- Esses pontos afetam segurança, integridade de dados e confiabilidade, portanto bloqueiam publicação segura para clientes reais.

## 16. Próxima tarefa recomendada

Iniciar pela **Fase 0 - Baseline e estabilização imediata**.

Primeira sequência concreta:

1. Corrigir specs backend que falham por assinaturas desatualizadas.
2. Corrigir o erro de lint frontend em `AppLayout.tsx`.
3. Rodar novamente testes, e2e, typecheck e lint frontend.
4. Criar um checklist de regressão IDOR por módulo.
5. Em seguida, executar P1-001 e P1-002 como primeiro bloco real de implementação de segurança.

Critério para avançar à Fase 1:

- Backend unit/e2e passando.
- Frontend lint/typecheck passando.
- Falhas conhecidas do lint backend classificadas e com plano incremental.
- Nenhuma alteração destrutiva ou estrutural sem teste de regressão.

STATUS: PRONTO PARA INICIAR IMPLEMENTAÇÃO
