import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export class Leaf {
  constructor(public position: Vector3, public direction: Vector3, public right: Vector3) {}
}
