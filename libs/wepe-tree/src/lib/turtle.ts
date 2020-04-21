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

  /**
   * Turn the turtle left about the axis perpendicular to the direction it is facing
   */
  turnLeft(angle: number): void {
    this.turnRight(-angle);
  }

  /**
   * Pitch the turtle up about the right axis
   */
  pitchUp(angle: number): void {
    this.pitchDown(-angle);
  }

  /**
   * Pitch the turtle down about the right axis
   */
  pitchDown(angle: number): void {
    this.dir.rotateByQuaternionToRef(Quaternion.RotationAxis(this.right, angle), this.dir);
    this.dir.normalize();
  }

  /**
   * Roll the turtle right about the direction it is facing
   */
  rollRight(angle: number): void {
    this.rollLeft(-angle);
  }

  /**
   * Roll the turtle left about the direction it is facing
   */
  rollLeft(angle: number): void {
    this.right.rotateByQuaternionToRef(Quaternion.RotationAxis(this.dir, angle), this.right);
    this.right.normalize();
  }
}
