# Implementacoes Realizadas - Seguranca e Qualidade

Data: 2026-08-14

## Resumo

Foram implementadas as fases principais do plano de seguranca com foco em protecao imediata do ERP, portal do cliente, uploads, logs, multiempresa e comportamento do frontend.

## Backend

### Fase 0 - Configuracao segura

- Adicionada validacao central de seguranca em `src/config/security.config.ts`.
- CORS deixou de aceitar qualquer origem automaticamente.
- Em producao, `CORS_ALLOWED_ORIGINS` passa a ser obrigatorio.
- Em producao, segredos de token passam a ser obrigatorios.
- Swagger passou a depender de ambiente/configuracao.
- Headers de seguranca adicionados:
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `Cross-Origin-Resource-Policy`
- `PORT` agora e lido da configuracao.

### Fase 1 - Login, sessao e rate limit

- Criado decorator `@Public()` para rotas publicas controladas.
- Criado decorator `@RateLimit()`.
- Criado guard `SimpleRateLimitGuard`.
- Login recebeu limite de tentativas.
- Portal publico recebeu limite de leitura, PDF e decisao de orcamento.
- Autenticacao por token passou a ser global no backend.

### Fase 2 - Multiempresa/BOLA

- Autenticacao global reduz rotas esquecidas sem guard.
- Clientes agora filtram listagem, detalhe, edicao e remocao por empresa.
- Produtos agora filtram listagem, detalhe, edicao e remocao por empresa.
- Servicos agora filtram listagem, detalhe, edicao e remocao por empresa.
- Recebimentos agora filtram listagem, detalhe, edicao e remocao por empresa.
- Criacao de produto, servico e recebimento respeita `empresaId` do usuario autenticado.
- Atualizacoes bloqueiam troca indevida de empresa.

### Fase 3 - Permissoes

- `AuthTokenGuard`, `PermissionGuard` e `SimpleRateLimitGuard` foram registrados como guards globais.
- Rotas publicas foram explicitamente marcadas.
- Rotas com `@RequireEvento` continuam usando matriz de permissoes.

### Fase 4 - Portal do cliente

- Criada entidade `PortalClienteSessao`.
- Novos links do portal passam a usar token aleatorio.
- O token puro nao e armazenado no banco; apenas hash com segredo.
- Sessao do portal possui:
  - cliente
  - empresa
  - usuario criador
  - expiracao
  - revogacao
  - ultimo acesso
  - contagem de acessos
- Criada rota autenticada para revogar sessao do portal.
- Abertura do portal, PDF e decisao de orcamento agora validam sessao revogavel.

### Fase 5 - Uploads

- Criado helper reutilizavel de seguranca de uploads.
- Bloqueio de nomes com path suspeito.
- Bloqueio de extensoes perigosas.
- Produtos aceitam apenas tipos de imagem esperados.
- Midias de recebimento aceitam apenas imagens/videos esperados.
- Anexos financeiros aceitam apenas tipos documentais/imagem esperados.

### Fase 6 - Logs

- Removidos logs de payload em:
  - compras
  - garantias
  - servicos
  - populacao de itens de venda
- Permanece apenas log simples de inicializacao da API.

## Frontend

### Fase 7 - Sessao e permissoes no navegador

- Interceptors agora sao configurados uma unica vez.
- Resposta `401` continua limpando sessao.
- Resposta `403` agora dispara evento especifico de permissao negada.
- AuthProvider escuta evento de permissao negada para permitir notificacao amigavel.

## Fase 8 - Validacao

Comandos executados:

- Backend: `npm run build` aprovado.
- Frontend: `npm run build` aprovado.

Observacoes:

- O frontend ainda mostra aviso de bundle acima de 500 kB. Nao bloqueia producao, mas fica como melhoria de performance.
- `npm audit` ficou pendente porque o ambiente local nao conseguiu validar o certificado do registry npm.

## Variaveis Recomendadas

Em producao:

- `NODE_ENV=production`
- `MONGO_URI`
- `AUTH_TOKEN_SECRET`
- `PORTAL_CLIENTE_SECRET`
- `CORS_ALLOWED_ORIGINS=https://dominio-do-front,https://dominio-do-portal`
- `SWAGGER_ENABLED=false`
- `VALIDATION_FORBID_NON_WHITELISTED=true` depois de homologar payloads das telas

