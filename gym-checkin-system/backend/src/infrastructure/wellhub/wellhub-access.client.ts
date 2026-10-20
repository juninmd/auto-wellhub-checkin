import { Inject, Injectable } from "@nestjs/common";
import { IWellhubAccessService, WellhubValidation } from "./wellhub-access.contract";
import { WELLHUB_CONFIG, WellhubConfig } from "./wellhub.config";

const GYMPASS_ID_PATTERN = /^\d{13}$/;

/** Falhas que não dizem nada sobre o aluno: credenciais, indisponibilidade. */
const isUnreliableStatus = (status: number) => status === 401 || status === 403 || status >= 500;

@Injectable()
export class WellhubAccessClient implements IWellhubAccessService {
  constructor(@Inject(WELLHUB_CONFIG) private readonly config: WellhubConfig) {}

  async validate(gympassId: string, customCode?: string): Promise<WellhubValidation> {
    if (!GYMPASS_ID_PATTERN.test(gympassId)) {
      return { approved: false };
    }

    const response = await fetch(`${this.config.baseUrl}/validate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiToken}`,
        "X-Gym-Id": this.config.gymId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gympass_id: gympassId,
        ...(customCode ? { custom_code: customCode } : {}),
      }),
      signal: AbortSignal.timeout(this.config.timeoutMs),
    });

    if (isUnreliableStatus(response.status)) {
      throw new Error(`Wellhub Access Control API respondeu ${response.status}`);
    }
    return { approved: response.ok, httpStatus: response.status };
  }
}
