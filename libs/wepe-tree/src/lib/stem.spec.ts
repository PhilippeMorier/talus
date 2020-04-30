import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { BezierPoint, radiusAtOffset, scaleBezierHandlesForFlare, Stem } from './stem';

describe('Stem', () => {
  it('should calculate radius at offset', () => {
    const stem = new Stem(4);
    stem.length = 3;
    stem.radius = 7;
    const z1 = 5;

    expect(radiusAtOffset(stem, z1, 0.5, 0.6)).toEqual(-10.5);
    expect(radiusAtOffset(stem, z1, 1.5, 0.6)).toEqual(10.392304845413264);
    expect(radiusAtOffset(stem, z1, -1, 0.6)).toEqual(42);
    expect(radiusAtOffset(stem, z1, -2, 0.6)).toEqual(77);
    expect(radiusAtOffset(stem, z1, 2, 0.6)).toEqual(4.898979485566356);
  });

  it('should scale bezier handles for flare', () => {
    const stem = new Stem(4);
    const point = new BezierPoint();
    point.controlPoint = new Vector3(2, 2, 2);
    point.handleLeft = new Vector3(6, 2, 4);
    point.handleRight = new Vector3(10, 4, 8);
    stem.bezierPoints.push(point);

    scaleBezierHandlesForFlare(stem, 2);

    expect(stem.bezierPoints[0].handleLeft.x).toEqual(4);
    expect(stem.bezierPoints[0].handleLeft.y).toEqual(2);
    expect(stem.bezierPoints[0].handleLeft.z).toEqual(3);

    expect(stem.bezierPoints[0].handleRight.x).toEqual(6);
    expect(stem.bezierPoints[0].handleRight.y).toEqual(3);
    expect(stem.bezierPoints[0].handleRight.z).toEqual(5);
  });
});
