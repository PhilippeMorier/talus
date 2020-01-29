import { CoordBBox } from '@talus/vdb';
import { Ray, TimeSpan } from './ray';
import { Vec3 } from './vec3';

describe('Ray', () => {
  it('should calculate position along the ray at the specified time', () => {
    const eye = new Vec3(1, 2, 3);
    const dir = new Vec3(4, 5, 6);
    const ray = new Ray(eye, dir);

    const expected = new Vec3(41, 52, 63);

    expect(ray.calcPositionAlongRayAtTime(10)).toEqual(expected);
  });

  it('should intersect with box', () => {
    const box = new CoordBBox([3, 0, 0], [20, 5, 20]);
    const eye = new Vec3(-1, 0, 0);
    const dir = new Vec3(1, 0, 0);
    const ray = new Ray(eye, dir);
    const timeSpan = TimeSpan.inf();

    expect(ray.intersects(box, timeSpan)).toBeTruthy();
    expect(timeSpan.t0).toEqual(4);
    expect(timeSpan.t1).toEqual(21);
  });

  it('should clip intersecting ray', () => {
    const box = new CoordBBox([3, 0, 0], [20, 5, 20]);
    const eye = new Vec3(-1, 0, 0);
    const dir = new Vec3(1, 0, 0);
    const ray = new Ray(eye, dir);

    expect(ray.clip(box)).toBeTruthy();
    expect(ray.t0).toEqual(4);
    expect(ray.t1).toEqual(21);
  });

  it('should set timespan', () => {
    const eye = new Vec3(-1, 0, 0);
    const dir = new Vec3(1, 0, 0);
    const ray = new Ray(eye, dir);

    ray.setTimes(42, 24);

    expect(ray.t0).toEqual(42);
    expect(ray.t1).toEqual(24);
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
