import { Test, TestingModule } from '@nestjs/testing';
import { ProcessCheckinService } from './process-checkin.service';
import { ICheckinRepository } from '../interfaces/checkin-repository.interface';
import { IHardwareService } from '../../infrastructure/hardware/hardware.interface';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

describe('ProcessCheckinService', () => {
  let service: ProcessCheckinService;

  const mockBiometricsService = {
    validateBiometrics: jest.fn(),
  };

  const mockStudentService = {
    getStudentStatus: jest.fn(),
    isCheckinAllowedAtCurrentTime: jest.fn(),
  };

  const mockHardwareService = {
    openTurnstile: jest.fn(),
  };

  const mockCheckinRepository = {
    logCheckin: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessCheckinService,
        {
          provide: 'BiometricsGrpcService',
          useValue: mockBiometricsService,
        },
        {
          provide: 'StudentService',
          useValue: mockStudentService,
        },
        {
          provide: IHardwareService,
          useValue: mockHardwareService,
        },
        {
          provide: ICheckinRepository,
          useValue: mockCheckinRepository,
        },
        {
          provide: 'LoggerService',
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ProcessCheckinService>(ProcessCheckinService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully process a checkin', async () => {
    mockBiometricsService.validateBiometrics.mockResolvedValue({ success: true, userId: 'user-123' });
    mockStudentService.getStudentStatus.mockResolvedValue({ isActive: true, planId: 'plan-1' });
    mockStudentService.isCheckinAllowedAtCurrentTime.mockResolvedValue(true);
    mockHardwareService.openTurnstile.mockResolvedValue(true);
    mockCheckinRepository.logCheckin.mockResolvedValue({});

    const result = await service.execute({ biometricData: 'data', type: 'FACE', timestamp: '2023-01-01' });

    expect(result).toEqual({ message: 'Acesso Liberado', userId: 'user-123' });
    expect(mockHardwareService.openTurnstile).toHaveBeenCalled();
    expect(mockCheckinRepository.logCheckin).toHaveBeenCalledWith(
        expect.objectContaining({ studentId: 'user-123', status: 'SUCCESS' })
    );
  });

  it('should throw UnauthorizedException if biometric validation fails', async () => {
    mockBiometricsService.validateBiometrics.mockResolvedValue({ success: false });

    await expect(
        service.execute({ biometricData: 'data', type: 'FACE', timestamp: '2023-01-01' })
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException if student plan is inactive', async () => {
    mockBiometricsService.validateBiometrics.mockResolvedValue({ success: true, userId: 'user-123' });
    mockStudentService.getStudentStatus.mockResolvedValue({ isActive: false, planId: 'plan-1' });

    await expect(
        service.execute({ biometricData: 'data', type: 'FACE', timestamp: '2023-01-01' })
    ).rejects.toThrow(ForbiddenException);

    expect(mockCheckinRepository.logCheckin).toHaveBeenCalledWith(
        expect.objectContaining({ studentId: 'user-123', status: 'FAILED', reason: 'Plano inativo' })
    );
  });
});
