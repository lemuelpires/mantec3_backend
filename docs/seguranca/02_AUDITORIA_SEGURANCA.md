# Auditoria de Seguranca - Mantec ERP

Data da auditoria inicial: 2026-08-14

## Escopo

Auditoria inicial aplicada aos projetos FrontMantec2.0 e MantecBack3.0, com foco em:

- Autenticacao
- Autorizacao
- Isolamento multiempresa
- Portal publico do cliente
- Validacao de entrada
- Uploads e arquivos
- Logs e auditoria
- Configuracao de producao
- Qualidade de frontend relacionada a seguranca

## Achados Criticos e Altos

### SEC-001 - CORS aberto em producao

Severidade: Alta

O backend esta configurado com `origin: true`, aceitando requisicoes de qualquer origem.

Risco:

- Aumenta a superficie de abuso da API.
- Facilita integracoes indesejadas com o token do usuario caso haja XSS ou vazamento de credencial.

Recomendacao:

- Criar lista explicita de origens permitidas por ambiente.
- Em producao, permitir apenas dominios oficiais do ERP e portal.
- Registrar tentativa de origem bloqueada.

### SEC-002 - Segredo padrao de token no codigo

Severidade: Alta

A autenticacao e o portal do cliente possuem fallback para segredo local de desenvolvimento.

Risco:

- Se variaveis de ambiente falharem em producao, tokens podem ficar assinados por segredo conhecido.
- Facilita falsificacao de token em ambiente mal configurado.

Recomendacao:

- Remover fallback inseguro em producao.
- Falhar a inicializacao quando `AUTH_TOKEN_SECRET`, `JWT_SECRET` ou `PORTAL_CLIENTE_SECRET` nao estiverem configurados.
- Separar segredo de usuario interno e portal publico.

### SEC-003 - Falta de rate limit no login e rotas publicas

Severidade: Alta

Nao foi identificado uso de `@nestjs/throttler`, rate limiter ou bloqueio progressivo.

Risco:

- Tentativas automatizadas de senha.
- Abuso de tokens publicos do portal.
- Sobrecarga de endpoints de PDF e aprovacao.

Recomendacao:

- Implementar rate limit global.
- Criar limites especificos para login e portal do cliente.
- Registrar tentativas bloqueadas.

### SEC-004 - Possivel exposicao BOLA/IDOR por consultas sem escopo de empresa

Severidade: Alta

Foram encontradas consultas com `findById`, `find`, `findByIdAndUpdate` e `findByIdAndDelete` em modulos sensiveis. Muitos servicos ja fazem escopo por empresa, mas o padrao ainda nao esta uniforme.

Risco:

- Usuario de uma empresa acessar, alterar ou excluir dados de outra empresa conhecendo um ID.

Recomendacao:

- Criar helper obrigatorio de tenant scope.
- Trocar consultas diretas por consultas com `empresaId`.
- Adicionar testes automatizados de isolamento entre empresas.

### SEC-005 - Swagger exposto sem restricao aparente

Severidade: Media/Alta

Swagger esta configurado diretamente em `/api`.

Risco:

- Mapeamento publico de endpoints.
- Facilita reconhecimento da API por terceiros.

Recomendacao:

- Habilitar Swagger apenas em desenvolvimento/homologacao.
- Ou proteger Swagger por autenticacao administrativa.

### SEC-006 - Token do portal do cliente em URL com longa duracao

Severidade: Media/Alta

O portal usa token assinado na URL com TTL de 30 dias.

Risco:

- Link pode ser compartilhado, salvo no historico, logs de navegador ou ferramentas de terceiros.
- Nao foi identificado mecanismo de revogacao individual.

Recomendacao:

- Persistir sessoes de portal no banco com hash do token.
- Permitir revogar link.
- Reduzir validade padrao ou separar validade por tipo de atendimento.
- Registrar ultimo acesso, IP aproximado e user-agent.

### SEC-007 - Uploads publicos em `/uploads`

Severidade: Media/Alta

Arquivos de produtos, recebimentos e financeiro sao servidos por pasta publica.

Risco:

- Exposicao direta de imagens, comprovantes e anexos.
- Possivel acesso a documento sensivel sem autorizacao.

Recomendacao:

- Separar uploads publicos e privados.
- Servir anexos sensiveis via controller autenticado.
- Validar MIME, extensao e tamanho por tipo.
- Sanitizar nomes e bloquear paths inesperados.

### SEC-008 - Logs com dados de payload operacional

Severidade: Media

Existem `console.log` e `console.warn` em varios controllers/services, incluindo compras, garantias e servicos.

Risco:

- Vazamento de dados pessoais, comerciais ou financeiros em log.
- Dificuldade de auditoria profissional.

Recomendacao:

- Substituir logs soltos por logger central com mascaramento.
- Remover logs de DTO completo.
- Criar politica de campos proibidos em log.

### SEC-009 - Token do frontend salvo em localStorage

Severidade: Media

O frontend guarda token e dados do usuario em `localStorage`.

Risco:

- Caso haja XSS, token pode ser extraido.

Recomendacao:

- Curto prazo: reforcar protecoes contra XSS, sanitizacao e CSP.
- Medio prazo: avaliar cookie HttpOnly/SameSite para sessao.
- Implementar expiracao visual e limpeza ao receber 401.

### SEC-010 - Validacao permissiva de campos extras

Severidade: Media

O `ValidationPipe` usa `whitelist: true`, mas `forbidNonWhitelisted: false`.

Risco:

- Campos inesperados sao descartados silenciosamente.
- Pode ocultar erro de integracao e dificultar diagnostico.

Recomendacao:

- Em homologacao, ativar `forbidNonWhitelisted: true`.
- Corrigir DTOs e telas que enviam campos desnecessarios.
- Depois promover para producao.

## Achados Positivos

- Backend e frontend compilam.
- Existe `ValidationPipe` global.
- Existe guard de autenticacao proprio.
- Existe guard de permissao por evento.
- Varios servicos ja filtram por `empresaId`.
- Portal do cliente valida cliente e empresa ao montar dados.
- Aprovacao/reprovacao de orcamento pelo portal valida status.
- Existe modulo de auditoria.
- Existem PDFs e documentos centralizados.

## Areas Que Precisam de Auditoria Mais Profunda

- Todos os DTOs de criacao e atualizacao.
- Todos os endpoints sem `@UseGuards` no metodo ou classe.
- Todas as consultas Mongo sem `empresaId`.
- Todos os uploads e downloads.
- Politica real de variaveis de ambiente em producao.
- Permissoes por perfil, tela e evento.
- Sanitizacao de textos exibidos no portal.
- Headers HTTP de seguranca.
- Auditoria de dependencias quando o `npm audit` voltar a funcionar.

