// students/services/student.service.ts
export interface StudentStatus {
  isActive: boolean;
  planId: string;
}

export interface StudentService {
  getStudentStatus(userId: string): Promise<StudentStatus>;
  isCheckinAllowedAtCurrentTime(userId: string, planId: string): Promise<boolean>;
}
// Student Service
