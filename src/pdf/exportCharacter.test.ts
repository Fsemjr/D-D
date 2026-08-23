import { describe, expect, it, vi } from 'vitest';
import type { jsPDF } from 'jspdf';
import { addPortraitToPdf, detectImageFormat } from './exportCharacter';

const images = [
  ['data:image/png;base64,abc', 'PNG'],
  ['data:image/jpeg;base64,abc', 'JPEG'],
  ['data:image/jpg;base64,abc', 'JPEG'],
  ['data:image/webp;base64,abc', 'WEBP'],
] as const;

describe('formato do retrato', () => {
  it.each(images)('detecta %s', (dataUrl, expected) => {
    expect(detectImageFormat(dataUrl)).toBe(expected);
  });

  it.each(images)('envia %s ao addImage com o formato correto', (dataUrl, expected) => {
    const addImage = vi.fn();
    const document = { addImage } as unknown as Pick<jsPDF, 'addImage'>;

    expect(addPortraitToPdf(document, dataUrl)).toBe(true);
    expect(addImage).toHaveBeenCalledOnce();
    expect(addImage).toHaveBeenCalledWith(
      dataUrl,
      expected,
      158,
      12,
      38,
      45,
      undefined,
      'FAST',
    );
  });

  it('não chama addImage para formatos desconhecidos ou retrato ausente', () => {
    const addImage = vi.fn();
    const document = { addImage } as unknown as Pick<jsPDF, 'addImage'>;

    expect(addPortraitToPdf(document, 'data:image/gif;base64,abc')).toBe(false);
    expect(addPortraitToPdf(document)).toBe(false);
    expect(addImage).not.toHaveBeenCalled();
  });
});
