import { Grid } from '@talus/vdb';

describe('Grid', () => {
  it('should get background', () => {
    const grid = new Grid(-1);

    expect(grid.background).toEqual(-1);
  });

  it('should iterate over each activated voxel', () => {
    const grid = new Grid(-1);
    const accessor = grid.getAccessor();

    accessor.setValueOn({ x: 2, y: 1, z: 0 }, 42);
    accessor.setValueOn({ x: 845, y: 64, z: 242 }, 42);
    accessor.setValueOn({ x: 1000, y: 200000, z: 4000 }, 42);

    let counter = 0;
    for (const voxel of grid.beginVoxelOn()) {
      counter++;
      expect(voxel.value).toEqual(42);
    }

    expect(counter).toEqual(3);
  });
});
