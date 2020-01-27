import { Vec3 } from './vec3';

describe('Vec3', () => {
  it('should return value if accessed via index operator', () => {
    const vec3 = new Vec3(1, 2, 3);

    expect(vec3[0]).toEqual(1);
    expect(vec3[1]).toEqual(2);
    expect(vec3[2]).toEqual(3);

    expect(vec3[0]).toEqual(vec3.x);
    expect(vec3[1]).toEqual(vec3.y);
    expect(vec3[2]).toEqual(vec3.z);
  });

  it('should set x, y, z via index operator', () => {
    const vec3 = new Vec3(1, 2, 3);

    vec3[0] = 4;
    vec3[1] = 5;
    vec3[2] = 6;

    expect(vec3.x).toEqual(4);
    expect(vec3.y).toEqual(5);
    expect(vec3.z).toEqual(6);

    expect(vec3[0]).toEqual(vec3.x);
    expect(vec3[1]).toEqual(vec3.y);
    expect(vec3[2]).toEqual(vec3.z);
  });

  it.each([
    [new Vec3(-1, 2, 0), 0],
    [new Vec3(-1, -2, 0), 1],
    [new Vec3(5, 2, 0), 2],
    [new Vec3(0, 0, 1), 1],
    [new Vec3(1, 0, 0), 2],
    [new Vec3(0, 1, 0), 2],
    [new Vec3(1, 1, 0), 2],
    [new Vec3(1, 0, 1), 1],
    [new Vec3(0, 1, 1), 0],
    [new Vec3(1, 1, 1), 2],
  ])('should return index of smallest value', (vec3, minIndex) => {
    expect(vec3.minIndex()).toEqual(minIndex);
  });
});
