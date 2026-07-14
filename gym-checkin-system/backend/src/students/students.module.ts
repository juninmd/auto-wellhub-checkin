import { Module } from '@nestjs/common';
import { StudentsController } from './controllers/students.controller';

// Provisório: implementando uma versão básica do serviço que injetaremos globalmente depois
// Mas o module precisa existir
@Module({
  controllers: [StudentsController],
  providers: [
    {
      provide: 'StudentService',
      useValue: {
        getStudentStatus: async () => ({ isActive: true, planId: 'plan-1' }),
        isCheckinAllowedAtCurrentTime: async () => true,
      },
    },
  ],
  exports: ['StudentService'],
})
export class StudentsModule {}
