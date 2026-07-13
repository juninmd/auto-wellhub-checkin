export interface CheckinLog {
  id: string;
  studentId: string;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILED';
  reason?: string;
}

export interface ICheckinRepository {
  /**
   * Registra um novo check-in (bem-sucedido ou falho).
   */
  logCheckin(log: Omit<CheckinLog, 'id'>): Promise<CheckinLog>;
}

export const ICheckinRepository = Symbol('ICheckinRepository');
