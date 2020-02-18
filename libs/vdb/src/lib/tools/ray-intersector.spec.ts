import { Coord } from '@talus/vdb';
import { Grid } from '../grid';
import { DDA } from '../math/dda';
import { DELTA } from '../math/math';
import { Ray, TimeSpan } from '../math/ray';
import { Vec3 } from '../math/vec3';
import { Voxel } from '../tree/voxel';
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

  it('should get all voxel coordinates', () => {
    const expectedCoords: Coord[] = [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [2, 1, 0],
      [2, 2, 0],
      [3, 2, 0],
      [3, 3, 0],
      [4, 3, 0],
      [5, 3, 0],
      [5, 4, 0],
      [6, 4, 0],
      [6, 5, 0],
      [7, 5, 0],
      [7, 6, 0],
      [8, 6, 0],
    ];
    // ...xx
    // ..xx.
    // .xx..
    // xx...
    grid.tree.setValueOn(expectedCoords[0], 42);
    grid.tree.setValueOn(expectedCoords[1], 42);
    grid.tree.setValueOn(expectedCoords[2], 42);
    grid.tree.setValueOn(expectedCoords[3], 42);
    grid.tree.setValueOn(expectedCoords[4], 42);
    grid.tree.setValueOn(expectedCoords[5], 42);
    grid.tree.setValueOn(expectedCoords[6], 42);
    grid.tree.setValueOn(expectedCoords[7], 42);

    const eye = new Vec3(-5, -4, 0);
    const direction = new Vec3(5, 4, 0);
    ray = new Ray(eye, direction);

    const intersector = new VolumeRayIntersector(grid);
    expect(intersector.setIndexRay(ray)).toBeTruthy();

    const timeSpanRef = TimeSpan.inf();
    expect(intersector.march(timeSpanRef)).toBeTruthy();
    expect(timeSpanRef.t0).toEqual(1);
    expect(timeSpanRef.t1).toEqual(2.6);

    const dda = new DDA(Voxel.LOG2DIM);
    dda.init(ray, timeSpanRef.t0, timeSpanRef.t1);

    let counter = 0;
    do {
      expect(dda.getVoxel()).toEqual(expectedCoords[counter]);
      counter++;
    } while (dda.nextStep());
    expect(counter).toEqual(expectedCoords.length);

    expect(intersector.march(timeSpanRef)).toBeFalsy();
  });
});
