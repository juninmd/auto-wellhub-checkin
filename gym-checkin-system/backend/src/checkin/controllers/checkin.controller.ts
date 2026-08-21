import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { ProcessCheckinService } from "../services/process-checkin.service";
import { CheckinRequestDto } from "../dto/checkin.dto";

@Controller("checkin")
export class CheckinController {
  constructor(private readonly processCheckinService: ProcessCheckinService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async processCheckin(@Body() dto: CheckinRequestDto) {
    return await this.processCheckinService.execute(dto);
  }
}
