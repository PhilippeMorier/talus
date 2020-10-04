import { Vec3 } from './vec3';

describe('Vec3', () => {
  it.each([
    [new Vec3(-1, 2, 0), 'x'],
    [new Vec3(-1, -2, 0), 'y'],
    [new Vec3(5, 2, 0), 'z'],
    [new Vec3(0, 0, 1), 'y'],
    [new Vec3(1, 0, 0), 'z'],
    [new Vec3(0, 1, 0), 'z'],
    [new Vec3(1, 1, 0), 'z'],
    [new Vec3(1, 0, 1), 'y'],
    [new Vec3(0, 1, 1), 'x'],
    [new Vec3(1, 1, 1), 'z'],
  ])('should return index of smallest value', (vec3, minIndex) => {
    expect(vec3.minIndex()).toEqual(minIndex);
  });

  it('should add vector', () => {
    const vec3 = new Vec3(1, 2, 5);
    const toAdd = new Vec3(5, 2, 1);

    expect(vec3.add(toAdd)).toEqual(new Vec3(6, 4, 6));
  });

  it(`should divide scalar by the vector's components`, () => {
    const vec3 = new Vec3(1, 2, 5);

    expect(vec3.divide(1)).toEqual(new Vec3(1, 0.5, 0.2));
  });
});
