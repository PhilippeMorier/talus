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

export function minComponent(c1: Coord, c2: Coord): Coord {
  return [Math.min(c1[0], c2[0]), Math.min(c1[1], c2[1]), Math.min(c1[2], c2[2])];
}

export function maxComponent(c1: Coord, c2: Coord): Coord {
  return [Math.max(c1[0], c2[0]), Math.max(c1[1], c2[1]), Math.max(c1[2], c2[2])];
}

export function offsetBy(c: Coord, n: number): Coord {
  return [c[0] + n, c[1] + n, c[2] + n];
}

/**
 * Return true if any of the components of `a` are smaller than the
 * corresponding components of `b`.
 */
export function lessThan(a: Coord, b: Coord): boolean {
  return a[0] < b[0] || a[1] < b[1] || a[2] < b[2];
}

export class CoordBBox {
  constructor(public min: Coord = createMaxCoord(), public max: Coord = createMinCoord()) {}

  /**
   * Union this bounding box with the cubical bounding box
   * of the given size and with the given minimum coordinates.
   */
  expand(min: Coord, dim: number): void {
    this.min = minComponent(this.min, min);
    this.max = maxComponent(this.max, offsetBy(min, dim - 1));
  }

  /**
   * Return true if the given bounding box is inside this bounding box.
   */
  isInside(box: CoordBBox): boolean {
    return !(lessThan(box.min, this.min) || lessThan(this.max, box.max));
  }
}
