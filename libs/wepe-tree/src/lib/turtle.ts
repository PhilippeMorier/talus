import { Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector';

/**
 * 3D turtle implementation for use in parametric tree generation schemes
 */
export class Turtle {
  dir = new Vector3(0, 1, 0);
  pos = new Vector3(0, 0, 0);
  right = new Vector3(1, 0, 0);
  width = 0;

  /**
   * Turn the turtle right about the axis perpendicular to the direction it is facing
   */
  turnRight(angle: number): void {
    const axis = this.dir.cross(this.right);
    axis.normalize();

    const rotQuat = Quaternion.RotationAxis(axis, angle);

    this.dir.rotateByQuaternionToRef(rotQuat, this.dir);
    this.dir.normalize();
    this.right.rotateByQuaternionToRef(rotQuat, this.right);
    this.right.normalize();
  }

  turnLeft(angle: number): void {
    this.turnRight(-angle);
  }
}
