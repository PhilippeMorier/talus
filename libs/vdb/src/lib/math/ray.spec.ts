import { Ray, TimeSpan } from './ray';
import { Vec3 } from './vec3';

describe('Ray', () => {
  it('should calculate position along the ray at the specified time', () => {
    const eye = new Vec3(1, 2, 3);
    const dir = new Vec3(4, 5, 6);
    const ray = new Ray(eye, dir);

    expect(ray.calcPositionAlongRayAtTime(2)).toEqual(new Vec3(1 * 4 * 2, 2 * 5 * 2, 3 * 6 * 2));
  });
});

describe('TimeSpan', () => {
  it('should be valid', () => {
    const timeSpan = new TimeSpan(1, 2);

    expect(timeSpan.valid()).toBeTruthy();
  });

  it('should be invalid if t0 === t1', () => {
    const timeSpan = new TimeSpan(1, 1);

    expect(timeSpan.valid()).toBeFalsy();
  });

  it('should be invalid if t0 === t1 + DELTA', () => {
    const timeSpan = new TimeSpan(1000, 1001);

    expect(timeSpan.valid(1)).toBeFalsy();
  });

  it('should set both times', () => {
    const timeSpan = new TimeSpan(1, 2);

    timeSpan.set(3, 4);

    expect(timeSpan.t0).toEqual(3);
    expect(timeSpan.t1).toEqual(4);
  });
});
