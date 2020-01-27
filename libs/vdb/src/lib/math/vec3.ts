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
}
