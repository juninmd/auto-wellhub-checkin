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
});
