import { Voxel, VoxelResult, World } from './world';
import { Vector3 } from './vector3';

describe('world', () => {
  let world: World;

  beforeEach(() => {
    world = new World([3, 3, 3], [4, 4, 4]);
  });

  it('should set & get a voxel', () => {
    const position: Vector3 = [2, 2, 2];
    const expectedVoxel = new Voxel(1, 42);
    world.setVoxel(position, expectedVoxel);

    const voxel = world.getVoxel(position);
    expect(voxel).toEqual(expectedVoxel);
  });

  it('should iterate over given volume', () => {
    const iterator = world.iterate([3, 3, 3], [4, 4, 4]);
    const expectedVoxel = new Voxel(1, 42);
    world.setVoxel([3, 3, 3], expectedVoxel);
    world.setVoxel([4, 4, 4], expectedVoxel);

    let i = 0;
    let result: IteratorResult<VoxelResult>;
    while (!(result = iterator.next()).done) {
      i++;
    }

    expect(i).toBe(8);
  });
});
