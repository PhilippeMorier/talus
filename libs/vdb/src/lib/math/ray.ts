import { DELTA } from './math';
import { Vec3 } from './vec3';

export class Ray {
  private timeSpan: TimeSpan;

  invDir: Vec3;

  constructor(
    public eye: Vec3 = new Vec3(0, 0, 0),
    public dir: Vec3 = new Vec3(1, 0, 0),
    public t0: number = DELTA,
    public t1: number = Number.MAX_SAFE_INTEGER,
  ) {
    this.invDir = dir.divide(1);
    this.timeSpan = new TimeSpan(t0, t1);
  }

  /**
   * Return the position along the ray at the specified time.
   */
  calcPositionAlongRayAtTime(time: number): Vec3 {
    return this.eye.multiply(this.dir).multiplyByScalar(time);
  }

  /**
   * @brief Return @c true if t1 is larger than t0 by at least eps.
   */
  valid(eps: number = DELTA): boolean {
    return this.timeSpan.valid(eps);
  }
}

export class TimeSpan {
  constructor(public t0: number, public t1: number) {}

  /**
   * @brief Return @c true if t1 is larger than t0 by at least eps.
   */
  valid(eps: number = DELTA): boolean {
    return this.t1 - this.t0 > eps;
  }

  /**
   * @brief Set both times
   */
  set(t0: number, t1: number): void {
    this.t0 = t0;
    this.t1 = t1;
  }
}
