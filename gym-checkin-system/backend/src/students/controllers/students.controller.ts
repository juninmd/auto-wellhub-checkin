import { Controller } from "@nestjs/common";
import { StudentService } from "../services/student.service";

@Controller("students")
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}
}
