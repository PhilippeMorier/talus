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
}

class TimeSpan {
  constructor(public t0: number, public t1: number) {}
}
