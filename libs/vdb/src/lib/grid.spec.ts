import { Coord, Grid } from '@talus/vdb';

describe('Grid', () => {
  it('should get background', () => {
    const grid = new Grid(-1);

    expect(grid.background).toEqual(-1);
  });

  it('should iterate over each activated voxel', () => {
    const grid = new Grid(-1);
    const accessor = grid.getAccessor();

    accessor.setValueOn(new Coord(2, 1, 0), 42);
    accessor.setValueOn(new Coord(845, 64, 242), 42);
    accessor.setValueOn(new Coord(1000, 200000, 4000), 42);

    let counter = 0;
    for (const voxel of grid.beginVoxelOn()) {
      counter++;
      expect(voxel.value).toEqual(42);
    }

    expect(counter).toEqual(3);
  });
});
