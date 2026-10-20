import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CheckinModule } from "./checkin/checkin.module";
import { StudentsModule } from "./students/students.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CheckinModule, StudentsModule],
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
