// hardware/services/hardware.service.ts
export interface HardwareService {
  triggerTurnstile(gateId?: string): Promise<boolean>;
}
