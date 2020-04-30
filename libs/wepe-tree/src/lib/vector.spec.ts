import { Vector3 } from '@babylonjs/core';
import { BezierPoint } from './stem';
import { calcPointOnBezier } from './vector';

describe('Vector', () => {
  it.each([
    [0.1, 2.601, 3.545, 4.489],
    [0.5, 6.125, 6.125, 6.125],
  ])(
    'should calculate point on Bezier with offset of %f',
    (offset: number, x: number, y: number, z: number) => {
      const start = new BezierPoint(
        new Vector3(1, 2, 3),
        new Vector3(4, 5, 6),
        new Vector3(7, 8, 9),
      );
      const end = new BezierPoint(new Vector3(9, 8, 7), new Vector3(6, 5, 4), new Vector3(3, 2, 1));

      const result = calcPointOnBezier(offset, start, end);

      expect(result.x).toBeCloseTo(x);
      expect(result.y).toBeCloseTo(y);
      expect(result.z).toBeCloseTo(z);
    },
  );

  it.each([[-0.1], [1.1]])(
    'should throw when calculating point on Bezier with offset of %f',
    (offset: number) => {
      expect(() => calcPointOnBezier(offset, new BezierPoint(), new BezierPoint())).toThrow();
    },
  );
});
