import { Module } from '@nestjs/common';
import { HardwareService } from './services/hardware.service';
import { IHardwareService } from '../infrastructure/hardware/hardware.interface';

@Module({
  providers: [
    {
      provide: IHardwareService,
      useClass: HardwareService,
    },
  ],
  exports: [IHardwareService],
})
export class HardwareModule {}
