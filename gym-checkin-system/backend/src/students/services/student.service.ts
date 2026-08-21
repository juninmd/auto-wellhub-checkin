import { Injectable } from "@nestjs/common";

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
}
