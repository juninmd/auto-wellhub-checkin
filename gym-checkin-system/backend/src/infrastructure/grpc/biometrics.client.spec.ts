import { Test, TestingModule } from '@nestjs/testing';
import { BiometricsClientService } from './biometrics.client';
import { of, throwError } from 'rxjs';

describe('BiometricsClientService', () => {
  let service: BiometricsClientService;

  const mockBiometricServiceGrpc = {
    identify: jest.fn(),
  };

  const mockClientGrpc = {
    getService: jest.fn().mockReturnValue(mockBiometricServiceGrpc),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BiometricsClientService,
        {
          provide: 'BIOMETRICS_PACKAGE',
          useValue: mockClientGrpc,
        },
      ],
    }).compile();

    service = module.get<BiometricsClientService>(BiometricsClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize the biometric service', () => {
      service.onModuleInit();
      expect(mockClientGrpc.getService).toHaveBeenCalledWith('BiometricService');
    });
  });

  describe('validateBiometrics', () => {
    beforeEach(() => {
      service.onModuleInit();
    });

    it('should return a successful match response', async () => {
      mockBiometricServiceGrpc.identify.mockReturnValue(of({
        studentId: 'user-123',
        confidenceScore: 0.95,
        success: true,
        errorMessage: '',
      }));

      const result = await service.validateBiometrics({
        biometricData: 'base64-data',
        type: 'FACE',
      });

      expect(mockBiometricServiceGrpc.identify).toHaveBeenCalledWith({
        biometricBase64: 'base64-data',
      });
      expect(result).toEqual({
        success: true,
        userId: 'user-123',
        confidenceScore: 0.95,
        message: '',
      });
    });

    it('should return failure match response when gRPC throws an error', async () => {
      mockBiometricServiceGrpc.identify.mockReturnValue(throwError(() => new Error('gRPC connection error')));

      const result = await service.validateBiometrics({
        biometricData: 'base64-data',
        type: 'FACE',
      });

      expect(result).toEqual({
        success: false,
        message: 'gRPC connection error',
      });
    });

    it('should return generic error message if error has no message', async () => {
      mockBiometricServiceGrpc.identify.mockReturnValue(throwError(() => ({})));

      const result = await service.validateBiometrics({
        biometricData: 'base64-data',
        type: 'FACE',
      });

      expect(result).toEqual({
        success: false,
        message: 'Error communicating with biometric service',
      });
    });
  });
});
