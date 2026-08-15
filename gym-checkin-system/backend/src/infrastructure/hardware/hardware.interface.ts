export interface IHardwareService {
  /**
   * Envia um sinal para abrir a catraca ou porta.
   * Retorna um booleano indicando o sucesso da operação física.
   */
  openTurnstile(): Promise<boolean>;
}

export const IHardwareService = Symbol("IHardwareService");
