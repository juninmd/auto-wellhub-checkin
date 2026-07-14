import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CheckinRequestDto } from '../dto/checkin.dto';
import { ProcessCheckinService } from '../services/process-checkin.service';

@Controller('checkin')
export class CheckinController {
  constructor(
    private readonly processCheckinService: ProcessCheckinService,
  ) {}

  @Post()
  async checkin(@Body() checkinDto: CheckinRequestDto) {
    return this.processCheckinService.execute(checkinDto);
  }
}
