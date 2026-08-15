import { IsString, IsNotEmpty } from "class-validator";

export class CheckinDto {
  @IsString()
  @IsNotEmpty()
  biometric_base64: string;
}
