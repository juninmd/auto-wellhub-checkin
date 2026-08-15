import { Test, TestingModule } from "@nestjs/testing";
import { StudentsService } from "./students.service";
import { ClientGrpc } from "@nestjs/microservices";
import { InternalServerErrorException } from "@nestjs/common";
import { of } from "rxjs";

describe("StudentsService", () => {
  let service: StudentsService;
  let clientGrpcMock: Partial<ClientGrpc>;
  let biometricsServiceMock: any;

  beforeEach(async () => {
    biometricsServiceMock = {
      enroll: jest.fn(),
    };

    clientGrpcMock = {
      getService: jest.fn().mockReturnValue(biometricsServiceMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: "BIOMETRICS_PACKAGE",
          useValue: clientGrpcMock,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    service.onModuleInit();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("registerStudent", () => {
    it("should register a student without biometrics", async () => {
      const dto = { studentId: "student-123", name: "John Doe" };
      const result = await service.registerStudent(dto);
      expect(result).toEqual({
        success: true,
        message: "Student registered successfully",
      });
      expect(biometricsServiceMock.enroll).not.toHaveBeenCalled();
    });

    it("should register a student with biometrics successfully", async () => {
      const dto = {
        studentId: "student-123",
        name: "John Doe",
        biometric_base64: "base64data",
      };
      biometricsServiceMock.enroll.mockReturnValue(of({ success: true }));

      const result = await service.registerStudent(dto);

      expect(result).toEqual({
        success: true,
        message: "Student registered successfully",
      });
      expect(biometricsServiceMock.enroll).toHaveBeenCalledWith({
        student_id: dto.studentId,
        biometric_base64: dto.biometric_base64,
      });
    });

    it("should throw InternalServerErrorException if biometric enrollment fails", async () => {
      const dto = {
        studentId: "student-123",
        name: "John Doe",
        biometric_base64: "base64data",
      };
      biometricsServiceMock.enroll.mockReturnValue(
        of({ success: false, error_message: "Enrollment error" }),
      );

      await expect(service.registerStudent(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it("should throw InternalServerErrorException if grpc call throws an error", async () => {
      const dto = {
        studentId: "student-123",
        name: "John Doe",
        biometric_base64: "base64data",
      };
      biometricsServiceMock.enroll.mockImplementation(() => {
        throw new Error("gRPC error");
      });

      await expect(service.registerStudent(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe("validateStudentPlan", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return false if studentId is not provided", async () => {
      const result = await service.validateStudentPlan("");
      expect(result).toBe(false);
    });

    it("should return false if student does not have an active plan", async () => {
      const result = await service.validateStudentPlan("inactive-student");
      expect(result).toBe(false);
    });

    it("should return false if time is not allowed (e.g., 4 AM)", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2023, 1, 1, 4, 0, 0)); // 4 AM

      const result = await service.validateStudentPlan("student-123");
      expect(result).toBe(false);
    });

    it("should return true if student has an active plan and time is allowed (e.g., 10 AM)", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2023, 1, 1, 10, 0, 0)); // 10 AM

      const result = await service.validateStudentPlan("student-123");
      expect(result).toBe(true);
    });

    it("should return true if student is simulated-user and time is allowed", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2023, 1, 1, 15, 0, 0)); // 3 PM

      const result = await service.validateStudentPlan("simulated-user");
      expect(result).toBe(true);
    });
  });
});
