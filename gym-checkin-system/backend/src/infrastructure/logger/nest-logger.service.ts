import { Injectable, Logger } from '@nestjs/common';
import { AbstractLoggerService } from './logger.contract';

/** Delegates to Nest's Logger so check-in failures actually reach stdout. */
@Injectable()
export class NestLoggerService extends AbstractLoggerService {
  private readonly logger = new Logger();

  log(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }
}
