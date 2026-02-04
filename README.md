# Auto Wellhub Check-in 🏋️

Automação de check-ins do Wellhub (antigo Gympass) utilizando Node.js e TypeScript.

## 📋 Descrição

Este projeto automatiza o processo de check-in em academias e atividades do Wellhub, permitindo que você agende e execute check-ins de forma programática.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Axios** - Cliente HTTP para fazer requisições à API
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/juninmd/auto-wellhub-checkin.git
cd auto-wellhub-checkin
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais:
```env
WELLHUB_EMAIL=seu-email@example.com
WELLHUB_PASSWORD=sua-senha
```

## 🔧 Uso

### Desenvolvimento

Execute em modo de desenvolvimento (com ts-node):
```bash
npm run dev
```

### Produção

1. Compile o TypeScript:
```bash
npm run build
```

2. Execute a aplicação compilada:
```bash
npm start
```

## ⚙️ Configuração

O arquivo `.env` aceita as seguintes variáveis:

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `WELLHUB_EMAIL` | ✅ Sim | Seu email de acesso ao Wellhub |
| `WELLHUB_PASSWORD` | ✅ Sim | Sua senha de acesso ao Wellhub |
| `GYM_ID` | ❌ Não | ID da academia (se conhecido) |
| `ACTIVITY_ID` | ❌ Não | ID da atividade (se conhecido) |

### Comportamento Automático

Se `GYM_ID` e `ACTIVITY_ID` não forem fornecidos, o sistema irá:
1. Fazer login automaticamente
2. Buscar a primeira academia disponível
3. Buscar a primeira atividade disponível
4. Realizar o check-in

## 📁 Estrutura do Projeto

```
auto-wellhub-checkin/
├── src/
│   ├── config/          # Configurações e validação
│   │   └── index.ts
│   ├── services/        # Serviços de integração
│   │   └── WellhubService.ts
│   ├── types/           # Definições de tipos TypeScript
│   │   └── index.ts
│   └── index.ts         # Ponto de entrada da aplicação
├── dist/                # Código JavaScript compilado
├── .env.example         # Exemplo de variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
├── package.json        # Dependências e scripts
├── tsconfig.json       # Configuração do TypeScript
└── README.md           # Este arquivo
```

## 🛠️ Scripts Disponíveis

- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Executa a aplicação compilada
- `npm run dev` - Executa em modo de desenvolvimento
- `npm run watch` - Compila TypeScript em modo watch
- `npm run clean` - Remove arquivos compilados

## ⚠️ Observações Importantes

1. **API do Wellhub**: Este projeto contém uma implementação base. A API real do Wellhub pode requerer:
   - Endpoints específicos diferentes dos exemplos
   - Métodos de autenticação específicos (OAuth, JWT, etc.)
   - Headers customizados
   - Tratamento de rate limiting

2. **Segurança**: 
   - Nunca commite o arquivo `.env` com suas credenciais
   - Use variáveis de ambiente em ambientes de produção
   - Considere usar um gerenciador de secrets em produção

3. **Termos de Uso**: 
   - Verifique os termos de uso do Wellhub antes de usar automações
   - Use de forma responsável e ética

## 🔐 Segurança

- Todas as credenciais devem ser armazenadas em variáveis de ambiente
- O arquivo `.env` está no `.gitignore` para evitar commits acidentais
- Nunca compartilhe suas credenciais

## 📝 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Nota**: Este é um projeto educacional/pessoal. Use por sua conta e risco.