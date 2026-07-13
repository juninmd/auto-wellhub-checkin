export class CheckinRequestDto {
  /**
   * The biometric data captured by the totem (base64 image or pre-processed hash).
   */
  biometricData: string;

  /**
   * Type of biometrics being sent (e.g., 'FACE', 'FINGERPRINT').
   */
  type: 'FACE' | 'FINGERPRINT';

  /**
   * Timestamp of the checkin request from the totem.
   */
  timestamp: string;
}
