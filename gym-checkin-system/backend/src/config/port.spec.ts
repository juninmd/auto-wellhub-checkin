import { DEFAULT_PORT, resolvePort } from './port';

describe('resolvePort', () => {
  it('usa 3000 quando PORT não está definida ou está vazia', () => {
    expect(resolvePort({})).toBe(DEFAULT_PORT);
    expect(resolvePort({ PORT: '  ' })).toBe(DEFAULT_PORT);
  });

  it('aceita uma porta válida', () => {
    expect(resolvePort({ PORT: '8080' })).toBe(8080);
  });

  it.each(['abc', '0', '65536', '-1', '80.5'])('recusa PORT=%s em vez de subir numa porta errada', (value) => {
    expect(() => resolvePort({ PORT: value })).toThrow('PORT deve ser um inteiro');
  });
});
