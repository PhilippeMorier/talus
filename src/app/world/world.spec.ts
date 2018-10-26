import { Vector3 } from './vector3';
import { Voxel } from './voxel';
import { Index, World } from './world';

describe('world', () => {
  let world: World;

  beforeEach(() => {
    world = new World([2, 2, 2], [4, 4, 4]);
  });

  it('should set & get a voxel', () => {
    const position: Index = { chunk: [0, 0, 0], voxel: [0, 0, 0] };
    const voxel = new Voxel(1, 42);
    world.setVoxel(position, voxel);

    expect(world.getVoxel(position)).toEqual(voxel);
  });

  it('should create new chunks after adding voxel', () => {
    const position: Index = { chunk: [0, 0, 0], voxel: [0, 0, 0] };
    const voxel = new Voxel(1, 42);

    expect(world.chunks[0][0][0]).toBeUndefined();
    world.setVoxel(position, voxel);
    expect(world.chunks[0][0][0]).toBeDefined();
  });

  it('should set a voxel given an absolute position', () => {
    const voxel = new Voxel(1, 42);
    world.setVoxelByAbsolutePosition([4, 4, 4], voxel);

    expect(world.chunks[1][1][1]).toBeDefined();
    expect(world.chunks[1][1][1].getVoxel([0, 0, 0])).toBeDefined();
    expect(world.chunks[1][1][1].getVoxel([0, 0, 0])).toEqual(voxel);
  });

  it('should get a voxel given an absolute position', () => {
    const voxel = new Voxel(1, 42);
    const position: Vector3 = [4, 4, 4];
    world.setVoxelByAbsolutePosition(position, voxel);

    expect(world.getVoxelByAbsolutePosition(position)).toEqual(voxel);
  });
});
