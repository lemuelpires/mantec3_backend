# Checklist Final - Seguranca e Qualidade

Data: 2026-08-14

## Validacao Tecnica

- [x] Backend compila.
- [x] Frontend compila.
- [x] Autenticacao global aplicada no backend.
- [x] Login marcado como rota publica controlada.
- [x] Portal do cliente marcado como rota publica controlada.
- [x] Rate limit aplicado em login.
- [x] Rate limit aplicado em portal do cliente.
- [x] CORS deixou de usar `origin: true`.
- [x] Segredos obrigatorios em producao.
- [x] Swagger condicionado por ambiente.
- [x] Headers de seguranca adicionados.
- [x] Logs de payload operacional removidos dos pontos mais sensiveis.
- [x] Uploads com MIME allowlist.
- [x] Uploads bloqueiam nomes suspeitos e extensoes perigosas.
- [x] Portal do cliente usa sessao revogavel.
- [x] Token puro do portal nao e salvo no banco.
- [x] Frontend limpa sessao em `401`.
- [x] Frontend sinaliza permissao negada em `403`.

## Homologacao Obrigatoria

- [ ] Login com usuario valido.
- [ ] Login com senha invalida repetida ate acionar limite.
- [ ] Listagem de clientes com usuario da empresa A.
- [ ] Tentativa de acessar cliente de empresa B por ID.
- [ ] Listagem de produtos por empresa.
- [ ] Tentativa de editar produto de outra empresa.
- [ ] Listagem de servicos por empresa.
- [ ] Tentativa de editar servico de outra empresa.
- [ ] Cadastro de recebimento usando usuario autenticado.
- [ ] Tentativa de consultar recebimento de outra empresa.
- [ ] Gerar link do portal para cliente.
- [ ] Abrir link do portal.
- [ ] Aprovar orcamento pelo portal.
- [ ] Revogar sessao do portal.
- [ ] Confirmar que link revogado nao abre.
- [ ] Upload de imagem valida de produto.
- [ ] Upload de arquivo invalido em produto.
- [ ] Upload de midia valida de recebimento.
- [ ] Upload de arquivo invalido em recebimento.
- [ ] Upload de PDF valido em anexo financeiro.
- [ ] Upload de executavel/script bloqueado em anexo financeiro.
- [ ] Verificar Swagger em ambiente de producao.
- [ ] Verificar CORS usando dominio oficial.
- [ ] Verificar CORS usando origem nao permitida.

## Pendencias Controladas

- [ ] Executar `npm audit` apos corrigir certificado local do registry.
- [ ] Avaliar code splitting do frontend para reduzir bundle principal.
- [ ] Ampliar testes automatizados multiempresa para todos os modulos.
- [ ] Avaliar migração futura de token em `localStorage` para cookie HttpOnly/SameSite.
- [ ] Avaliar protecao autenticada para arquivos sensiveis hoje servidos por `/uploads`.

