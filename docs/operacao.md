# Operacao do Mantec 3.0

Este guia resume o necessario para preparar, validar e operar o Mantec 3.0 em homologacao ou producao.

## Ambientes

- Backend: NestJS com MongoDB, publicado pela imagem Docker do projeto.
- Frontend: React/Vite servido por Nginx, apontando para a API via `VITE_API_BASE_URL`.
- Banco: MongoDB acessado por `MONGO_URI`.
- Arquivos: uploads privados devem ser servidos somente pelas rotas autenticadas da API.

## Variaveis obrigatorias

Backend:

- `MONGO_URI`: conexao do MongoDB.
- `AUTH_TOKEN_SECRET` ou `JWT_SECRET`: assinatura dos tokens de sessao.
- `PORTAL_CLIENTE_SECRET`: assinatura dos tokens publicos do portal.
- `CORS_ALLOWED_ORIGINS`: origens liberadas em producao, separadas por virgula.
- `TRUST_PROXY`: configurar quando a API estiver atras de proxy ou balanceador.
- `SWAGGER_ENABLED`: em producao, usar `true` apenas temporariamente e com acesso controlado.

Frontend:

- `VITE_API_BASE_URL`: URL publica da API.

## Validacao antes de publicar

Backend:

```bash
npm run ci:check
npm run migrate:indexes
```

Frontend:

```bash
npm run ci:check
```

O deploy deve acontecer somente depois de typecheck, lint, testes e build passarem.

## Saude e diagnostico

Endpoints publicos de saude:

- `GET /health/live`: confirma que a aplicacao esta respondendo.
- `GET /health/ready`: confirma se a aplicacao esta pronta e conectada ao banco.

Toda resposta da API inclui `X-Request-Id`. Quando um usuario reportar erro, registrar esse codigo junto com horario, tela e acao executada.

## Permissoes

O backend e a fonte de verdade da matriz de eventos e permissoes de interface.

- `GET /permissoes/me`: retorna as permissoes da sessao autenticada.
- `GET /permissoes/matriz`: retorna a matriz completa para perfis autorizados a consultar usuarios.

O frontend pode ocultar menus e botoes por UX, mas qualquer acao sensivel deve continuar protegida pelo backend.

## Checklist de resposta a incidente

1. Confirmar se `/health/live` responde.
2. Confirmar se `/health/ready` retorna banco conectado.
3. Coletar `X-Request-Id`, usuario, empresa, horario e rota afetada.
4. Verificar logs da API pelo mesmo horario e request id.
5. Validar se o erro e permissao, dado ausente, indisponibilidade do banco ou regressao de deploy.
6. Se for regressao, interromper novo deploy e acionar rollback da imagem anterior.

## Rotina operacional

- Executar backup antes de migracoes e deploys relevantes.
- Revisar variaveis de ambiente a cada troca de dominio, proxy ou certificado.
- Validar CORS e Swagger em producao apos cada alteracao de infraestrutura.
- Manter imagens Docker sem `.env`, credenciais locais, uploads e logs.
- Homologar os fluxos principais por perfil antes de liberar novos clientes.
