import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { StudentService } from "../services/student.service";
import { CreateStudentDto } from "../dto/create-student.dto";
import { StudentResponseDto } from "../dto/students.dto";

@Controller("students")
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerStudent(@Body() createStudentDto: CreateStudentDto): Promise<StudentResponseDto> {
    return this.studentService.registerStudent(createStudentDto);
  }
}
