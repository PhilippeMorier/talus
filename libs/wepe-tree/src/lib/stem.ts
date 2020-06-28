import { Vector3 } from '@babylonjs/core/Maths/math.vector';

/**
 * Class to store data for each stem (branch) in the system, primarily to be accessed
 * by its children in calculating their own parameters
 */
export class Stem {
  length = 0;
  lengthChildMax = 0;
  radius = 0;
  bezierPoints: BezierPoint[] = [];

  /**
   * Init with at depth with curve, possibly parent and offset (for depth > 0)
   */
  constructor(
    public depth: number,
    // `bezierPoints` are used in place of a Blender Curve/Spline
    // public curve: Curve3 = new Curve3([Vector3.Zero()]),
    public parent?: Stem,
    public offset: number = 0,
    public radiusLimit: number = -1,
  ) {}

  /**
   * Copy method for stems
   */
  copy(): Stem {
    const newStem = new Stem(
      this.depth,
      /*this.curve,*/ this.parent,
      this.offset,
      this.radiusLimit,
    );
    newStem.length = this.length;
    newStem.radius = this.radius;
    newStem.lengthChildMax = this.lengthChildMax;

    return newStem;
  }
}

export class BezierPoint {
  radius: number;

  constructor(
    public controlPoint: Vector3 = Vector3.Zero(),
    public handleLeft: Vector3 = Vector3.Zero(),
    public handleRight: Vector3 = Vector3.Zero(),
  ) {}
}

/**
 * calculate radius of stem at offset z1 along it
 */
// TODO: rename z1 to y1?
export function radiusAtOffset(stem: Stem, z1: number, nTaper: number, flare: number): number {
  let unitTaper: number;
  if (nTaper < 1) {
    unitTaper = nTaper;
  } else if (nTaper < 2) {
    unitTaper = 2 - nTaper;
  } else {
    unitTaper = 0;
  }

  const taper = stem.radius * (1 - unitTaper * z1);

  let radius: number;
  let depth: number;
  let z3: number;

  if (nTaper < 1) {
    radius = taper;
  } else {
    const z2 = (1 - z1) * stem.length;
    if (nTaper < 2 || z2 < taper) {
      depth = 1;
    } else {
      depth = nTaper - 2;
    }

    if (nTaper < 2) {
      z3 = z2;
    } else {
      z3 = Math.abs(z2 - 2 * taper * Math.trunc(z2 / (2 * taper) + 0.5));
    }

    if (nTaper < 2 && z3 >= taper) {
      radius = taper;
    } else {
      radius =
        (1 - depth) * taper + depth * Math.sqrt(Math.pow(taper, 2) - Math.pow(z3 - taper, 2));
    }
  }

  if (stem.depth === 0) {
    const yVal = Math.max(0, 1 - 8 * z1);
    flare = flare * ((Math.pow(100, yVal) - 1) / 100) + 1;
    radius *= flare;
  }

  return radius;
}

/**
 * Reduce length of bezier handles to account for increased density of points on curve for
 * flared base of trunk
 */
export function scaleBezierHandlesForFlare(stem: Stem, maxPointsPerSeg: number): void {
  for (const point of stem.bezierPoints) {
    point.handleLeft = point.controlPoint.add(
      point.handleLeft.subtract(point.controlPoint).scale(1 / maxPointsPerSeg),
    );
    point.handleRight = point.controlPoint.add(
      point.handleRight.subtract(point.controlPoint).scale(1 / maxPointsPerSeg),
    );
  }
}
