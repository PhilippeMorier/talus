/**
 * @deprecated: Use simple `number` for accessing (i.e. coord[0]) for performance reason.
 */
export const X = 0;
/**
 * @deprecated: Use simple `number` for accessing (i.e. coord[1]) for performance reason.
 */
export const Y = 1;
/**
 * @deprecated: Use simple `number` for accessing (i.e. coord[2]) for performance reason.
 */
export const Z = 2;

export type Coord = [number, number, number];

export function add(c1: Coord, c2: Coord): Coord {
  return [c1[0] + c2[0], c1[1] + c2[1], c1[2] + c2[2]];
}

export function createMaxCoord(): Coord {
  return [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
}

export function createMinCoord(): Coord {
  return [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE];
}

export function areEqual(c1: Coord, c2: Coord): boolean {
  return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2];
}

export function clone(c: Coord): Coord {
  return [c[0], c[1], c[2]];
}

export function floor(c: Coord): Coord {
  return [Math.floor(c[0]), Math.floor(c[1]), Math.floor(c[2])];
}
