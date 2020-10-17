/**
 * @deprecated: Use simple `number` for accessing (i.e. coord.x) for performance reason.
 */
export const X = 0;
/**
 * @deprecated: Use simple `number` for accessing (i.e. coord.y) for performance reason.
 */
export const Y = 1;
/**
 * @deprecated: Use simple `number` for accessing (i.e. coord.z) for performance reason.
 */
export const Z = 2;

// Make interface, don't use constructor due performance impact
export class Coord {
  constructor(public x: number, public y: number, public z: number) {}
}

export function toKey(coord: Coord): string {
  return `${JSON.stringify(coord)}`;
}

export function add(c1: Coord, c2: Coord): Coord {
  return { x: c1.x + c2.x, y: c1.y + c2.y, z: c1.z + c2.z };
}

export function createMaxCoord(): Coord {
  return { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER, z: Number.MAX_SAFE_INTEGER };
}

export function createMinCoord(): Coord {
  return { x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER, z: Number.MIN_SAFE_INTEGER };
}

export function areEqual(c1: Coord, c2: Coord): boolean {
  return c1.x === c2.x && c1.y === c2.y && c1.z === c2.z;
}

export function clone(c: Coord): Coord {
  return { x: c.x, y: c.y, z: c.z };
}

export function floor(c: Coord): Coord {
  return { x: Math.floor(c.x), y: Math.floor(c.y), z: Math.floor(c.z) };
}

export function removeFraction(coordRef: Coord): void {
  coordRef.x = coordRef.x << 0;
  coordRef.y = coordRef.y << 0;
  coordRef.z = coordRef.z << 0;
}

export function minComponent(c1: Coord, c2: Coord): Coord {
  return { x: Math.min(c1.x, c2.x), y: Math.min(c1.y, c2.y), z: Math.min(c1.z, c2.z) };
}

export function maxComponent(c1: Coord, c2: Coord): Coord {
  return { x: Math.max(c1.x, c2.x), y: Math.max(c1.y, c2.y), z: Math.max(c1.z, c2.z) };
}

export function offset(coordRef: Coord, n: number): void {
  coordRef.x += n;
  coordRef.y += n;
  coordRef.z += n;
}

export function offsetBy(c: Coord, n: number): Coord {
  return { x: c.x + n, y: c.y + n, z: c.z + n };
}

/**
 * Return true if any of the components of `a` are smaller than the
 * corresponding components of `b`.
 */
export function lessThan(a: Coord, b: Coord): boolean {
  return a.x < b.x || a.y < b.y || a.z < b.z;
}

export class CoordBBox {
  static createCube(min: Coord, dim: number): CoordBBox {
    return new CoordBBox(min, offsetBy(min, dim - 1));
  }

  /**
   * Return an "infinite" bounding box, as defined by the Coord value range.
   */
  static inf(): CoordBBox {
    return new CoordBBox(createMinCoord(), createMaxCoord());
  }

  constructor(public min: Coord = createMaxCoord(), public max: Coord = createMinCoord()) {}

  /**
   * Union this bounding box with the cubical bounding box
   * of the given size and with the given minimum coordinates.
   */
  expand(coordOrBox: Coord | CoordBBox, dim?: number): void {
    if (coordOrBox instanceof CoordBBox) {
      this.min = minComponent(this.min, coordOrBox.min);
      this.max = maxComponent(this.max, coordOrBox.max);
    } else if (dim === undefined) {
      this.min = minComponent(this.min, coordOrBox);
      this.max = maxComponent(this.max, coordOrBox);
    } else {
      this.min = minComponent(this.min, coordOrBox);
      this.max = maxComponent(this.max, offsetBy(coordOrBox, dim - 1));
    }
  }

  /**
   * Return true if the given bounding box is inside this bounding box.
   */
  isInside(box: CoordBBox): boolean {
    return !(lessThan(box.min, this.min) || lessThan(this.max, box.max));
  }

  reset(): void {
    this.min = createMaxCoord();
    this.max = createMinCoord();
  }
  /**
   * @brief Translate this bounding box by (t.x, t.y, t.z).
   */
  translate(t: Coord): void {
    add(this.min, t);
    add(this.max, t);
  }
}
