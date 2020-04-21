import { Curve3 } from '@babylonjs/core/Maths/math.path';

/**
 * Class to store data for each stem (branch) in the system, primarily to be accessed
 * by its children in calculating their own parameters
 */
export class Stem {
  length = 0;
  lengthChildMax = 0;
  radius = 0;

  /**
   * Init with at depth with curve, possibly parent and offset (for depth > 0)
   */
  constructor(
    public depth: number,
    private curve?: Curve3,
    public parent?: Stem,
    public offset: number = 0,
    public radiusLimit: number = -1,
  ) {}
}
