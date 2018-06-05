import { Voxel, World } from './world';
import { Vector3 } from './vector3';

describe('World', () => {
  let world: World;

  beforeEach(() => {
    world = new World([3, 3, 3], [4, 4, 4]);
  });

  it('should set/get a voxel', () => {
    const position: Vector3 = [2, 2, 2];
    const expectedVoxel = new Voxel(42);
    world.setVoxel(position, expectedVoxel);

    const voxel = world.getVoxel(position);
    expect(voxel).toEqual(expectedVoxel);
  });
});
