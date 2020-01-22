export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function rgbaToInt(rgba: Rgba): number {
  // tslint:disable:no-bitwise
  const r = rgba.r & 0xff;
  const g = rgba.g & 0xff;
  const b = rgba.b & 0xff;
  const a = rgba.a & 0xff;

  return ((r << 24) >>> 0) + (g << 16) + (b << 8) + a;
  // tslint:enable:no-bitwise
}

export function intToRgba(int: number): Rgba {
  // tslint:disable:no-bitwise
  return {
    r: (int >> 24) & 0xff,
    g: (int >> 16) & 0xff,
    b: (int >> 8) & 0xff,
    a: int & 0xff,
  };
  // tslint:enable:no-bitwise
}
