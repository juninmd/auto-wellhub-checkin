import dotenv from 'dotenv';
import { WellhubConfig } from '../types';

dotenv.config();

export const config: WellhubConfig = {
  email: process.env.WELLHUB_EMAIL || '',
  password: process.env.WELLHUB_PASSWORD || '',
  gymId: process.env.GYM_ID,
  activityId: process.env.ACTIVITY_ID,
};

export function validateConfig(): boolean {
  if (!config.email || !config.password) {
    console.error('❌ Erro: WELLHUB_EMAIL e WELLHUB_PASSWORD são obrigatórios');
    return false;
  }
  return true;
}
