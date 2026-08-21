// src/checkin/services/process-checkin.service.ts

import { Injectable, Inject, UnauthorizedException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { BiometricsGrpcService } from '../../infrastructure/grpc/biometrics.contract';
import { CheckinRequestDto } from '../dto/checkin.dto';
import { ICheckinRepository } from '../interfaces/checkin-repository.interface';
import { IHardwareService } from '../../infrastructure/hardware/hardware.interface';
import { StudentService } from '../../students/services/student.service';
import { AbstractLoggerService } from '../../infrastructure/logger/logger.contract';

@Injectable()
export class ProcessCheckinService {
  constructor(
    @Inject('BiometricsGrpcService')
    private readonly biometricsService: BiometricsGrpcService,
    private readonly studentService: StudentService,
    @Inject(IHardwareService)
    private readonly hardwareService: IHardwareService,
    @Inject(ICheckinRepository)
    private readonly checkinRepository: ICheckinRepository,
    @Inject('LoggerService')
    private readonly logger: AbstractLoggerService,
  ) {}

  async execute(dto: CheckinRequestDto): Promise<{ message: string; userId: string }> {
    this.logger.log(`Iniciando check-in via ${dto.type}`, 'ProcessCheckinService');

    // 1. Validação Biológica via gRPC
    const matchResponse = await this.biometricsService.validateBiometrics({
      biometricData: dto.biometricData,
      type: dto.type,
    });

    if (!matchResponse.success || !matchResponse.userId) {
      this.logger.warn('Falha no reconhecimento', 'ProcessCheckinService');
      throw new UnauthorizedException('Usuário não reconhecido. Tente novamente.');
    }

    const userId = matchResponse.userId;

    try {
      // 2. Validação de Regras de Negócio
      const studentStatus = await this.studentService.getStudentStatus(userId);
      if (!studentStatus.isActive) {
        await this.logFailedCheckin(userId, 'Plano inativo');
        throw new ForbiddenException('Acesso Negado: Plano inativo.');
      }

      const isTimeAllowed = await this.studentService.isCheckinAllowedAtCurrentTime(userId, studentStatus.planId);
      if (!isTimeAllowed) {
        await this.logFailedCheckin(userId, 'Horário não permitido');
        throw new ForbiddenException('Acesso Negado: Horário não permitido para este plano.');
      }

      // 3. Liberação Física
      const isTurnstileOpened = await this.hardwareService.openTurnstile();
      if (!isTurnstileOpened) {
        throw new InternalServerErrorException('Falha de comunicação com a catraca.');
      }

      // 4. Registro de Histórico
      await this.checkinRepository.logCheckin({
        studentId: userId,
        timestamp: new Date(),
        status: 'SUCCESS',
      });

      this.logger.log(`Check-in liberado: ${userId}`, 'ProcessCheckinService');

      return {
        message: 'Acesso Liberado',
        userId: userId,
      };

    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`Erro interno: ${userId}`, error.stack, 'ProcessCheckinService');
      throw new InternalServerErrorException('Erro ao processar check-in.');
    }
  }

  private async logFailedCheckin(userId: string, reason: string): Promise<void> {
    await this.checkinRepository.logCheckin({
      studentId: userId,
      timestamp: new Date(),
      status: 'FAILED',
      reason,
    }).catch(e => this.logger.error(`Erro ao logar falha para ${userId}`, e.stack, 'ProcessCheckinService'));
  }
}