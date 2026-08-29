# Relatorio de Riscos - Mantec ERP

Data da auditoria inicial: 2026-08-14

## Matriz Resumida

| ID | Risco | Severidade | Probabilidade | Impacto |
| --- | --- | --- | --- | --- |
| SEC-001 | CORS aberto | Alta | Alta | Alto |
| SEC-002 | Segredo padrao de token | Alta | Media | Alto |
| SEC-003 | Ausencia de rate limit | Alta | Alta | Alto |
| SEC-004 | BOLA/IDOR multiempresa | Alta | Media | Critico |
| SEC-005 | Swagger exposto | Media/Alta | Media | Medio |
| SEC-006 | Link publico do portal sem revogacao | Media/Alta | Alta | Alto |
| SEC-007 | Uploads sensiveis publicos | Media/Alta | Media | Alto |
| SEC-008 | Logs com dados operacionais | Media | Alta | Medio |
| SEC-009 | Token no localStorage | Media | Media | Alto |
| SEC-010 | Campos extras aceitos silenciosamente | Media | Media | Medio |

## Riscos por Fluxo

### Login e sessao interna

Riscos:

- Forca bruta de senha.
- Fallback para segredo inseguro.
- Falta de revogacao de sessao.
- Token exposto se houver XSS no frontend.

Impacto:

- Acesso indevido ao ERP.
- Acesso a dados de clientes, financeiro, estoque e ordens de servico.

### Portal do cliente

Riscos:

- Link publico compartilhado indevidamente.
- Token longo em URL.
- Falta de revogacao de link.
- Falta de limite de tentativa.
- PDF de atendimento acessivel por token enquanto valido.

Impacto:

- Cliente ou terceiro com link visualiza dados de atendimentos.
- Orcamento pode ser aprovado/reprovado por quem possuir o link.

### Multiempresa

Riscos:

- Endpoints usando ID direto sem validar `empresaId`.
- Consultas de listagem sem escopo.
- Atualizacao/exclusao por ID sem pertencimento.

Impacto:

- Vazamento ou alteracao de dados entre empresas.
- Risco alto para operacao SaaS/multiempresa.

### Uploads e anexos

Riscos:

- Arquivos publicos sem autenticacao.
- Comprovantes financeiros expostos.
- Arquivos potencialmente perigosos se MIME/extensao nao forem bloqueados.

Impacto:

- Vazamento de comprovantes, fotos de equipamentos e anexos.
- Risco reputacional e operacional.

### Logs

Riscos:

- Payloads completos em logs.
- Dados pessoais e comerciais em arquivos locais.
- Tokens e IDs sensiveis registrados por engano.

Impacto:

- Exposicao de dados em servidor, backups ou ferramentas de observabilidade.

## Ordem de Tratamento Recomendada

1. Remover riscos de configuracao de producao.
2. Proteger login e rotas publicas com rate limit.
3. Blindar multiempresa contra BOLA/IDOR.
4. Fortalecer portal do cliente.
5. Proteger uploads e documentos sensiveis.
6. Sanitizar logs e padronizar auditoria.
7. Endurecer frontend contra XSS e vazamento de token.
8. Criar testes automatizados de seguranca.

## Criterios de Aceite

- Nenhuma rota sensivel sem autenticacao.
- Nenhuma leitura/alteracao por ID sem validar empresa.
- Login com rate limit e resposta generica.
- Portal com sessao revogavel.
- Swagger protegido ou desabilitado em producao.
- Upload sensivel servido apenas por rota autenticada.
- Logs sem payload sensivel.
- Build e testes passando.
- Checklist final de seguranca preenchido.

