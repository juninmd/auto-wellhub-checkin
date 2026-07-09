/**
 * Interface representing the structure of the biometric match request
 * sent from the NestJS backend to the Python microservice via gRPC.
 */
export interface BiometricMatchRequest {
  /**
   * The biometric data captured by the totem.
   * Could be a base64 encoded image or a pre-processed hash/embedding.
   */
  biometricData: string;

  /**
   * Type of biometrics being sent (e.g., 'FACE', 'FINGERPRINT').
   */
  type: 'FACE' | 'FINGERPRINT';
}

/**
 * Interface representing the response received from the Python microservice
 * after attempting a biometric match.
 */
export interface BiometricMatchResponse {
  /**
   * True if a match was successfully found with an acceptable confidence level.
   */
  success: boolean;

  /**
   * The ID of the user if a match was found.
   * Undefined or null if no match was found.
   */
  userId?: string;

  /**
   * The confidence score of the match (e.g., 0.0 to 1.0).
   */
  confidenceScore?: number;

  /**
   * Optional message providing more details (e.g., error reason if success is false).
   */
  message?: string;
}

/**
 * Interface definition for the Biometrics gRPC Service.
 * This contract defines the methods available on the Python microservice.
 */
export interface BiometricsGrpcService {
  /**
   * Validates the provided biometric data against the database of known embeddings.
   * @param data The biometric match request containing the captured data.
   * @returns A promise resolving to the match response (success, userId, etc.).
   */
  validateBiometrics(data: BiometricMatchRequest): Promise<BiometricMatchResponse>;
}
