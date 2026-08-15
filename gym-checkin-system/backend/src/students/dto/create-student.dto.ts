export class CreateStudentDto {
  /**
   * Nome completo do aluno
   */
  name: string;

  /**
   * E-mail para contato
   */
  email: string;

  /**
   * ID do plano escolhido
   */
  planId: string;

  /**
   * Vetor facial (embedding) ou hash da digital.
   * Por exigência da LGPD, não armazenamos a foto bruta, apenas a representação matemática (hash/embedding).
   */
  biometricHash: string;

  /**
   * Tipo da biometria
   */
  biometricType: "FACE" | "FINGERPRINT";
}
