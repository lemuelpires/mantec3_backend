# Inventario de Seguranca - Mantec ERP

Data da auditoria inicial: 2026-08-14

Este inventario consolida o estado atual de seguranca e qualidade dos projetos:

- Frontend: `D:\Projetos\projetoMantec\FrontEnd\FrontMantec2.0`
- Backend: `D:\Projetos\projetoMantec\BackEnd\MantecBack3.0`

Esta primeira etapa nao altera codigo funcional. O objetivo e mapear os pontos existentes, riscos e ordem correta de implementacao.

## Stack Identificada

### Frontend

- React 19
- React Router 6
- TypeScript
- Vite
- Axios
- Armazenamento atual de sessao via `localStorage`
- SPA publicada em dominio proprio

### Backend

- NestJS 11
- TypeScript
- MongoDB com Mongoose
- Swagger
- Firebase Admin presente no projeto
- Uploads locais servidos por `/uploads`
- Autenticacao propria por token HMAC
- Autorizacao por guard de permissoes/eventos

## Modulos Principais Mapeados

### Operacao

- Clientes
- Recebimentos
- Orcamentos
- Ordens de servico
- Garantias
- Portal do cliente
- Comunicacao e notificacoes

### Gestao

- Produtos
- Servicos
- Compatibilidade
- Compras
- Fornecedores
- Estoque

### Financeiro e Fiscal

- Vendas
- Pagamentos
- Financeiro administrativo
- Nota fiscal de servico
- Documentos em PDF

### Sistema

- Empresas
- Usuarios
- Permissoes
- Auditoria
- Templates de comunicacao

## Superficie de API

### Endpoints autenticados

Grande parte dos controllers usa `AuthTokenGuard` e `PermissionGuard`, principalmente em:

- Usuarios
- Empresas
- Compras
- Vendas
- Pagamentos
- Financeiro administrativo
- Auditoria
- Documentos
- Fiscal
- Templates de comunicacao

### Endpoints publicos ou parcialmente publicos

Os pontos abaixo exigem revisao cuidadosa por exporem dados ou alterarem estado sem login convencional:

- `POST /auth/login`
- `GET /portal-cliente/:token`
- `GET /portal-cliente/:token/atendimentos/:atendimentoId/pdf`
- `POST /portal-cliente/:token/orcamentos/:orcamentoId/aprovar`
- `POST /portal-cliente/:token/orcamentos/:orcamentoId/reprovar`
- Swagger em `/api`
- Arquivos estaticos em `/uploads`

Tambem existem controllers operacionais onde alguns metodos de leitura nao aparecem protegidos diretamente no controller. Eles precisam ser revisados caso a protecao nao esteja sendo aplicada por outro mecanismo:

- Servicos
- Compatibilidade
- Consulta IMEI
- Termos de recebimento
- Condicoes de equipamento
- Componentes ausentes
- Midias de recebimento
- Recebimento de equipamento
- Produtos
- Estoque
- Garantias em alguns endpoints de leitura
- Ordens de servico em alguns endpoints de leitura
- Orcamentos em alguns endpoints de leitura
- Clientes em alguns endpoints de leitura

## Autenticacao

O backend usa um token proprio assinado com HMAC SHA-256.

Pontos positivos:

- Token possui expiracao.
- Assinatura usa comparacao segura com `timingSafeEqual`.
- Payload carrega usuario, empresa e perfil.

Pontos de atencao:

- Existe segredo padrao de desenvolvimento no codigo.
- Nao foi identificado refresh token.
- Nao foi identificado mecanismo de revogacao de sessao.
- Nao foi identificado rate limit no login.
- Nao foi identificado bloqueio progressivo por tentativas invalidas.

## Autorizacao e Permissoes

Existe um `PermissionGuard` baseado em evento de negocio e matriz de permissoes.

Pontos positivos:

- A permissao e centralizada por evento.
- Controllers sensiveis usam `AuthTokenGuard` e `PermissionGuard`.
- Perfis sao avaliados de forma centralizada.

Pontos de atencao:

- E preciso garantir que todos os endpoints de leitura sensivel tambem estejam protegidos.
- E preciso padronizar `@RequiredEvento` em todos os metodos que alteram dados.
- Deve existir teste automatizado para cada perfil critico.

## Multiempresa

O sistema possui `empresaId` em varios modelos e servicos.

Pontos positivos:

- Muitos servicos aplicam filtros por empresa.
- Existem validacoes de pertencimento em alguns fluxos.
- Portal do cliente valida cliente e empresa no token.

Pontos de atencao:

- Ainda existem consultas com `findById`, `find`, `findByIdAndUpdate` ou `findByIdAndDelete` sem filtro explicito por `empresaId`.
- Esse ponto e o maior risco de BOLA/IDOR em um ERP multiempresa.
- A regra precisa ser centralizada e testada.

## Validacao de Entrada

Pontos positivos:

- O backend usa `ValidationPipe` global com `transform` e `whitelist`.

Pontos de atencao:

- `forbidNonWhitelisted` esta como `false`, permitindo campos extras serem descartados silenciosamente.
- Nem todos os DTOs foram auditados nesta primeira passagem.
- ObjectIds precisam ser validados antes de consultas MongoDB.
- Rotas publicas precisam de DTOs especificos.

## Portal do Cliente

Pontos positivos:

- O portal usa token assinado e com expiracao.
- As buscas cruzam `clienteId` e `empresaId`.
- Aprovacao/reprovacao de orcamento valida status e validade.
- PDF do atendimento valida pertencimento ao cliente.

Pontos de atencao:

- Token publico fica na URL.
- Token contem payload codificado, nao criptografado.
- Nao ha indicio de revogacao individual de link.
- TTL atual do portal e de 30 dias.
- Nao foi identificado limite de tentativa para token invalido.
- Aprovacao de orcamento pelo link deve registrar trilha de auditoria clara.

## Uploads e Arquivos

Uploads identificados:

- Produtos
- Midias de recebimento
- Provas/anexos financeiros

Pontos positivos:

- Existem limites de tamanho em alguns uploads.
- Arquivos sao gravados em pastas especificas.

Pontos de atencao:

- Arquivos sao servidos publicamente por `/uploads`.
- Nem todos os uploads aparentam ter validacao forte de MIME/extensao.
- E preciso revisar nomes de arquivo, path traversal e tipos permitidos.
- Anexos financeiros podem conter informacao sensivel e devem ser protegidos.

## Logs e Auditoria

Pontos positivos:

- Existe modulo de auditoria.
- Alguns fluxos registram eventos de negocio.

Pontos de atencao:

- Existem `console.log` em controllers e services com DTOs e objetos de negocio.
- Arquivos de log locais foram encontrados na raiz do backend.
- Logs devem ser sanitizados para nao gravar senha, token, documento, telefone, payload completo ou dados financeiros sensiveis.

## Configuracao de Producao

Pontos de atencao principais:

- CORS esta com `origin: true`.
- Swagger esta habilitado diretamente em `/api`.
- Nao foi identificado Helmet.
- Nao foi identificado rate limit.
- Segredo padrao de token existe no codigo.
- `.env` existe no projeto e nao deve ser versionado nem exposto.

## Verificacoes Executadas

- Backend: `npm run build` executado com sucesso.
- Frontend: `npm run build` executado com sucesso.
- Frontend: bundle principal gerou aviso de tamanho acima de 500 kB.
- `npm audit` nao concluiu por erro local de certificado ao consultar o registry.

