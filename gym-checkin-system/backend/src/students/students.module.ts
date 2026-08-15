import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { StudentsController } from "./controllers/students.controller";
import { StudentsService } from "./services/students.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "BIOMETRICS_PACKAGE",
        transport: Transport.GRPC,
        options: {
          package: "biometrics",
          protoPath: join(__dirname, "../../proto/biometrics.proto"),
          url: "localhost:50051",
        },
      },
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
