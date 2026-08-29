import { Test, TestingModule } from '@nestjs/testing';
import { ProcessCheckinService } from './process-checkin.service';
import { UnauthorizedException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { IHardwareService } from '../../infrastructure/hardware/hardware.interface';
import { ICheckinRepository } from '../interfaces/checkin-repository.interface';
import { CheckinRequestDto } from '../dto/checkin.dto';
import { StudentService } from '../../students/services/student.service';

describe('ProcessCheckinService', () => {
  let service: ProcessCheckinService;
  let mockBiometricsService: any;
  let mockStudentService: any;
  let mockHardwareService: any;
  let mockCheckinRepository: any;

  beforeEach(async () => {
    mockBiometricsService = {
      validateBiometrics: jest.fn().mockResolvedValue({ success: true, userId: 'user-1' }),
    };
    mockStudentService = {
      getStudentStatus: jest.fn().mockResolvedValue({ isActive: true, planId: 'plan-1' }),
      isCheckinAllowedAtCurrentTime: jest.fn().mockResolvedValue(true),
    };
    mockHardwareService = {
      openTurnstile: jest.fn().mockResolvedValue(true),
    };
    mockCheckinRepository = {
      logCheckin: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessCheckinService,
        { provide: 'BiometricsGrpcService', useValue: mockBiometricsService },
        { provide: StudentService, useValue: mockStudentService },
        { provide: IHardwareService, useValue: mockHardwareService },
        { provide: ICheckinRepository, useValue: mockCheckinRepository },
        {
          provide: 'LoggerService',
          useValue: { log: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ProcessCheckinService>(ProcessCheckinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException when biometric validation fails', async () => {
    mockBiometricsService.validateBiometrics.mockResolvedValueOnce({ success: false });

    const dto: CheckinRequestDto = { biometricData: 'data', type: 'FACE' };
    await expect(service.execute(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException when student plan is inactive', async () => {
    mockStudentService.getStudentStatus.mockResolvedValueOnce({ isActive: false, planId: 'plan-1' });

    const dto: CheckinRequestDto = { biometricData: 'data', type: 'FACE' };
    await expect(service.execute(dto)).rejects.toThrow(ForbiddenException);
    expect(mockCheckinRepository.logCheckin).toHaveBeenCalledWith(expect.objectContaining({
      status: 'FAILED',
      reason: 'Plano inativo'
    }));
  });

  it('should throw ForbiddenException when checkin is not allowed at current time', async () => {
    mockStudentService.isCheckinAllowedAtCurrentTime.mockResolvedValueOnce(false);

    const dto: CheckinRequestDto = { biometricData: 'data', type: 'FACE' };
    await expect(service.execute(dto)).rejects.toThrow(ForbiddenException);
    expect(mockCheckinRepository.logCheckin).toHaveBeenCalledWith(expect.objectContaining({
      status: 'FAILED',
      reason: 'Horário não permitido'
    }));
  });

  it('should throw InternalServerErrorException when turnstile fails to open', async () => {
    mockHardwareService.openTurnstile.mockResolvedValueOnce(false);

    const dto: CheckinRequestDto = { biometricData: 'data', type: 'FACE' };
    await expect(service.execute(dto)).rejects.toThrow(InternalServerErrorException);
  });

  it('should return successfully when all checks pass', async () => {
    const dto: CheckinRequestDto = { biometricData: 'data', type: 'FACE' };
    const result = await service.execute(dto);

    expect(result).toEqual({ message: 'Acesso Liberado', userId: 'user-1' });
    expect(mockCheckinRepository.logCheckin).toHaveBeenCalledWith(expect.objectContaining({
      status: 'SUCCESS'
    }));
  });

  it('should catch error when logFailedCheckin throws', async () => {
    mockStudentService.getStudentStatus.mockResolvedValueOnce({ isActive: false, planId: 'plan-1' });
    mockCheckinRepository.logCheckin.mockRejectedValueOnce(new Error('DB Error'));

    const dto: CheckinRequestDto = { biometricData: 'data', type: 'FACE' };
    await expect(service.execute(dto)).rejects.toThrow(ForbiddenException);

    // Wait a tick for the unhandled rejection in catch block of logFailedCheckin
    await new Promise(resolve => setTimeout(resolve, 0));
    // We can't easily assert the logger without spying on it from the module.
  });

  it('should throw InternalServerErrorException for unexpected errors', async () => {
    mockStudentService.getStudentStatus.mockRejectedValueOnce(new Error('Unexpected DB Error'));

    const dto: CheckinRequestDto = { biometricData: 'data', type: 'FACE' };
    await expect(service.execute(dto)).rejects.toThrow(InternalServerErrorException);
  });
});
