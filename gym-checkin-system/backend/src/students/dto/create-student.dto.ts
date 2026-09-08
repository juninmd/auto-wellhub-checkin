import { IsString, IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class CreateStudentDto {
  /**
   * Nome completo do aluno
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * E-mail para contato
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * ID do plano escolhido
   */
  @IsString()
  @IsNotEmpty()
  planId: string;

  /**
   * Vetor facial (embedding) ou hash da digital.
   * Por exigência da LGPD, não armazenamos a foto bruta, apenas a representação matemática (hash/embedding).
   */
  @IsString()
  @IsNotEmpty()
  biometricHash: string;

  /**
   * Tipo da biometria
   */
  @IsString()
  @IsIn(["FACE", "FINGERPRINT"])
  biometricType: "FACE" | "FINGERPRINT";
}
