import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WellhubAccessClient } from "../infrastructure/wellhub/wellhub-access.client";
import { IWellhubAccessService } from "../infrastructure/wellhub/wellhub-access.contract";
import { WELLHUB_CONFIG, loadWellhubConfig } from "../infrastructure/wellhub/wellhub.config";

@Module({
  providers: [
    {
      provide: WELLHUB_CONFIG,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        loadWellhubConfig({
          WELLHUB_API_TOKEN: config.get("WELLHUB_API_TOKEN"),
          WELLHUB_GYM_ID: config.get("WELLHUB_GYM_ID"),
          WELLHUB_BASE_URL: config.get("WELLHUB_BASE_URL"),
          WELLHUB_TIMEOUT_MS: config.get("WELLHUB_TIMEOUT_MS"),
        }),
    },
    { provide: IWellhubAccessService, useClass: WellhubAccessClient },
  ],
  exports: [IWellhubAccessService],
})
export class WellhubModule {}
