# Limitações do Sistema (MVP)

A atual implementação do sistema baseia-se em um MVP (Produto Mínimo Viável) e possui as seguintes limitações técnicas que devem ser tratadas em futuras iterações:

1. **Persistência de Dados (Em Memória):**
   - O projeto atualmente utiliza _mocks_ e repositórios em memória.
   - **Próximos Passos:** Implementar persistência real utilizando PostgreSQL para dados relacionais e Redis para cache/filas, integrando um ORM robusto como TypeORM ou Prisma.

2. **Integração Real com Hardware (Catraca):**
   - O serviço de controle de acesso (`HardwareService`) simula o pulso de abertura (retornando sempre verdadeiro).
   - **Próximos Passos:** Implementar a integração física (via GPIO, Serial ou rede local TCP/UDP) dependendo do hardware adotado no estabelecimento.

3. **Integração do Microsserviço de Biometria (Python):**
   - O código foca na estrutura arquitetural principal em NestJS, e o microsserviço Python ainda é teórico/esperado na arquitetura via contrato gRPC.
   - **Próximos Passos:** Desenvolver o microsserviço de validação em Python e integrá-lo plenamente na porta configurada via protocolo gRPC.

4. **Tratamento Específico LGPD (Armazenamento):**
   - Embora o contrato estabeleça a transição de vetores (hashes), os bancos de dados não estão configurados.
   - **Próximos Passos:** Adicionar criptografia robusta (ex: chaves KMS) e/ou um banco de dados vetorial para assegurar anonimidade total de hashes biométricos no armazenamento.
