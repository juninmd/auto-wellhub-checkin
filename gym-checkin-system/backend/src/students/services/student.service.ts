import { Injectable } from "@nestjs/common";
import { CreateStudentDto } from "../dto/create-student.dto";
import { StudentResponseDto } from "../dto/students.dto";

export interface StudentStatus {
  isActive: boolean;
  planId: string;
}

@Injectable()
export class StudentService {
  async getStudentStatus(userId: string): Promise<StudentStatus> {
    return {
      isActive: true,
      planId: "plan-1",
    };
  }

  async isCheckinAllowedAtCurrentTime(
    userId: string,
    planId: string,
  ): Promise<boolean> {
    return true;
  }

  async registerStudent(dto: CreateStudentDto): Promise<StudentResponseDto> {
    // In a real application, this would save to the database.
    // Here we just return a mocked success response respecting the DTO.
    return {
      id: "mocked-uuid-1234",
      name: dto.name,
      isActive: true,
      planId: dto.planId,
    };
  }
}
