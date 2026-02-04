# Contribuindo para Auto Wellhub Check-in

Obrigado por considerar contribuir para este projeto! 🎉

## Como Contribuir

### Reportando Bugs

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/juninmd/auto-wellhub-checkin/issues)
2. Abra uma nova issue incluindo:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs. atual
   - Versão do Node.js e sistema operacional

### Sugerindo Melhorias

1. Abra uma issue com a tag `enhancement`
2. Descreva a melhoria sugerida
3. Explique por que seria útil

### Pull Requests

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para todo código novo
- Siga o estilo de código existente
- Adicione comentários quando necessário
- Teste suas mudanças antes de submeter

## Configuração de Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/juninmd/auto-wellhub-checkin.git
cd auto-wellhub-checkin

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Execute em modo de desenvolvimento
npm run dev
```

## Estrutura do Projeto

- `src/config/` - Configurações
- `src/services/` - Lógica de integração com API
- `src/types/` - Definições TypeScript
- `src/index.ts` - Ponto de entrada

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a licença MIT.
