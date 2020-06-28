import { Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Tools } from '@babylonjs/core/Misc/tools';
import { randomInRange } from './random';

/**
 * Apply tropismVector to turtle direction
 */
export function applyTropism(turtle: Turtle, tropismVector: Vector3): void {
  const hCrossT = turtle.dir.cross(tropismVector);

  // calc angle to rotate by (from ABoP) multiply to achieve accurate results from WP attractionUp param
  const alpha = 10 * hCrossT.length();
  hCrossT.normalize();

  // rotate by angle about axis perpendicular to turtle direction and tropism vector
  const rotQuat = Quaternion.RotationAxis(hCrossT, Tools.ToRadians(alpha));

  turtle.dir.rotateByQuaternionToRef(rotQuat, turtle.dir);
  turtle.dir.normalize();
  turtle.right.rotateByQuaternionToRef(rotQuat, turtle.right);
  turtle.right.normalize();
}

/**
 * Calculates required points to produce helix bezier curve with given radius and
 * pitch in direction of turtle
 */
export function calcHelixPoints(
  turtle: Turtle,
  rad: number,
  pitch: number,
): [Vector3, Vector3, Vector3, Vector3] {
  // simplifies greatly for case incAngle = 90
  const points = [
    new Vector3(0, -rad, -pitch / 4),
    new Vector3((4 * rad) / 3, -rad, 0),
    new Vector3((4 * rad) / 3, rad, 0),
    new Vector3(0, rad, pitch / 4),
  ];

  // align helix points to turtle direction and randomize rotation around axis
  // https://blender.stackexchange.com/questions/19533/align-object-to-vector-using-python
  const trf = turtle.dir.toTrackQuat('Z', 'Y');
  const spinAng = randomInRange(0, 2 * Math.PI);
  const rotQuat = Quaternion.RotationAxis(new Vector3(0, 0, 1), spinAng);

  for (const p of points) {
    p.rotateByQuaternionToRef(rotQuat, p);
    p.rotateByQuaternionToRef(trf, p);
  }

  return [
    points[1].subtract(points[0]),
    points[2].subtract(points[0]),
    points[3].subtract(points[0]),
    turtle.dir.clone(),
  ];
}

/**
 * 3D turtle implementation for use in parametric tree generation schemes
 */
export class Turtle {
  // Turtle points by default up (+y)
  dir = new Vector3(0, 1, 0);
  pos = new Vector3(0, 0, 0);
  right = new Vector3(1, 0, 0);
  width = 0;

  constructor(toCloneTurtle?: Turtle) {
    if (toCloneTurtle) {
      this.dir = toCloneTurtle.dir.clone();
      this.pos = toCloneTurtle.pos.clone();
      this.right = toCloneTurtle.right.clone();
      this.width = toCloneTurtle.width;
    }
  }

  /**
   * Turn the turtle right about the axis perpendicular to the direction it is facing
   */
  turnRight(angle: number): void {
    const axis = this.dir.cross(this.right);
    axis.normalize();

    // https://doc.babylonjs.com/features/position,_rotation,_scaling#rotationquaternion
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

  /**
   * Move the turtle in the direction it is facing by specified distance
   */
  move(distance: number): void {
    this.pos.addInPlace(this.dir.multiplyByFloats(distance, distance, distance));
  }
}
