import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { StudentsService } from "../services/students.service";
import { RegisterStudentDto } from "../dto/students.dto";

@Controller("students")
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterStudentDto) {
    return await this.studentsService.registerStudent(registerDto);
  }
}
