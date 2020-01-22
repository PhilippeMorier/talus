import { intToRgba, Rgba, rgbaToInt } from './rgba.value';

describe('Rgba', () => {
  it.each([
    [
      Math.pow(2, 8),
      {
        r: 0,
        g: 0,
        b: 1,
        a: 0,
      },
    ],
    [
      Math.pow(2, 8) - 1,
      {
        r: 0,
        g: 0,
        b: 0,
        a: 255,
      },
    ],
    [
      Math.pow(2, 16),
      {
        r: 0,
        g: 1,
        b: 0,
        a: 0,
      },
    ],
    [
      Math.pow(2, 16) - 1,
      {
        r: 0,
        g: 0,
        b: 255,
        a: 255,
      },
    ],
    [
      Math.pow(2, 24),
      {
        r: 1,
        g: 0,
        b: 0,
        a: 0,
      },
    ],
    [
      Math.pow(2, 24) - 1,
      {
        r: 0,
        g: 255,
        b: 255,
        a: 255,
      },
    ],
    [
      Math.pow(2, 32) - 1,
      {
        r: 255,
        g: 255,
        b: 255,
        a: 255,
      },
    ],
  ])('should convert integer to `rgba` and back', (int: number, expectedRgba: Rgba) => {
    const rgba = intToRgba(int);

    expect(rgba).toEqual(expectedRgba);
    expect(int).toEqual(rgbaToInt(rgba));
  });
});
