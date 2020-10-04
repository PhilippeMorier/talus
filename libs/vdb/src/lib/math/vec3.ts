import { Coord } from './coord';

export class Vec3 {
  static get Zero(): Vec3 {
    return new Vec3(0, 0, 0);
  }

  static Axes: ['x', 'y', 'z'] = ['x', 'y', 'z'];

  get ['x'](): number {
    return this.x;
  }
  set ['x'](x: number) {
    this.x = x;
  }

  get ['y'](): number {
    return this.y;
  }
  set ['y'](y: number) {
    this.y = y;
  }

  get ['z'](): number {
    return this.z;
  }
  set ['z'](z: number) {
    this.z = z;
  }

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  divide(scalar: number): Vec3 {
    return new Vec3(scalar / this.x, scalar / this.y, scalar / this.z);
  }

  multiply(vector: Vec3): Vec3 {
    return new Vec3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
  }

  add(vector: Vec3): Vec3 {
    return new Vec3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  multiplyByScalar(scalar: number): Vec3 {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  toCoord(): Coord {
    return this;
  }

  /**
   * @brief Return the index [0,1,2] of the smallest value in a 3D vector.
   * @note This methods assumes operator[] exists and avoids branching.
   * @details If two components of the input vector are equal and smaller than the
   * third component, the largest index of the two is always returned.
   * If all three vector components are equal the largest index, i.e. 2, is
   * returned. In other words the return value corresponds to the largest index
   * of the of the smallest vector components.
   */
  minIndex(): 'x' | 'y' | 'z' {
    const dummyValue = 'x';
    const hashTable: ('x' | 'y' | 'z')[] = ['z', 'y', dummyValue, 'y', 'z', dummyValue, 'x', 'x'];

    const xLtY = Number(this.x < this.y);
    const xLtZ = Number(this.x < this.z);
    const yLtZ = Number(this.y < this.z);

    const hashKey = (xLtY << 2) + (xLtZ << 1) + yLtZ; // ?*4+?*2+?*1

    return hashTable[hashKey];
  }
}
