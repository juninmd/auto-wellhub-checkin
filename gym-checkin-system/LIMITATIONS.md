# Limitações do MVP (Minimum Viable Product)

A implementação atual constitui um scaffolding inicial para o MVP do sistema de check-in biométrico. Devido ao escopo reduzido, as seguintes limitações e suposições foram assumidas e deverão ser resolvidas em iterações futuras:

1. **Persistência de Dados (Banco de Dados):**
   - Os serviços atualmente dependem de mocks ou implementações em memória para os repositórios (por exemplo, `CheckinRepository` e `StudentService`).
   - É necessária a implementação de repositórios reais utilizando o TypeORM ou Prisma para conexão com o PostgreSQL e o Redis previstos na arquitetura.

2. **Integração com Hardware Real:**
   - O `HardwareService` implementa um mock que sempre retorna sucesso (`true`) para a abertura da catraca.
   - Deve-se implementar a comunicação real com as APIs/SDKs dos controladores de acesso físico (ex: TCP/IP, Serial ou MQTT).

3. **Integração com Microsserviço de Biometria:**
   - Embora o contrato gRPC esteja definido em `biometrics.contract.ts` e `biometrics.proto`, falta o setup de um cliente gRPC (via pacote `@grpc/grpc-js` e `@nestjs/microservices`) funcional que efetue chamadas reais para o serviço Python, o qual no momento não está em execução. O NestJS necessita de um ClientGrpc configurado.

4. **Tratamento de LGPD (Banco de Dados):**
   - A especificação prevê não armazenar fotos nominais. Quando os repositórios reais forem implementados, deverá ser adicionada criptografia *at rest* para os hashes/embeddings no banco de dados.

5. **Tratamento de Rate Limiting e Anti-Passback:**
   - O documento arquitetural cita o uso do Redis para gerenciar o "anti-passback" (impedir que o mesmo aluno entre duas vezes seguidas) e rate limiting. Estas regras de negócio ainda não estão codificadas no backend em NestJS.

6. **Validação de Inputs:**
   - A validação de DTOs utiliza `class-validator`, mas o `ValidationPipe` global precisa ser ativado no `main.ts` para que essas regras sejam efetivas nos controllers durante tempo de execução.
