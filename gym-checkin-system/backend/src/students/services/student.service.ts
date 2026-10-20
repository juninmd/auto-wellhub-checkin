import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { CreateStudentDto } from "../dto/create-student.dto";
import { StudentResponseDto } from "../dto/students.dto";

export interface StudentStatus {
  isActive: boolean;
  planId: string;
  /** ID Wellhub (13 dígitos); ausente para alunos que não usam Wellhub. */
  gympassId?: string;
}

@Injectable()
export class StudentService {
  private readonly gympassIds = new Map<string, string>();

  async getStudentStatus(userId: string): Promise<StudentStatus> {
    const gympassId = this.gympassIds.get(userId);
    return {
      isActive: true,
      planId: "plan-1",
      ...(gympassId ? { gympassId } : {}),
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
    const id = randomUUID();
    if (dto.gympassId) {
      this.gympassIds.set(id, dto.gympassId);
    }
    return {
      id,
      name: dto.name,
      isActive: true,
      planId: dto.planId,
    };
  }
}
