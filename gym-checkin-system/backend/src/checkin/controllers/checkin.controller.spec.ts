import { Test, TestingModule } from '@nestjs/testing';
import { CheckinController } from './checkin.controller';
import { ProcessCheckinService } from '../services/process-checkin.service';
import { CheckinRequestDto } from '../dto/checkin.dto';

describe('CheckinController', () => {
  let controller: CheckinController;
  let service: ProcessCheckinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckinController],
      providers: [
        {
          provide: ProcessCheckinService,
          useValue: {
            execute: jest.fn().mockResolvedValue({ message: 'Acesso Liberado', userId: 'user-1' }),
          },
        },
      ],
    }).compile();

    controller = module.get<CheckinController>(CheckinController);
    service = module.get<ProcessCheckinService>(ProcessCheckinService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call processCheckinService.execute', async () => {
    const dto: CheckinRequestDto = { biometricData: 'data', type: 'FACE' };
    const result = await controller.processCheckin(dto);
    expect(service.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ message: 'Acesso Liberado', userId: 'user-1' });
  });
});
