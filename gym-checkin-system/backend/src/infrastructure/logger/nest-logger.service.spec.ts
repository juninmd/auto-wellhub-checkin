import { Logger } from '@nestjs/common';
import { NestLoggerService } from './nest-logger.service';

describe('NestLoggerService', () => {
  afterEach(() => jest.restoreAllMocks());

  it('forwards error with stack trace and context instead of dropping it', () => {
    const spy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    new NestLoggerService().error('Erro interno: u1', 'stack-trace', 'ProcessCheckinService');
    expect(spy).toHaveBeenCalledWith('Erro interno: u1', 'stack-trace', 'ProcessCheckinService');
  });

  it('forwards warn, log and debug with their context', () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    const debug = jest.spyOn(Logger.prototype, 'debug').mockImplementation();
    const service = new NestLoggerService();
    service.warn('w', 'Ctx');
    service.log('l', 'Ctx');
    service.debug('d', 'Ctx');
    expect(warn).toHaveBeenCalledWith('w', 'Ctx');
    expect(log).toHaveBeenCalledWith('l', 'Ctx');
    expect(debug).toHaveBeenCalledWith('d', 'Ctx');
  });
});
