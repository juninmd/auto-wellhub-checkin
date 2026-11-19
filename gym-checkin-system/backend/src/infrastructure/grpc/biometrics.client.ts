import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';
import { BiometricsGrpcService, BiometricMatchRequest, BiometricMatchResponse } from './biometrics.contract';

/** A hung biometric service must not hold the turnstile request open forever. */
export const IDENTIFY_TIMEOUT_MS = 5000;

interface IdentifyRequest {
  biometricBase64: string; // The @grpc/proto-loader automatically maps snake_case to camelCase
}

interface IdentifyResponse {
  studentId: string;
  confidenceScore: number;
  success: boolean;
  errorMessage: string;
}

interface BiometricServiceGrpc {
  identify(request: IdentifyRequest): Observable<IdentifyResponse>;
}

@Injectable()
export class BiometricsClientService implements OnModuleInit, BiometricsGrpcService {
  private biometricService: BiometricServiceGrpc;

  constructor(@Inject('BIOMETRICS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.biometricService = this.client.getService<BiometricServiceGrpc>('BiometricService');
  }

  async validateBiometrics(data: BiometricMatchRequest): Promise<BiometricMatchResponse> {
    const identifyRequest: IdentifyRequest = {
      biometricBase64: data.biometricData,
    };

    try {
      const response = await firstValueFrom(
        this.biometricService.identify(identifyRequest).pipe(timeout(IDENTIFY_TIMEOUT_MS)),
      );

      return {
        success: response.success,
        userId: response.studentId,
        confidenceScore: response.confidenceScore,
        message: response.errorMessage,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error communicating with biometric service',
      };
    }
  }
}
