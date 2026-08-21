import { IsString, IsNotEmpty, IsIn } from "class-validator";

export class CheckinRequestDto {
  @IsString()
  @IsNotEmpty()
  biometricData: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['FACE', 'FINGERPRINT'])
  type: 'FACE' | 'FINGERPRINT';
}
