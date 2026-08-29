# Qualidade e CI/CD

Este projeto usa gates de qualidade antes do deploy.

## Backend

Workflow: `.github/workflows/deploy.yml`

O job `quality` roda antes do deploy:

- `npm ci`
- `npm run typecheck`
- `npm run lint:check`
- `npm test -- --runInBand`
- `npm run test:e2e -- --runInBand`
- `npm run build`

O deploy para Docker Swarm só roda em `push` para `master` e depende do job `quality`.
Pull requests para `master` rodam apenas as validações.

### Lint incremental

O lint completo legado ainda tem muita dívida de formatação e regras de tipagem insegura. Para tornar o CI útil agora, o comando `npm run lint:check` usa `eslint.ci.config.mjs`, que bloqueia erros novos e mantém avisos visíveis.

O comando `npm run lint` continua disponível para correção local com `--fix`.

## Frontend

Workflow: `FrontEnd/FrontMantec2.0/.github/workflows/main.yml`

O job `quality` roda antes do deploy:

- `npm ci`
- `npm run lint`
- `npm run build`

O deploy para Docker Swarm só roda em `push` para `main` e depende do job `quality`.
Pull requests para `main` rodam apenas as validações.

## Política

- Falha de typecheck, lint de CI, testes ou build bloqueia deploy.
- Avisos conhecidos do lint backend devem ser reduzidos de forma incremental.
- Auditoria de dependências deve ser habilitada como gate depois que o ambiente de certificados estiver confiável.
