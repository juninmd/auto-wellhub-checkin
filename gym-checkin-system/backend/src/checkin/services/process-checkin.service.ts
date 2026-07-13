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
    @Inject('StudentService')
    private readonly studentService: StudentService,
    @Inject(IHardwareService)
    private readonly hardwareService: IHardwareService,
    @Inject(ICheckinRepository)
    private readonly checkinRepository: ICheckinRepository,
    @Inject('LoggerService')
    private readonly logger: AbstractLoggerService,
  ) {}

  /**
   * Processa o fluxo completo de check-in, orquestrando as validações de
   * biometria, regras de negócio e liberação do hardware.
   *
   * @param dto Dados da requisição de check-in (biometria)
   * @returns Confirmação de acesso liberado
   */
  async execute(dto: CheckinRequestDto): Promise<{ message: string; userId: string }> {
    this.logger.log(`Iniciando processo de check-in via ${dto.type}`, 'ProcessCheckinService');

    // 1. Validar Biometria via gRPC (Microsserviço Python)
    const matchResponse = await this.biometricsService.validateBiometrics({
      biometricData: dto.biometricData,
      type: dto.type,
    });

    if (!matchResponse.success || !matchResponse.userId) {
      this.logger.warn('Falha no reconhecimento biométrico', 'ProcessCheckinService');
      throw new UnauthorizedException('Usuário não reconhecido, tente novamente');
    }

    const userId = matchResponse.userId;

    try {
      // 2. Validar Status do Aluno e Plano Ativo
      const studentStatus = await this.studentService.getStudentStatus(userId);

      if (!studentStatus.isActive) {
        this.logger.warn(`Check-in negado: Usuário ${userId} possui plano inativo`, 'ProcessCheckinService');
        await this.logFailedCheckin(userId, 'Plano inativo');
        throw new ForbiddenException('Acesso Negado - Verifique seu Plano');
      }

      // 3. Validar se o horário atual é permitido para o plano/agendamento
      const isTimeAllowed = await this.studentService.isCheckinAllowedAtCurrentTime(userId, studentStatus.planId);

      if (!isTimeAllowed) {
        this.logger.warn(`Check-in negado: Usuário ${userId} fora do horário permitido`, 'ProcessCheckinService');
        await this.logFailedCheckin(userId, 'Horário não permitido');
        throw new ForbiddenException('Acesso Negado - Horário inválido para este plano');
      }

      // 4. Disparar Pulso de Abertura (Hardware API)
      const isTurnstileOpened = await this.hardwareService.openTurnstile();

      if (!isTurnstileOpened) {
        this.logger.error(`Falha ao abrir a catraca para o usuário ${userId}`, undefined, 'ProcessCheckinService');
        throw new InternalServerErrorException('Falha de hardware ao liberar acesso');
      }

      // 5. Registrar Log de Check-in bem-sucedido
      await this.checkinRepository.logCheckin({
        studentId: userId,
        timestamp: new Date(),
        status: 'SUCCESS',
      });

      this.logger.log(`Check-in liberado com sucesso para o usuário ${userId}`, 'ProcessCheckinService');

      return {
        message: 'Acesso Liberado',
        userId: userId,
      };

    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`Erro interno ao processar check-in para ${userId}`, error.stack, 'ProcessCheckinService');
      throw new InternalServerErrorException('Erro ao processar check-in');
    }
  }

  private async logFailedCheckin(userId: string, reason: string): Promise<void> {
    await this.checkinRepository.logCheckin({
      studentId: userId,
      timestamp: new Date(),
      status: 'FAILED',
      reason,
    }).catch(e => {
        this.logger.error(`Falha ao salvar log de checkin para o user ${userId}`, e.stack, 'ProcessCheckinService');
    });
  }
}
