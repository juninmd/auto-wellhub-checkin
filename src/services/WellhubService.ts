import axios, { AxiosInstance } from 'axios';
import { WellhubConfig, CheckInResponse, Activity, Gym } from '../types';

/**
 * Serviço para interagir com a API do Wellhub (antigo Gympass)
 * 
 * Nota: Esta é uma implementação base. A API real do Wellhub pode requerer:
 * - Tokens de autenticação específicos
 * - Headers customizados
 * - Endpoints diferentes
 * 
 * Você precisará ajustar os endpoints e a lógica de autenticação
 * de acordo com a API real do Wellhub.
 */
export class WellhubService {
  private client: AxiosInstance;
  private authToken?: string;
  private config: WellhubConfig;

  constructor(config: WellhubConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: 'https://api.wellhub.com', // URL base fictícia - ajustar para a API real
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AutoWellhubCheckIn/1.0',
      },
    });
  }

  /**
   * Realiza login na plataforma Wellhub
   */
  async login(): Promise<boolean> {
    try {
      console.log('🔐 Realizando login...');
      
      // Este é um exemplo de endpoint de login
      // Ajuste conforme a API real do Wellhub
      const response = await this.client.post('/auth/login', {
        email: this.config.email,
        password: this.config.password,
      });

      if (response.data && response.data.token) {
        this.authToken = response.data.token;
        this.client.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
        console.log('✅ Login realizado com sucesso!');
        return true;
      }

      console.log('⚠️  Login falhou - sem token retornado');
      return false;
    } catch (error) {
      console.error('❌ Erro no login:', this.getErrorMessage(error));
      return false;
    }
  }

  /**
   * Lista academias disponíveis
   */
  async listGyms(): Promise<Gym[]> {
    try {
      console.log('🏋️  Buscando academias...');
      
      const response = await this.client.get('/gyms');
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ ${response.data.length} academia(s) encontrada(s)`);
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('❌ Erro ao listar academias:', this.getErrorMessage(error));
      return [];
    }
  }

  /**
   * Lista atividades disponíveis para uma academia
   */
  async listActivities(gymId: string): Promise<Activity[]> {
    try {
      console.log(`📅 Buscando atividades para academia ${gymId}...`);
      
      const response = await this.client.get(`/gyms/${gymId}/activities`);
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ ${response.data.length} atividade(s) encontrada(s)`);
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('❌ Erro ao listar atividades:', this.getErrorMessage(error));
      return [];
    }
  }

  /**
   * Realiza check-in em uma atividade
   */
  async checkIn(activityId?: string): Promise<CheckInResponse> {
    try {
      const targetActivityId = activityId || this.config.activityId;
      
      if (!targetActivityId) {
        return {
          success: false,
          message: 'ID da atividade não fornecido',
        };
      }

      console.log(`⏳ Realizando check-in na atividade ${targetActivityId}...`);
      
      const response = await this.client.post('/check-in', {
        activityId: targetActivityId,
        timestamp: new Date().toISOString(),
      });

      if (response.data && response.data.success) {
        console.log('🎉 Check-in realizado com sucesso!');
        return {
          success: true,
          message: 'Check-in realizado com sucesso',
          data: response.data,
        };
      }

      return {
        success: false,
        message: 'Falha ao realizar check-in',
        data: response.data,
      };
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      console.error('❌ Erro no check-in:', errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Realiza check-in automático
   * Busca a primeira atividade disponível e faz o check-in
   */
  async autoCheckIn(): Promise<CheckInResponse> {
    try {
      // Login
      const loginSuccess = await this.login();
      if (!loginSuccess) {
        return {
          success: false,
          message: 'Falha no login',
        };
      }

      // Se já temos um activity ID configurado, usar ele
      if (this.config.activityId) {
        return await this.checkIn(this.config.activityId);
      }

      // Se temos um gym ID, buscar atividades dessa academia
      if (this.config.gymId) {
        const activities = await this.listActivities(this.config.gymId);
        
        if (activities.length === 0) {
          return {
            success: false,
            message: 'Nenhuma atividade disponível',
          };
        }

        // Usar a primeira atividade disponível
        return await this.checkIn(activities[0].id);
      }

      // Se não temos nem gym nem activity ID, buscar a primeira academia
      const gyms = await this.listGyms();
      
      if (gyms.length === 0) {
        return {
          success: false,
          message: 'Nenhuma academia disponível',
        };
      }

      const activities = await this.listActivities(gyms[0].id);
      
      if (activities.length === 0) {
        return {
          success: false,
          message: 'Nenhuma atividade disponível',
        };
      }

      return await this.checkIn(activities[0].id);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      console.error('❌ Erro no check-in automático:', errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Extrai mensagem de erro
   */
  private getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.data?.message || error.response.statusText || 'Erro desconhecido';
      }
      if (error.request) {
        return 'Sem resposta do servidor';
      }
    }
    return error instanceof Error ? error.message : 'Erro desconhecido';
  }
}
