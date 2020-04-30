import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Tools } from '@babylonjs/core/Misc/tools';
import { BezierPoint } from './stem';

/**
 * Calculate declination of vector in degrees
 */
export function calcDeclination(vector: Vector3): number {
  // TODO: swap vector.y with vector.z?
  return Tools.ToDegrees(Math.atan2(Math.sqrt(vector.x ** 2 + vector.y ** 2), vector.z));
}

/**
 * Evaluate Bezier curve at offset between bezier_splinePoints startPoint and endPoint
 */
export function calcPointOnBezier(
  offset: number,
  startPoint: BezierPoint,
  endPoint: BezierPoint,
): Vector3 {
  if (offset < 0 || offset > 1) {
    throw new Error(`Offset out of range: ${offset} not between 0 and 1`);
  }

  const oneMinusOffset = 1 - offset;

  const res = startPoint.controlPoint
    .scale(oneMinusOffset ** 3)
    .add(startPoint.handleRight.scale(3 * oneMinusOffset ** 2 * offset))
    .add(endPoint.handleLeft.scale(3 * oneMinusOffset * offset ** 2))
    .add(endPoint.controlPoint.scale(offset ** 3));

  // initialize new vector to add subclassed methods
  // return Vector(res);
  return res;
}

/**
 * Calculate tangent to Bezier curve at offset between bezier_splinePoints startPoint and endPoint
 */
export function calcTangentToBezier(
  offset: number,
  startPoint: BezierPoint,
  endPoint: BezierPoint,
): Vector3 {
  if (offset < 0 || offset > 1) {
    throw new Error(`Offset out of range: ${offset} not between 0 and 1`);
  }

  const oneMinusOffset = 1 - offset;

  const startHandleRight = startPoint.handleRight;
  const endHandleLeft = endPoint.handleLeft;

  const res = startHandleRight
    .subtract(startPoint.controlPoint)
    .scale(3 * oneMinusOffset ** 2)
    .add(endHandleLeft.subtract(startHandleRight).scale(6 * oneMinusOffset * offset))
    .add(endPoint.controlPoint.subtract(endHandleLeft).scale(3 * offset ** 2));

  // initialize new vector to add subclassed methods
  // return Vector(res);
  return res;
}
