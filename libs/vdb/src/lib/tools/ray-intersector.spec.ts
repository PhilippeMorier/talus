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
    grid.tree.setValueOn({ x: 0, y: 0, z: 0 }, 42);
    grid.tree.setValueOn({ x: 7, y: 7, z: 7 }, 42);

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
    grid.tree.setValueOn({ x: 0, y: 0, z: 0 }, 42);
    grid.tree.setValueOn({ x: 8, y: 0, z: 0 }, 42);
    grid.tree.setValueOn({ x: 15, y: 7, z: 7 }, 42);

    const intersector = new VolumeRayIntersector(grid);
    expect(intersector.setIndexRay(ray)).toBeTruthy();

    const timeSpanRef = TimeSpan.inf();
    expect(intersector.march(timeSpanRef)).toBeTruthy();
    expect(timeSpanRef.t0).toEqual(1);
    expect(timeSpanRef.t1).toEqual(17);
    expect(intersector.march(timeSpanRef)).toBeFalsy();
  });

  it('should march over two adjacent leafs followed by a gab and leaf', () => {
    grid.tree.setValueOn({ x: 0 * 8, y: 0, z: 0 }, 42);
    grid.tree.setValueOn({ x: 1 * 8, y: 0, z: 0 }, 42);
    grid.tree.setValueOn({ x: 3 * 8, y: 0, z: 0 }, 42);
    grid.tree.setValueOn({ x: 3 * 8 + 7, y: 7, z: 7 }, 42);

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
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: 2, y: 1, z: 0 },
      { x: 2, y: 2, z: 0 },
      { x: 3, y: 2, z: 0 },
      { x: 3, y: 3, z: 0 },
      { x: 4, y: 3, z: 0 },
      { x: 5, y: 3, z: 0 },
      { x: 5, y: 4, z: 0 },
      { x: 6, y: 4, z: 0 },
      { x: 6, y: 5, z: 0 },
      { x: 7, y: 5, z: 0 },
      { x: 7, y: 6, z: 0 },
      { x: 8, y: 6, z: 0 },
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
