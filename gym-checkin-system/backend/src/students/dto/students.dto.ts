import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class RegisterStudentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  biometric_base64?: string;
}
