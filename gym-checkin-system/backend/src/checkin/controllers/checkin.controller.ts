import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { CheckinService } from "../services/checkin.service";
import { CheckinDto } from "../dto/checkin.dto";

@Controller("checkin")
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async processCheckin(@Body() checkinDto: CheckinDto) {
    return await this.checkinService.processCheckin(
      checkinDto.biometric_base64,
    );
  }
}
