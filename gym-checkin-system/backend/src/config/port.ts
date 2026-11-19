export const DEFAULT_PORT = 3000;

/** Lê PORT do ambiente; falha na inicialização se não for uma porta TCP válida. */
export function resolvePort(env: Record<string, string | undefined>): number {
  const raw = env.PORT?.trim();
  if (!raw) return DEFAULT_PORT;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT deve ser um inteiro entre 1 e 65535.");
  }
  return port;
}
