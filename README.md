# Wellhub Check-in para Academias

Backend (NestJS) para **academias parceiras do Wellhub** validarem o acesso de alunos na catraca/totem.
O aluno faz o check-in no app Wellhub; o sistema confirma na [Access Control API](https://developers.wellhub.com/product/access-control-api/1.0/endpoints) e só então libera o acesso.

## Fluxo

1. Aluno faz check-in no app Wellhub (validade de ~20 min).
2. Aluno se identifica no totem (face ou digital).
3. O backend aplica as regras da academia (plano ativo, horário).
4. Se o aluno tem `gympassId`, chama `POST /access/v1/validate`. Sem check-in ativo, o acesso é negado.
5. Aprovado: abre a catraca e registra o histórico.

Alunos sem `gympassId` (planos próprios) pulam a etapa 4.
Se a API do Wellhub falhar (rede, timeout, 401/403, 5xx), o acesso **falha fechado**: a catraca não abre.

## Pré-requisitos

- Node.js 20+
- Cadastro como parceiro no Wellhub Partner Portal (token da API e Gym ID)
- Acesso ao sandbox para testes

## Configuração e uso

```bash
cd gym-checkin-system/backend
npm install
cp .env.example .env   # preencher WELLHUB_API_TOKEN e WELLHUB_GYM_ID
npm run start:dev
npm test
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `WELLHUB_API_TOKEN` | Sim | Bearer token emitido pelo Wellhub |
| `WELLHUB_GYM_ID` | Sim | Enviado no header `X-Gym-Id` |
| `WELLHUB_BASE_URL` | Não | Padrão: sandbox. Produção: `https://api.partners.gympass.com/access/v1` |
| `WELLHUB_TIMEOUT_MS` | Não | Padrão: 5000 |

O backend não sobe sem `WELLHUB_API_TOKEN` e `WELLHUB_GYM_ID`.

## Cadastro de aluno com Wellhub

`POST /students` aceita o campo opcional `gympassId` (13 dígitos).

## Documentação

- [Arquitetura](gym-checkin-system/ARCHITECTURE.md)
- [Limitações](LIMITATIONS.md)
- [Diretrizes para agentes](AGENTS.md)
