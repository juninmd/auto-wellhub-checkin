import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { of } from 'rxjs';
import { CheckinService } from './checkin.service';
import { StudentsService } from '../../students/services/students.service';
import { HARDWARE_PROVIDER, IHardwareProvider } from '../../infrastructure/hardware/hardware.provider.interface';
import { ICheckinRepository } from '../interfaces/checkin-repository.interface';

describe('CheckinService', () => {
  let service: CheckinService;
  let studentsService: StudentsService;
  let hardwareProvider: IHardwareProvider;
  let checkinRepository: ICheckinRepository;

  const mockBiometricsService = {
    identify: jest.fn(),
  };

  const mockClientGrpc = {
    getService: jest.fn().mockReturnValue(mockBiometricsService),
  };

  const mockStudentsService = {
    validateStudentPlan: jest.fn(),
  };

  const mockHardwareProvider = {
    openTurnstile: jest.fn(),
  };

  const mockCheckinRepository = {
    logCheckin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinService,
        { provide: 'BIOMETRICS_PACKAGE', useValue: mockClientGrpc },
        { provide: StudentsService, useValue: mockStudentsService },
        { provide: HARDWARE_PROVIDER, useValue: mockHardwareProvider },
        { provide: ICheckinRepository, useValue: mockCheckinRepository },
        { provide: 'LoggerService', useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() } },
      ],
    }).compile();

    service = module.get<CheckinService>(CheckinService);
    studentsService = module.get<StudentsService>(StudentsService);
    hardwareProvider = module.get<IHardwareProvider>(HARDWARE_PROVIDER);
    checkinRepository = module.get<ICheckinRepository>(ICheckinRepository);

    // Initialize the module to setup the gRPC service reference
    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process check-in successfully', async () => {
    mockBiometricsService.identify.mockReturnValue(of({ success: true, student_id: 'student-123' }));
    mockStudentsService.validateStudentPlan.mockResolvedValue(true);
    mockHardwareProvider.openTurnstile.mockResolvedValue(true);
    mockCheckinRepository.logCheckin.mockResolvedValue({});

    const result = await service.processCheckin('base64data');

    expect(result).toEqual({ success: true, message: 'Check-in successful', studentId: 'student-123' });
    expect(mockBiometricsService.identify).toHaveBeenCalledWith({ biometric_base64: 'base64data' });
    expect(mockStudentsService.validateStudentPlan).toHaveBeenCalledWith('student-123');
    expect(mockHardwareProvider.openTurnstile).toHaveBeenCalledWith('student-123');
    expect(mockCheckinRepository.logCheckin).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if biometric identification fails', async () => {
    mockBiometricsService.identify.mockReturnValue(of({ success: false, error_message: 'Not found' }));

    await expect(service.processCheckin('invalid-data')).rejects.toThrow(UnauthorizedException);
    expect(mockStudentsService.validateStudentPlan).not.toHaveBeenCalled();
    expect(mockHardwareProvider.openTurnstile).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if student plan is invalid', async () => {
    mockBiometricsService.identify.mockReturnValue(of({ success: true, student_id: 'student-456' }));
    mockStudentsService.validateStudentPlan.mockResolvedValue(false);

    await expect(service.processCheckin('base64data')).rejects.toThrow(UnauthorizedException);
    expect(mockHardwareProvider.openTurnstile).not.toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException if hardware fails', async () => {
    mockBiometricsService.identify.mockReturnValue(of({ success: true, student_id: 'student-789' }));
    mockStudentsService.validateStudentPlan.mockResolvedValue(true);
    mockHardwareProvider.openTurnstile.mockResolvedValue(false);

    await expect(service.processCheckin('base64data')).rejects.toThrow(InternalServerErrorException);
    expect(mockCheckinRepository.logCheckin).not.toHaveBeenCalled();
  });
});
