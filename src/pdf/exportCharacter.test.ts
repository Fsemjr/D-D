import { describe, expect, it } from 'vitest';
import { detectImageFormat } from './exportCharacter';

describe('formato do retrato', () => {
  it.each([
    ['data:image/png;base64,abc', 'PNG'],
    ['data:image/jpeg;base64,abc', 'JPEG'],
    ['data:image/jpg;base64,abc', 'JPEG'],
    ['data:image/webp;base64,abc', 'WEBP'],
  ])('detecta %s', (dataUrl, expected) => expect(detectImageFormat(dataUrl)).toBe(expected));
  it('rejeita formatos desconhecidos', () => expect(detectImageFormat('data:image/gif;base64,abc')).toBeUndefined());
});
