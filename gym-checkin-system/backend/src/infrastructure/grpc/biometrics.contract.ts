// src/infrastructure/grpc/biometrics.contract.ts

export interface BiometricMatchRequest {
  /** Base64 da imagem ou Hash biométrico pré-processado */
  biometricData: string;
  /** Tipo de biometria sendo validada */
  type: 'FACE' | 'FINGERPRINT';
}

export interface BiometricMatchResponse {
  /** Verdadeiro se o match foi bem-sucedido */
  success: boolean;
  /** ID do aluno em caso de sucesso (UUID) */
  userId?: string;
  /** Nível de confiança do match (ex: 0.95) */
  confidenceScore?: number;
  /** Mensagem de erro caso success seja false */
  message?: string;
}

export interface BiometricsGrpcService {
  validateBiometrics(data: BiometricMatchRequest): Promise<BiometricMatchResponse>;
}