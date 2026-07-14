import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateStudentDto } from '../dto/create-student.dto';
import { AbstractLoggerService } from '../../infrastructure/logger/logger.contract';

@Controller('students')
export class StudentsController {
  constructor(
    @Inject('LoggerService')
    private readonly logger: AbstractLoggerService,
  ) {}

  @Post()
  async register(@Body() createStudentDto: CreateStudentDto) {
    this.logger.log(`Registrando aluno ${createStudentDto.name}`, 'StudentsController');

    // Simulação do registro do aluno e do hash biométrico seguro
    // O ideal seria repassar para um StudentRegistrationUseCase / Service

    return {
      message: 'Aluno registrado com sucesso. Biometria armazenada conforme LGPD.',
      studentId: 'simulated-uuid-1234',
    };
  }
}
