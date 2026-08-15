import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import {
  BiometricsService,
  IdentifyRequest,
} from "../../infrastructure/grpc/biometrics.interface";
import { StudentsService } from "../../students/services/students.service";
import {
  IHardwareProvider,
  HARDWARE_PROVIDER,
} from "../../infrastructure/hardware/hardware.provider.interface";
import { ICheckinRepository } from "../interfaces/checkin-repository.interface";

@Injectable()
export class CheckinService implements OnModuleInit {
  private readonly logger = new Logger(CheckinService.name);
  private biometricsService: BiometricsService;

  constructor(
    @Inject("BIOMETRICS_PACKAGE") private readonly client: ClientGrpc,
    private readonly studentsService: StudentsService,
    @Inject(HARDWARE_PROVIDER)
    private readonly hardwareProvider: IHardwareProvider,
    @Inject(ICheckinRepository)
    private readonly checkinRepository: ICheckinRepository,
  ) {}

  onModuleInit() {
    this.biometricsService =
      this.client.getService<BiometricsService>("BiometricService");
  }

  /**
   * Processes a check-in request using biometric data.
   * @param biometricBase64 The base64 encoded biometric image or data.
   * @returns An object indicating success and a message.
   * @throws UnauthorizedException if identification or validation fails.
   */
  async processCheckin(
    biometricBase64: string,
  ): Promise<{ success: boolean; message: string; studentId?: string }> {
    try {
      this.logger.log("Starting biometric identification...");

      const identifyRequest: IdentifyRequest = {
        biometric_base64: biometricBase64,
      };
      // Convert RxJS Observable to Promise
      const identifyResponse = await lastValueFrom(
        this.biometricsService.identify(identifyRequest),
      );

      if (!identifyResponse.success || !identifyResponse.student_id) {
        this.logger.warn(
          `Biometric identification failed: ${identifyResponse.error_message}`,
        );
        throw new UnauthorizedException(
          identifyResponse.error_message || "Biometric identification failed.",
        );
      }

      const studentId = identifyResponse.student_id;
      this.logger.log(`Student identified: ${studentId}. Validating plan...`);

      const isPlanValid =
        await this.studentsService.validateStudentPlan(studentId);
      if (!isPlanValid) {
        this.logger.warn(`Plan validation failed for student ${studentId}.`);
        throw new UnauthorizedException(
          "Student does not have an active plan or is not allowed at this time.",
        );
      }

      this.logger.log(
        `Plan is valid. Opening turnstile for student ${studentId}...`,
      );
      const turnstileOpened =
        await this.hardwareProvider.openTurnstile(studentId);

      if (!turnstileOpened) {
        this.logger.error(`Failed to open turnstile for student ${studentId}.`);
        throw new InternalServerErrorException(
          "Failed to communicate with the hardware.",
        );
      }

      await this.checkinRepository.logCheckin({
        studentId,
        timestamp: new Date(),
        status: "SUCCESS",
      });

      this.logger.log(`Check-in successful for student ${studentId}.`);
      return { success: true, message: "Check-in successful", studentId };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      this.logger.error(
        `Unexpected error during check-in process: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "An unexpected error occurred during the check-in process.",
      );
    }
  }
}
