import { Grid } from '../grid';
import { DELTA } from '../math/math';
import { Ray, TimeSpan } from '../math/ray';
import { Vec3 } from '../math/vec3';
import { VolumeRayIntersector } from './ray-intersector';

describe('VolumeRayIntersector', () => {
  let grid: Grid;
  let ray: Ray;

  beforeEach(() => {
    grid = new Grid(-1);

    const eye = new Vec3(-1, 0, 0);
    const direction = new Vec3(1, 0, 0);
    ray = new Ray(eye, direction);
  });

  it('should march over one single leaf node', () => {
    grid.tree.setValueOn([0, 0, 0], 42);
    grid.tree.setValueOn([7, 7, 7], 42);

    const intersector = new VolumeRayIntersector(grid);
    expect(intersector.setIndexRay(ray)).toBeTruthy();
    expect(ray.t0).toEqual(DELTA);
    expect(ray.t1).toEqual(Number.MAX_SAFE_INTEGER);

    const timeSpanRef = TimeSpan.inf();
    expect(intersector.march(timeSpanRef)).toBeTruthy();
    expect(timeSpanRef.t0).toEqual(1);
    expect(timeSpanRef.t1).toEqual(9);
    expect(intersector.march(timeSpanRef)).toBeFalsy();
  });

  it('should march over two adjacent leaf nodes', () => {
    grid.tree.setValueOn([0, 0, 0], 42);
    grid.tree.setValueOn([8, 0, 0], 42);
    grid.tree.setValueOn([15, 7, 7], 42);

    const intersector = new VolumeRayIntersector(grid);
    expect(intersector.setIndexRay(ray)).toBeTruthy();

    const timeSpanRef = TimeSpan.inf();
    expect(intersector.march(timeSpanRef)).toBeTruthy();
    expect(timeSpanRef.t0).toEqual(1);
    expect(timeSpanRef.t1).toEqual(17);
    expect(intersector.march(timeSpanRef)).toBeFalsy();
  });

  it('should march over two adjacent leafs followed by a gab and leaf', () => {
    grid.tree.setValueOn([0 * 8, 0, 0], 42);
    grid.tree.setValueOn([1 * 8, 0, 0], 42);
    grid.tree.setValueOn([3 * 8, 0, 0], 42);
    grid.tree.setValueOn([3 * 8 + 7, 7, 7], 42);

    const intersector = new VolumeRayIntersector(grid);
    expect(intersector.setIndexRay(ray)).toBeTruthy();

    const timeSpanRef = TimeSpan.inf();
    expect(intersector.march(timeSpanRef)).toBeTruthy();
    expect(timeSpanRef.t0).toEqual(1);
    expect(timeSpanRef.t1).toEqual(17);
    expect(intersector.march(timeSpanRef)).toBeTruthy();
    expect(timeSpanRef.t0).toEqual(25);
    expect(timeSpanRef.t1).toEqual(33);
    expect(intersector.march(timeSpanRef)).toBeFalsy();
  });
});
