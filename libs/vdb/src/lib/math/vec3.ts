import { Coord } from './coord';

export class Vec3 {
  static get Zero(): Vec3 {
    return new Vec3(0, 0, 0);
  }

  get [0](): number {
    return this.x;
  }
  set [0](x: number) {
    this.x = x;
  }

  get [1](): number {
    return this.y;
  }
  set [1](y: number) {
    this.y = y;
  }

  get [2](): number {
    return this.z;
  }
  set [2](z: number) {
    this.z = z;
  }

  constructor(public x: number, public y: number, public z: number) {}

  divide(scalar: number): Vec3 {
    return new Vec3(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  multiply(vector: Vec3): Vec3 {
    return new Vec3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
  }

  multiplyByScalar(scalar: number): Vec3 {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  toCoord(): Coord {
    return [this.x, this.y, this.z];
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
  minIndex(): 0 | 1 | 2 {
    const dummyValue = 0;
    const hashTable: (0 | 1 | 2)[] = [2, 1, dummyValue, 1, 2, dummyValue, 0, 0];

    const xLtY = Number(this.x < this.y);
    const xLtZ = Number(this.x < this.z);
    const yLtZ = Number(this.y < this.z);

    const hashKey = (xLtY << 2) + (xLtZ << 1) + yLtZ; // ?*4+?*2+?*1

    return hashTable[hashKey];
  }
}
