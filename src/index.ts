import { config, validateConfig } from './config';
import { WellhubService } from './services/WellhubService';

/**
 * Aplicação principal de automação de check-in do Wellhub
 */
async function main() {
  console.log('🚀 Auto Wellhub Check-in');
  console.log('========================\n');

  // Validar configuração
  if (!validateConfig()) {
    console.error('\n📝 Configure as variáveis de ambiente no arquivo .env');
    console.error('Veja o arquivo .env.example para referência\n');
    process.exit(1);
  }

  // Criar serviço
  const wellhubService = new WellhubService(config);

  // Realizar check-in automático
  console.log('🔄 Iniciando processo de check-in automático...\n');
  
  const result = await wellhubService.autoCheckIn();

  console.log('\n========================');
  if (result.success) {
    console.log('✅ Status: Sucesso');
    console.log(`📝 ${result.message}`);
    if (result.data) {
      console.log('📊 Detalhes:', JSON.stringify(result.data, null, 2));
    }
    process.exit(0);
  } else {
    console.log('❌ Status: Falha');
    console.log(`📝 ${result.message}`);
    process.exit(1);
  }
}

// Executar aplicação
main().catch((error) => {
  console.error('\n💥 Erro fatal:', error);
  process.exit(1);
});
