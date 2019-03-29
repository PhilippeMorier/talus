import { toVoxel, toVoxelValue, Voxel } from './voxel';

describe('voxel', () => {
  it('should convert voxel', () => {
    const expectedVoxel = new Voxel(32767, 65535);
    const voxelValue = toVoxelValue(expectedVoxel);
    expect(toVoxel(voxelValue)).toEqual(expectedVoxel);
  });
});
