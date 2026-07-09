import { Injectable, Inject } from '@nestjs/common';
import { BiometricsGrpcService, BiometricMatchRequest } from '../../infrastructure/grpc/biometrics.contract';
import { StudentService } from '../../students/services/student.service';
import { HardwareService } from '../../hardware/services/hardware.service';
import { AbstractLoggerService } from '../../infrastructure/logger/logger.contract';

export interface CheckinResult {
  success: boolean;
  message: string;
}

export const BIOMETRICS_SERVICE_TOKEN = 'BiometricsGrpcServiceToken';
export const STUDENT_SERVICE_TOKEN = 'StudentServiceToken';
export const HARDWARE_SERVICE_TOKEN = 'HardwareServiceToken';
export const LOGGER_SERVICE_TOKEN = 'LoggerServiceToken';

/**
 * Service responsible for orchestrating the check-in process.
 * Follows Single Responsibility Principle (SRP) and Dependency Inversion Principle (DIP).
 */
@Injectable()
export class CheckinService {
  constructor(
    @Inject(BIOMETRICS_SERVICE_TOKEN)
    private readonly biometricsService: BiometricsGrpcService,

    @Inject(STUDENT_SERVICE_TOKEN)
    private readonly studentService: StudentService,

    @Inject(HARDWARE_SERVICE_TOKEN)
    private readonly hardwareService: HardwareService,

    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly logger: AbstractLoggerService,
  ) {}

  /**
   * Processes a check-in attempt using biometric data.
   *
   * @param request The biometric data payload from the totem.
   * @returns A result indicating success or failure with a descriptive message.
   */
  async processBiometricCheckin(request: BiometricMatchRequest): Promise<CheckinResult> {
    try {
      // 1. Validate Biometrics (via Python Microservice)
      const matchResult = await this.biometricsService.validateBiometrics(request);

      if (!matchResult.success || !matchResult.userId) {
        return { success: false, message: 'Usuário não reconhecido. Tente novamente.' };
      }

      const userId = matchResult.userId;

      // 2. Verify Student Plan and Status
      const studentStatus = await this.studentService.getStudentStatus(userId);

      if (!studentStatus.isActive) {
        return { success: false, message: 'Plano inativo. Procure a recepção.' };
      }

      // 3. Verify Schedule / Time allowance
      const isAllowedNow = await this.studentService.isCheckinAllowedAtCurrentTime(userId, studentStatus.planId);

      if (!isAllowedNow) {
        return { success: false, message: 'Check-in não permitido neste horário.' };
      }

      // 4. Trigger Hardware (Open Turnstile)
      const hardwareSuccess = await this.hardwareService.triggerTurnstile();

      if (!hardwareSuccess) {
        // Log hardware failure (logging abstraction could be injected here)
        return { success: false, message: 'Erro ao liberar catraca. Tente novamente ou procure a recepção.' };
      }

      // TODO: Log check-in event to Database/Redis asynchronously

      return { success: true, message: 'Acesso Liberado!' };

    } catch (error: any) {
      // Centralized error handling within the domain service.
      this.logger.error(`Check-in error: ${error.message}`, error.stack, 'CheckinService');
      return { success: false, message: 'Erro interno no servidor durante o check-in.' };
    }
  }
}
