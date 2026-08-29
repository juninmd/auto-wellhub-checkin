import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentService } from '../services/student.service';
import { CreateStudentDto } from '../dto/create-student.dto';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentService,
          useValue: {
            registerStudent: jest.fn().mockResolvedValue({ id: '1', name: 'John', isActive: true, planId: 'plan-1' }),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call studentService.registerStudent', async () => {
    const dto: CreateStudentDto = {
      name: 'John',
      email: 'john@example.com',
      planId: 'plan-1',
      biometricHash: 'hash',
      biometricType: 'FACE'
    };
    const result = await controller.registerStudent(dto);
    expect(service.registerStudent).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: '1', name: 'John', isActive: true, planId: 'plan-1' });
  });
});
