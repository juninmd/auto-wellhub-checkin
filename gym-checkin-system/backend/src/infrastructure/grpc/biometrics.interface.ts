import { Observable } from 'rxjs';

export interface IdentifyRequest {
  biometric_base64: string;
}

export interface IdentifyResponse {
  student_id: string;
  confidence_score: number;
  success: boolean;
  error_message: string;
}

export interface EnrollRequest {
  student_id: string;
  biometric_base64: string;
}

export interface EnrollResponse {
  success: boolean;
  error_message: string;
}

export interface BiometricsService {
  identify(data: IdentifyRequest): Observable<IdentifyResponse>;
  enroll(data: EnrollRequest): Observable<EnrollResponse>;
}
