import { isPowerOfTwo } from './math';

export const X = 0;
export const Y = 1;
export const Z = 2;

export type Vector3 = [number, number, number];

export function add3(a: Vector3, b: Vector3): Vector3 {
  return [a[X] + b[X], a[Y] + b[Y], a[Z] + b[Z]];
}

export function sub3(a: Vector3, b: Vector3): Vector3 {
  return [a[X] - b[X], a[Y] - b[Y], a[Z] - b[Z]];
}

export function mul3(a: Vector3, b: Vector3): Vector3 {
  return [a[X] * b[X], a[Y] * b[Y], a[Z] * b[Z]];
}

export function isPowerOfTwo3(a: Vector3): boolean {
  return isPowerOfTwo(a[X]) && isPowerOfTwo(a[Y]) && isPowerOfTwo(a[Z]);
}
