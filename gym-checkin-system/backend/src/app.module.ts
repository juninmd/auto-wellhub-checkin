import { Module } from "@nestjs/common";
import { CheckinModule } from "./checkin/checkin.module";
import { StudentsModule } from "./students/students.module";

@Module({
  imports: [CheckinModule, StudentsModule],
  controllers: [],
  providers: [
    {
      provide: "LoggerService",
      useValue: {
        log: () => {},
        error: () => {},
        warn: () => {},
        debug: () => {},
      },
    },
  ],
})
export class AppModule {}
