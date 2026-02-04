export interface WellhubConfig {
  email: string;
  password: string;
  gymId?: string;
  activityId?: string;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface Activity {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  vacancies: number;
}

export interface Gym {
  id: string;
  name: string;
  address: string;
}
