export const HARDWARE_PROVIDER = 'HARDWARE_PROVIDER';

export interface IHardwareProvider {
  /**
   * Sends a command to open the turnstile/door for a specific student.
   * @param studentId The ID of the student.
   * @returns true if the command was successfully sent and acknowledged, false otherwise.
   */
  openTurnstile(studentId: string): Promise<boolean>;
}
