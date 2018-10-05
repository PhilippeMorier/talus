import { Chunk } from './chunk';
import { Vector3, X, Y, Z } from './vector3';
import { Voxel } from './world';

describe('chunk', () => {
  let chunk: Chunk;
  const size: Vector3 = [2, 2, 2];

  beforeEach(() => {
    chunk = new Chunk(size, [0, 0, 0]);
  });

  it('should initialize chunk', () => {
    expect(chunk.voxels.length).toEqual(size[X]);
    for (let x = 0; x < size[X]; x++) {
      expect(chunk.voxels[x].length).toEqual(size[Y]);
      for (let y = 0; y < size[Y]; y++) {
        expect(chunk.voxels[x][y].length).toEqual(size[Z]);
      }
    }
  });

  it('should set and get the same getVoxel', () => {
    chunk.voxels[0][0][0] = new Voxel(1, 42);

    expect(chunk.voxels[0][0][0].type).toEqual(42);
  });

  it('should have `undefined` for empty voxel', () => {
    expect(chunk.voxels[0][0][0]).toBeUndefined();
    expect(chunk.voxels[1][1][1]).toBeUndefined();
  });

  it('should set position correctly', () => {
    let testChunk = new Chunk([2, 2, 2], [0, 0, 0]);
    expect(testChunk.position).toEqual([0, 0, 0]);

    testChunk = new Chunk([2, 2, 2], [1, 1, 1]);
    expect(testChunk.position).toEqual([2, 2, 2]);

    testChunk = new Chunk([2, 2, 2], [0, 1, 2]);
    expect(testChunk.position).toEqual([0, 2, 4]);
  });
});
