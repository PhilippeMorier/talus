import { Voxel } from './world';
import { Vector3 } from './vector3';
import { Chunk } from './chunk';

describe('chunk', () => {
  let chunk: Chunk;
  const size: Vector3 = [4, 2, 3];

  beforeEach(() => {
    chunk = new Chunk(size);
  });

  it('should initialize chunk', () => {
    expect(chunk.voxels.length).toEqual(size[0]);
    for (let x = 0; x < size[0]; x++) {
      expect(chunk.voxels[x].length).toEqual(size[1]);
      for (let y = 0; y < size[1]; y++) {
        expect(chunk.voxels[x][y].length).toEqual(size[2]);
      }
    }
  });

  it('should set and get the same getVoxel', () => {
    chunk.voxels[0][1][2] = new Voxel(1, 42);

    expect(chunk.voxels[0][1][2].type).toEqual(42);
  });
});
