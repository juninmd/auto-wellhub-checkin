import { Module } from '@nestjs/common';
import { CheckinController } from './controllers/checkin.controller';
import { ProcessCheckinService } from './services/process-checkin.service';
import { ICheckinRepository } from './interfaces/checkin-repository.interface';
import { IHardwareService } from '../infrastructure/hardware/hardware.interface';
import { AbstractLoggerService } from '../infrastructure/logger/logger.contract';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [StudentsModule],
  controllers: [CheckinController],
  providers: [
    ProcessCheckinService,
    {
      provide: 'BiometricsGrpcService',
      useValue: {
        validateBiometrics: async () => ({ success: true, userId: 'simulated-user' }),
      },
    },
    {
      provide: IHardwareService,
      useValue: {
        openTurnstile: async () => true,
      },
    },
    {
      provide: ICheckinRepository,
      useValue: {
        logCheckin: async (log) => ({ id: 'log-1', ...log }),
      },
    },
    {
      provide: 'LoggerService',
      useValue: {
        log: () => {},
        error: () => {},
        warn: () => {},
        debug: () => {},
      },
    },
  ],
})
export class CheckinModule {}
