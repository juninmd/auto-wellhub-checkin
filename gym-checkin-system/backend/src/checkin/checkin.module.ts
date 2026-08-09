import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CheckinController } from './controllers/checkin.controller';
import { CheckinService } from './services/checkin.service';
import { ICheckinRepository } from './interfaces/checkin-repository.interface';
import { IHardwareService } from '../infrastructure/hardware/hardware.interface';
import { HARDWARE_PROVIDER } from '../infrastructure/hardware/hardware.provider.interface';
import { AbstractLoggerService } from '../infrastructure/logger/logger.contract';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [
    StudentsModule,
    ClientsModule.register([
      {
        name: 'BIOMETRICS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'biometrics',
          protoPath: join(__dirname, '../../proto/biometrics.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [CheckinController],
  providers: [
    CheckinService,
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
      provide: HARDWARE_PROVIDER,
      useValue: {
        openTurnstile: async (studentId: string) => true,
      },
    },
    {
      provide: ICheckinRepository,
      useValue: {
        logCheckin: async (log: any) => ({ id: 'log-1', ...log }),
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
