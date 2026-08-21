import { Injectable } from '@nestjs/common';
import { IHardwareService } from '../../infrastructure/hardware/hardware.interface';

@Injectable()
export class HardwareService implements IHardwareService {
  async openTurnstile(): Promise<boolean> {
    return true;
  }
}
