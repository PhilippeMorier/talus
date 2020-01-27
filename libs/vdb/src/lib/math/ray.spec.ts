import { Ray } from './ray';
import { Vec3 } from './vec3';

describe('Ray', () => {
  it('should calculate position along the ray at the specified time', () => {
    const eye = new Vec3(1, 2, 3);
    const dir = new Vec3(4, 5, 6);
    const ray = new Ray(eye, dir);

    expect(ray.calcPositionAlongRayAtTime(2)).toEqual(new Vec3(1 * 4 * 2, 2 * 5 * 2, 3 * 6 * 2));
  });
});
