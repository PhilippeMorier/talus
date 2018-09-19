import { isPowerOfTwo } from './math';

export const X = 0;
export const Y = 1;
export const Z = 2;

export type Vector3 = [number, number, number];

export function sub3(a: Vector3, b: Vector3): Vector3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function isPowerOfTwo3(a: Vector3): boolean {
  return isPowerOfTwo(a[X]) && isPowerOfTwo(a[Y]) && isPowerOfTwo(a[Z]);
}
