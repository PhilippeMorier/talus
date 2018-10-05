import { add3, isPowerOfTwo3, mul3, sub3, Vector3 } from './vector3';

describe('Vector3', () => {
  let a: Vector3;
  let b: Vector3;

  beforeEach(() => {
    a = [1, 2, 3];
    b = [0, 1, 3];
  });

  it('should add vectors', () => {
    expect(add3(a, b)).toEqual([1, 3, 6]);
  });

  it('should sub vectors', () => {
    expect(sub3(a, b)).toEqual([1, 1, 0]);
  });

  it('should add vectors', () => {
    expect(mul3(a, b)).toEqual([0, 2, 9]);
  });

  fit('should check vector to be a power of two', () => {
    expect(isPowerOfTwo3([0, 0, 0])).toBeTruthy();

    expect(isPowerOfTwo3([0, 0, 1])).toBeTruthy();
    expect(isPowerOfTwo3([0, 2, 0])).toBeTruthy();
    expect(isPowerOfTwo3([4, 0, 0])).toBeTruthy();

    expect(isPowerOfTwo3([0, 0, 3])).toBeFalsy();
    expect(isPowerOfTwo3([0, 5, 0])).toBeFalsy();
    expect(isPowerOfTwo3([7, 0, 0])).toBeFalsy();
  });
});
