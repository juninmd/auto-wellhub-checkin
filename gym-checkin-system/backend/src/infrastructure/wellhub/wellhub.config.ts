export const SANDBOX_URL = "https://apitesting.partners.gympass.com/access/v1";

export interface WellhubConfig {
  baseUrl: string;
  apiToken: string;
  gymId: string;
  timeoutMs: number;
}

export const WELLHUB_CONFIG = Symbol("WELLHUB_CONFIG");

/**
 * Lê e valida a configuração do Wellhub a partir das variáveis de ambiente.
 * Falha na inicialização se token ou Gym ID não estiverem definidos.
 */
export function loadWellhubConfig(env: Record<string, string | undefined>): WellhubConfig {
  const apiToken = env.WELLHUB_API_TOKEN?.trim();
  const gymId = env.WELLHUB_GYM_ID?.trim();
  if (!apiToken || !gymId) {
    throw new Error("WELLHUB_API_TOKEN e WELLHUB_GYM_ID são obrigatórios.");
  }
  const timeoutMs = Number(env.WELLHUB_TIMEOUT_MS ?? 5000);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error("WELLHUB_TIMEOUT_MS deve ser um número positivo.");
  }
  return {
    baseUrl: (env.WELLHUB_BASE_URL?.trim() || SANDBOX_URL).replace(/\/+$/, ""),
    apiToken,
    gymId,
    timeoutMs,
  };
}
