import { CoordBBox } from './coord';
import { DELTA } from './math';
import { Vec3 } from './vec3';

export class Ray {
  private timeSpan: TimeSpan;

  invDir: Vec3;

  constructor(
    public eye: Vec3 = new Vec3(0, 0, 0),
    public dir: Vec3 = new Vec3(1, 0, 0),
    t0: number = DELTA,
    t1: number = Number.MAX_SAFE_INTEGER,
  ) {
    this.invDir = dir.divide(1);
    this.timeSpan = new TimeSpan(t0, t1);
  }

  get t0(): number {
    return this.timeSpan.t0;
  }

  get t1(): number {
    return this.timeSpan.t1;
  }

  /**
   * Return the position along the ray at the specified time.
   */
  calcPositionAlongRayAtTime(time: number): Vec3 {
    return this.eye.add(this.dir.multiplyByScalar(time));
  }

  /**
   * @brief Return @c true if t1 is larger than t0 by at least eps.
   */
  valid(eps: number = DELTA): boolean {
    return this.timeSpan.valid(eps);
  }

  /**
   * Return true if this ray intersects the specified bounding box.
   * For intersection this ray is clipped to the two intersection points.
   * bbox Axis-aligned bounding box in the same space as this ray.
   */
  clip(bbox: CoordBBox): boolean {
    // Dummy initialisation to be able to pass reference
    const timeSpanRef = TimeSpan.inf();

    const hit = this.intersects(bbox, timeSpanRef);
    if (hit) {
      this.timeSpan.set(timeSpanRef.t0, timeSpanRef.t1);
    }

    return hit;
  }

  /**
   * Return true if the Ray intersects the specified
   * axisaligned bounding box.
   * @param bbox Axis-aligned bounding box in the same space as the Ray.
   * @param timeSpanRef
   *  If an intersection is detected t0 is assigned
   *  the time for the first intersection point.
   *  If an intersection is detected t1 is assigned
   *  the time for the second intersection point.
   */
  intersects(bbox: CoordBBox, timeSpanRef: TimeSpan): boolean {
    timeSpanRef.set(this.timeSpan.t0, this.timeSpan.t1);

    for (let i = 0; i < 3; i++) {
      let a = (bbox.min[i] - this.eye[i]) * this.invDir[i];
      let b = (bbox.max[i] - this.eye[i]) * this.invDir[i];

      if (a > b) {
        [a, b] = [b, a];
      }
      if (a > timeSpanRef.t0) {
        timeSpanRef.t0 = a;
      }
      if (b < timeSpanRef.t1) {
        timeSpanRef.t1 = b;
      }
      if (timeSpanRef.t0 > timeSpanRef.t1) {
        return false;
      }
    }

    return true;
  }

  setTimes(t0: number = DELTA, t1: number = Number.MAX_SAFE_INTEGER): void {
    if (t0 <= 0 || t1 <= 0) {
      throw new Error('t0 and t1 are not bigger than 0.');
    }

    this.timeSpan.set(t0, t1);
  }
}

export class TimeSpan {
  static inf(): TimeSpan {
    return new TimeSpan(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  }

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
