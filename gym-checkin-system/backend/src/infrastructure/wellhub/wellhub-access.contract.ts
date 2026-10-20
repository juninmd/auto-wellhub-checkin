export interface WellhubValidation {
  /** true quando o Wellhub confirma um check-in ativo para o aluno. */
  approved: boolean;
  /** Status HTTP retornado pelo Wellhub (ausente se nenhuma chamada foi feita). */
  httpStatus?: number;
}

export interface IWellhubAccessService {
  /**
   * Valida na Access Control API se o aluno possui check-in ativo no app Wellhub.
   * Retorna `approved: false` quando o acesso é negado.
   * Lança erro quando não foi possível obter uma resposta confiável
   * (rede, timeout, 401/403 ou 5xx) — nesse caso o acesso deve falhar fechado.
   */
  validate(gympassId: string, customCode?: string): Promise<WellhubValidation>;
}

export const IWellhubAccessService = Symbol("IWellhubAccessService");
