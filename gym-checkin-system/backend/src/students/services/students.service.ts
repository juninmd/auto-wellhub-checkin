import {
  Injectable,
  Inject,
  OnModuleInit,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import {
  BiometricsService,
  EnrollRequest,
} from "../../infrastructure/grpc/biometrics.interface";
import { RegisterStudentDto } from "../dto/students.dto";

@Injectable()
export class StudentsService implements OnModuleInit {
  private readonly logger = new Logger(StudentsService.name);
  private biometricsService: BiometricsService;

  constructor(
    @Inject("BIOMETRICS_PACKAGE") private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.biometricsService =
      this.client.getService<BiometricsService>("BiometricService");
  }

  /**
   * Validates if a student has an active plan and is allowed to check-in at the current time.
   * @param studentId The ID of the student to validate.
   * @returns true if the student has an active plan and can check-in, false otherwise.
   */
  async registerStudent(
    dto: RegisterStudentDto,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Registering student ${dto.studentId}...`);

    // In a real implementation, we would save the student data to PostgreSQL here.

    if (dto.biometric_base64) {
      try {
        this.logger.log(`Enrolling biometrics for student ${dto.studentId}...`);
        const enrollRequest: EnrollRequest = {
          student_id: dto.studentId,
          biometric_base64: dto.biometric_base64,
        };

        const enrollResponse = await lastValueFrom(
          this.biometricsService.enroll(enrollRequest),
        );

        if (!enrollResponse.success) {
          throw new InternalServerErrorException(
            `Biometric enrollment failed: ${enrollResponse.error_message}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Error enrolling biometrics: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          "Failed to process biometric enrollment.",
        );
      }
    }

    return { success: true, message: "Student registered successfully" };
  }

  async validateStudentPlan(studentId: string): Promise<boolean> {
    if (!studentId) {
      return false;
    }

    // Simulate database check for active plan and allowed time
    const activePlansMock = ["student-123", "student-456", "simulated-user"];
    const hasActivePlan = activePlansMock.includes(studentId);

    const currentHour = new Date().getHours();
    const isAllowedTime = currentHour >= 6 && currentHour <= 22; // Example: allowed between 6am and 10pm

    return hasActivePlan && isAllowedTime;
  }
}
