export const X = 0;
export const Y = 1;
export const Z = 2;

export type Coord = [number, number, number];

export function createMaxCoord(): Coord {
  return [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
}

export function createMinCoord(): Coord {
  return [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE];
}
