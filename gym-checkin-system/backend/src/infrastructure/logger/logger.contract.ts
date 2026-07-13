export interface LoggerService {
  log(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
  warn(message: string, context?: string): void;
  debug(message: string, context?: string): void;
}

// In a real application, this would map to something like Pino or Winston.
export abstract class AbstractLoggerService implements LoggerService {
  abstract log(message: string, context?: string): void;
  abstract error(message: string, trace?: string, context?: string): void;
  abstract warn(message: string, context?: string): void;
  abstract debug(message: string, context?: string): void;
}
// Logger Contract
