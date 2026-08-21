import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { CheckinController } from "./controllers/checkin.controller";
import { ProcessCheckinService } from "./services/process-checkin.service";
import { ICheckinRepository } from "./interfaces/checkin-repository.interface";
import { IHardwareService } from "../infrastructure/hardware/hardware.interface";
import { AbstractLoggerService } from "../infrastructure/logger/logger.contract";
import { StudentsModule } from "../students/students.module";
import { HardwareModule } from "../hardware/hardware.module";

@Module({
  imports: [
    StudentsModule,
    HardwareModule,
    ClientsModule.register([
      {
        name: "BIOMETRICS_PACKAGE",
        transport: Transport.GRPC,
        options: {
          package: "biometrics",
          protoPath: join(__dirname, "../../proto/biometrics.proto"),
          url: "localhost:50051",
        },
      },
    ]),
  ],
  controllers: [CheckinController],
  providers: [
    ProcessCheckinService,
    {
      provide: "BiometricsGrpcService",
      useValue: {
        validateBiometrics: async () => ({
          success: true,
          userId: "simulated-user",
        }),
      },
    },
    {
      provide: ICheckinRepository,
      useValue: {
        logCheckin: async (log: any) => ({ id: "log-1", ...log }),
      },
    },
    {
      provide: "LoggerService",
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
