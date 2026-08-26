import { Test, TestingModule } from "@nestjs/testing";
import { StudentService } from "./student.service";

describe("StudentService", () => {
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getStudentStatus", () => {
    it("should return active status", async () => {
      const result = await service.getStudentStatus("user1");
      expect(result).toEqual({ isActive: true, planId: "plan-1" });
    });
  });

  describe("isCheckinAllowedAtCurrentTime", () => {
    it("should return true", async () => {
      const result = await service.isCheckinAllowedAtCurrentTime("user1", "plan-1");
      expect(result).toBe(true);
    });
  });

  describe("registerStudent", () => {
    it("should successfully register a student and return response", async () => {
      const createStudentDto = {
        name: "John Doe",
        email: "john@example.com",
        planId: "plan-1",
        biometricHash: "hash123",
        biometricType: "FACE" as const,
      };

      const result = await service.registerStudent(createStudentDto);
      expect(result).toEqual({
        id: "mocked-uuid-1234",
        name: "John Doe",
        isActive: true,
        planId: "plan-1",
      });
    });
  });
});
